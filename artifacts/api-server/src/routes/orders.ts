import { Router, type IRouter } from "express";
import { CreateOrderBody } from "@workspace/api-zod";
import { db, ordersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { buildPixBrCode } from "../lib/pix";
import { buildBtcUri } from "../lib/btc";
import { renderQrDataUrl } from "../lib/qrcode";
import { generatePublicToken } from "../lib/tokens";
import { createOrderLimiter } from "../middlewares/rateLimit";
import { createMercadoPagoPixCharge, fetchMercadoPagoPayment, mercadoPagoEnabled } from "../lib/mercadopago";
import { logger } from "../lib/logger";

const router: IRouter = Router();

/**
 * POST /api/orders
 *
 * Creates a new project order.
 *
 * Security:
 * - Body validated with the generated Zod schema (length, format, range).
 * - Amount range enforced (R$ 5,00 .. R$ 50.000,00) on the schema, NOT trusted
 *   from the client.
 * - Rate-limited per IP.
 * - The PIX BR Code is built server-side from the validated amount; we never
 *   accept a client-provided BR Code.
 * - The response only ever exposes the publicToken, never the database UUID.
 */
router.post("/orders", createOrderLimiter, async (req, res, next) => {
  try {
    const data = CreateOrderBody.parse(req.body);

    const publicToken = generatePublicToken();

    let pixPayload: string | null = null;
    let mpPaymentId: string | null = null;

    if (data.paymentMethod === "pix") {
      // Prefer Mercado Pago (auto-confirmation via webhook). Fall back to the
      // local BR Code generator if MP is not configured or if the API call
      // fails — we never want to leave the customer without a way to pay.
      if (mercadoPagoEnabled()) {
        try {
          const charge = await createMercadoPagoPixCharge({
            amountCents: data.amountCents,
            description: data.title,
            payerEmail: data.contactEmail,
            externalReference: publicToken,
          });
          pixPayload = charge.brCode;
          mpPaymentId = charge.paymentId;
        } catch (err) {
          logger.error({ err }, "Mercado Pago PIX charge failed; falling back to local BR Code");
          pixPayload = buildPixBrCode(data.amountCents).brCode;
        }
      } else {
        pixPayload = buildPixBrCode(data.amountCents).brCode;
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
        amountCents: data.amountCents,
        paymentMethod: data.paymentMethod,
        status: "awaiting_payment",
        pixPayload,
        mpPaymentId,
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
        if (remote.status === "approved" && current.status !== "paid") {
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
    // Card processing requires a real PCI-compliant gateway (Stripe,
    // MercadoPago, Pagar.me, etc.). We expose a null URL so the frontend can
    // tell the user the method is being integrated. We never ship a fake
    // checkout link.
    base.cardCheckoutUrl = null;
  }

  return base;
}

export default router;
