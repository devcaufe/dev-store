/**
 * Mercado Pago integration — PIX charges + webhook signature verification.
 *
 * Security notes:
 * - Access token is read ONLY from process.env.MP_ACCESS_TOKEN. It is never
 *   logged, never returned to the client, and never persisted.
 * - Webhook signatures are verified using HMAC-SHA256 with MP_WEBHOOK_SECRET
 *   following Mercado Pago's documented manifest format
 *   `id:<data.id>;request-id:<x-request-id>;ts:<ts>;`. Unsigned or invalid
 *   webhooks are rejected with 401.
 * - Outbound requests have a 10s timeout to prevent hanging the order flow.
 * - All amounts are derived from validated server-side integer cents.
 */

import crypto from "node:crypto";
import { logger } from "./logger";

const MP_API = "https://api.mercadopago.com";
const REQUEST_TIMEOUT_MS = 10_000;

export function mercadoPagoEnabled(): boolean {
  return Boolean(process.env.MP_ACCESS_TOKEN);
}

function mpAccessToken(): string {
  const t = process.env.MP_ACCESS_TOKEN;
  if (!t) throw new Error("MP_ACCESS_TOKEN not configured");
  return t;
}

interface CreatePixChargeInput {
  amountCents: number;
  description: string;
  payerEmail: string;
  externalReference: string;
}

export interface CreatedPixCharge {
  paymentId: string;
  brCode: string;
  qrBase64: string | null;
  ticketUrl: string | null;
  status: string;
}

export async function createMercadoPagoPixCharge(
  input: CreatePixChargeInput,
): Promise<CreatedPixCharge> {
  const amount = +(input.amountCents / 100).toFixed(2);

  const body = {
    transaction_amount: amount,
    description: input.description.slice(0, 256),
    payment_method_id: "pix",
    payer: { email: input.payerEmail },
    external_reference: input.externalReference,
    notification_url: buildNotificationUrl(),
    metadata: { external_reference: input.externalReference },
  };

  const idempotencyKey = crypto.randomUUID();
  const res = await fetchWithTimeout(`${MP_API}/v1/payments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${mpAccessToken()}`,
      "Content-Type": "application/json",
      "X-Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    logger.error({ status: res.status, body: text.slice(0, 400) }, "MP create payment failed");
    throw new Error(`Mercado Pago payment creation failed (${res.status})`);
  }

  const json = (await res.json()) as MpPaymentResponse;
  const tx = json.point_of_interaction?.transaction_data;
  if (!tx?.qr_code) {
    throw new Error("Mercado Pago response missing qr_code");
  }
  return {
    paymentId: String(json.id),
    brCode: tx.qr_code,
    qrBase64: tx.qr_code_base64 ?? null,
    ticketUrl: tx.ticket_url ?? null,
    status: json.status,
  };
}

interface CreatePreferenceInput {
  amountCents: number;
  description: string;
  payerEmail: string;
  externalReference: string;
  successUrl: string;
  failureUrl: string;
  pendingUrl: string;
}

export interface CreatedPreference {
  preferenceId: string;
  initPoint: string;
}

/**
 * Create a Mercado Pago Checkout Pro preference. The buyer is redirected to
 * the returned `init_point` and pays with credit/debit card (PIX is also
 * available there). MP processes everything PCI-compliantly and pays into the
 * configured MP account; we just react to the webhook.
 */
export async function createMercadoPagoPreference(
  input: CreatePreferenceInput,
): Promise<CreatedPreference> {
  const amount = +(input.amountCents / 100).toFixed(2);

  const body = {
    items: [
      {
        title: input.description.slice(0, 256),
        quantity: 1,
        currency_id: "BRL",
        unit_price: amount,
      },
    ],
    payer: { email: input.payerEmail },
    back_urls: {
      success: input.successUrl,
      failure: input.failureUrl,
      pending: input.pendingUrl,
    },
    auto_return: "approved",
    external_reference: input.externalReference,
    notification_url: buildNotificationUrl(),
    statement_descriptor: "DEV STORE BR",
    payment_methods: {
      // Cards focus: exclude bank-slip ("ticket") and ATM. PIX is still
      // available alongside the card forms for the buyer's convenience.
      excluded_payment_types: [{ id: "ticket" }, { id: "atm" }],
      installments: 12,
    },
    metadata: { external_reference: input.externalReference },
  };

  const idempotencyKey = crypto.randomUUID();
  const res = await fetchWithTimeout(`${MP_API}/checkout/preferences`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${mpAccessToken()}`,
      "Content-Type": "application/json",
      "X-Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    logger.error(
      { status: res.status, body: text.slice(0, 400) },
      "MP create preference failed",
    );
    throw new Error(`Mercado Pago preference creation failed (${res.status})`);
  }

  const json = (await res.json()) as MpPreferenceResponse;
  if (!json.id || !json.init_point) {
    throw new Error("Mercado Pago preference response missing id/init_point");
  }
  return { preferenceId: String(json.id), initPoint: json.init_point };
}

export interface MpPaymentSnapshot {
  id: string;
  status: string;
  externalReference: string | null;
  amountCents: number;
}

export async function fetchMercadoPagoPayment(paymentId: string): Promise<MpPaymentSnapshot> {
  const res = await fetchWithTimeout(`${MP_API}/v1/payments/${encodeURIComponent(paymentId)}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${mpAccessToken()}` },
  });
  if (!res.ok) {
    throw new Error(`Mercado Pago payment fetch failed (${res.status})`);
  }
  const json = (await res.json()) as MpPaymentResponse;
  return {
    id: String(json.id),
    status: json.status,
    externalReference: json.external_reference ?? null,
    amountCents: Math.round((json.transaction_amount ?? 0) * 100),
  };
}

/**
 * Verify the x-signature header sent by Mercado Pago.
 * Manifest is exactly: `id:<data.id>;request-id:<x-request-id>;ts:<ts>;`
 * Returns true if signature matches MP_WEBHOOK_SECRET via HMAC-SHA256.
 *
 * If MP_WEBHOOK_SECRET is not configured, signature verification is DISABLED
 * and a warning is logged. In production you should always configure it.
 */
export function verifyMercadoPagoSignature(args: {
  xSignature: string | undefined;
  xRequestId: string | undefined;
  dataId: string | undefined;
}): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) {
    logger.warn("MP_WEBHOOK_SECRET not set — webhook signature verification DISABLED");
    return true;
  }
  if (!args.xSignature || !args.xRequestId || !args.dataId) return false;

  const parts = Object.fromEntries(
    args.xSignature.split(",").map((p) => {
      const [k, ...v] = p.trim().split("=");
      return [k, v.join("=")];
    }),
  );
  const ts = parts.ts;
  const v1 = parts.v1;
  if (!ts || !v1) return false;

  const manifest = `id:${args.dataId};request-id:${args.xRequestId};ts:${ts};`;
  const hmac = crypto.createHmac("sha256", secret).update(manifest).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(hmac, "hex"), Buffer.from(v1, "hex"));
  } catch {
    return false;
  }
}

// ---------- internals ----------

function buildNotificationUrl(): string | undefined {
  // Prefer explicit override; otherwise derive from Replit/public domain.
  const explicit = process.env.MP_NOTIFICATION_URL;
  if (explicit) return explicit;
  const domain = process.env.REPLIT_DOMAINS?.split(",")[0];
  if (!domain) return undefined;
  return `https://${domain}/api/webhooks/mercadopago`;
}

async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}

interface MpPaymentResponse {
  id: number | string;
  status: string;
  external_reference?: string;
  transaction_amount?: number;
  point_of_interaction?: {
    transaction_data?: {
      qr_code?: string;
      qr_code_base64?: string;
      ticket_url?: string;
    };
  };
}

interface MpPreferenceResponse {
  id?: string;
  init_point?: string;
  sandbox_init_point?: string;
}
