import { Router, type IRouter } from "express";
import { CreateOrderBody } from "@workspace/api-zod";
import { db, ordersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { buildPixBrCode } from "../lib/pix";
import { buildBtcUri } from "../lib/btc";
import { renderQrDataUrl } from "../lib/qrcode";
import { generatePublicToken } from "../lib/tokens";
import { createOrderLimiter } from "../middlewares/rateLimit";
import {
  createMercadoPagoPixCharge,
  createMercadoPagoPreference,
  fetchMercadoPagoPayment,
  mercadoPagoEnabled,
} from "../lib/mercadopago";
import { estimateQuote, type Category } from "../lib/pricing";
import { logger } from "../lib/logger";

const router: IRouter = Router();

/**
 * POST /api/orders
 *
 * Creates a new project order.
 *
 * Security:
 * - Body validated with the generated Zod schema (length, format).
 * - Amount is ALWAYS computed server-side from the validated category +
 *   description (see lib/pricing.ts). The client cannot influence the price.
 * - Rate-limited per IP.
 * - The PIX BR Code is built server-side from the validated amount; we never
 *   accept a client-provided BR Code.
 * - For card payments we create a Mercado Pago Checkout Pro preference; the
 *   buyer is redirected to MP and we never touch card data ourselves.
 * - The response only ever exposes the publicToken, never the database UUID.
 */
router.post("/orders", createOrderLimiter, async (req, res, next) => {
  try {
    const data = CreateOrderBody.parse(req.body);

    // Server-authoritative pricing — we never trust a client-side amount.
    const quote = estimateQuote(data.category as Category, data.description);
    const amountCents = quote.amountCents;

    const publicToken = generatePublicToken();

    let pixPayload: string | null = null;
    let mpPaymentId: string | null = null;
    let mpPreferenceId: string | null = null;
    let cardCheckoutUrl: string | null = null;

    if (data.paymentMethod === "pix") {
      // Prefer Mercado Pago (auto-confirmation via webhook). Fall back to the
      // local BR Code generator if MP is not configured or if the API call
      // fails — we never want to leave the customer without a way to pay.
      if (mercadoPagoEnabled()) {
        try {
          const charge = await createMercadoPagoPixCharge({
            amountCents,
            description: data.title,
            payerEmail: data.contactEmail,
            externalReference: publicToken,
          });
          pixPayload = charge.brCode;
          mpPaymentId = charge.paymentId;
        } catch (err) {
          logger.error(
            { err },
            "Mercado Pago PIX charge failed; falling back to local BR Code",
          );
          pixPayload = buildPixBrCode(amountCents).brCode;
        }
      } else {
        pixPayload = buildPixBrCode(amountCents).brCode;
      }
    } else if (data.paymentMethod === "card") {
      // Card payments require Mercado Pago. We create a Checkout Pro
      // preference; the buyer is redirected to MP-hosted checkout that
      // settles directly into the configured MP account.
      if (!mercadoPagoEnabled()) {
        res.status(503).json({
          error:
            "Pagamento com cartão indisponível no momento. Por favor, escolha PIX.",
          code: "CARD_UNAVAILABLE",
        });
        return;
      }
      try {
        const orderUrl = buildOrderUrl(publicToken);
        const pref = await createMercadoPagoPreference({
          amountCents,
          description: data.title,
          payerEmail: data.contactEmail,
          externalReference: publicToken,
          successUrl: orderUrl,
          failureUrl: orderUrl,
          pendingUrl: orderUrl,
        });
        mpPreferenceId = pref.preferenceId;
        cardCheckoutUrl = pref.initPoint;
      } catch (err) {
        logger.error({ err }, "Mercado Pago preference creation failed");
        res.status(502).json({
          error:
            "Não foi possível iniciar o pagamento com cartão. Tente novamente em instantes ou use PIX.",
          code: "CARD_GATEWAY_ERROR",
        });
        return;
      }
    }

    const [inserted] = await db
      .insert(ordersTable)
      .values({
        publicToken,
        clientName: data.clientName,
        contactEmail: data.contactEmail,
        category: data.category,
        title: data.title,
        description: data.description,
        amountCents,
        paymentMethod: data.paymentMethod,
        status: "awaiting_payment",
        pixPayload,
        mpPaymentId,
        mpPreferenceId,
        cardCheckoutUrl,
      })
      .returning();

    if (!inserted) {
      throw new Error("Failed to insert order");
    }

    const response = await buildOrderResponse(inserted);
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/orders/:publicToken
 *
 * Returns an order by its opaque token. Token has 128 bits of entropy, so
 * enumeration is infeasible. We return a sanitized projection (no internal id,
 * no client email, no description — those are PII / business details that
 * don't need to live in the URL-visible payload).
 */
router.get("/orders/:publicToken", async (req, res, next) => {
  try {
    const { publicToken } = req.params;
    if (!publicToken || publicToken.length < 16 || publicToken.length > 64) {
      res.status(404).json({ error: "Pedido não encontrado.", code: "NOT_FOUND" });
      return;
    }

    const [order] = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.publicToken, publicToken))
      .limit(1);

    if (!order) {
      res.status(404).json({ error: "Pedido não encontrado.", code: "NOT_FOUND" });
      return;
    }

    // Opportunistic refresh: if the order is still awaiting payment AND we have
    // an MP payment id, ask Mercado Pago for the latest status. This way the
    // frontend's polling reflects payment confirmation even if the webhook was
    // delayed/blocked. Failures here are non-fatal.
    let current = order;
    if (
      current.status === "awaiting_payment" &&
      current.mpPaymentId &&
      mercadoPagoEnabled()
    ) {
      try {
        const remote = await fetchMercadoPagoPayment(current.mpPaymentId);
        if (remote.status === "approved") {
          const [updated] = await db
            .update(ordersTable)
            .set({ status: "paid" })
            .where(eq(ordersTable.id, current.id))
            .returning();
          if (updated) current = updated;
        } else if (remote.status === "cancelled" || remote.status === "rejected") {
          const [updated] = await db
            .update(ordersTable)
            .set({ status: "cancelled" })
            .where(eq(ordersTable.id, current.id))
            .returning();
          if (updated) current = updated;
        }
      } catch (err) {
        logger.warn({ err }, "Mercado Pago status refresh failed");
      }
    }

    const response = await buildOrderResponse(current);
    res.json(response);
  } catch (err) {
    next(err);
  }
});

interface OrderRow {
  id: string;
  publicToken: string;
  category: string;
  title: string;
  amountCents: number;
  paymentMethod: string;
  status: string;
  createdAt: Date;
  pixPayload: string | null;
  mpPaymentId: string | null;
  mpPreferenceId: string | null;
  cardCheckoutUrl: string | null;
}

async function buildOrderResponse(order: OrderRow) {
  const base = {
    publicToken: order.publicToken,
    category: order.category,
    title: order.title,
    amountCents: order.amountCents,
    paymentMethod: order.paymentMethod,
    status: order.status,
    createdAt: order.createdAt.toISOString(),
    pix: null as null | {
      brCode: string;
      qrImageDataUrl: string;
      amountCents: number;
      merchantName: string;
      merchantCity: string;
    },
    btc: null as null | {
      uri: string;
      address: string;
      amountBtc: string;
      qrImageDataUrl: string;
    },
    cardCheckoutUrl: null as null | string,
  };

  if (order.paymentMethod === "pix" && order.pixPayload) {
    base.pix = {
      brCode: order.pixPayload,
      qrImageDataUrl: await renderQrDataUrl(order.pixPayload),
      amountCents: order.amountCents,
      merchantName: "Dev Store BR",
      merchantCity: "Aracaju",
    };
  } else if (order.paymentMethod === "btc") {
    const btc = buildBtcUri(order.amountCents);
    base.btc = {
      ...btc,
      qrImageDataUrl: await renderQrDataUrl(btc.uri),
    };
  } else if (order.paymentMethod === "card") {
    base.cardCheckoutUrl = order.cardCheckoutUrl;
  }

  return base;
}

/**
 * Build the public order URL on the user-facing site. Used as the back_url
 * Mercado Pago redirects to after the buyer pays.
 *
 * Override with PUBLIC_SITE_URL when running in deployment so the buyer is
 * sent back to the .replit.app (or custom) domain instead of the dev URL.
 */
function buildOrderUrl(publicToken: string): string {
  const explicit = process.env.PUBLIC_SITE_URL;
  if (explicit) {
    return `${explicit.replace(/\/$/, "")}/pedido/${publicToken}`;
  }
  const domain = process.env.REPLIT_DOMAINS?.split(",")[0];
  if (domain) {
    return `https://${domain}/pedido/${publicToken}`;
  }
  return `/pedido/${publicToken}`;
}

export default router;
