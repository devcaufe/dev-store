import { Router, type IRouter } from "express";
import { db, ordersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  fetchMercadoPagoPayment,
  mercadoPagoEnabled,
  verifyMercadoPagoSignature,
} from "../lib/mercadopago";
import { logger } from "../lib/logger";

const router: IRouter = Router();

/**
 * POST /api/webhooks/mercadopago
 *
 * Mercado Pago notifies us of payment status changes. We:
 *   1. Verify the x-signature HMAC against MP_WEBHOOK_SECRET (rejects 401).
 *   2. Re-fetch the payment from MP using our access token (never trust the
 *      payload alone — anyone could POST a fake "approved" status).
 *   3. Match by external_reference (= our publicToken) and update the order.
 *
 * Always responds 200 once we've handled (or safely ignored) the event, so
 * MP doesn't keep retrying. Errors are logged, not surfaced.
 */
router.post("/webhooks/mercadopago", async (req, res) => {
  try {
    if (!mercadoPagoEnabled()) {
      res.status(503).json({ error: "Mercado Pago not configured" });
      return;
    }

    const xSignature = headerString(req.headers["x-signature"]);
    const xRequestId = headerString(req.headers["x-request-id"]);
    const dataId = String(req.body?.data?.id ?? req.query?.["data.id"] ?? "");

    const signatureOk = verifyMercadoPagoSignature({ xSignature, xRequestId, dataId });
    if (!signatureOk) {
      logger.warn({ xRequestId }, "Mercado Pago webhook signature invalid");
      res.status(401).json({ error: "invalid signature" });
      return;
    }

    if (!dataId) {
      // Some MP test pings have no data.id — ack and move on.
      res.status(200).json({ ok: true });
      return;
    }

    const remote = await fetchMercadoPagoPayment(dataId);
    const externalRef = remote.externalReference;
    if (!externalRef) {
      logger.warn({ paymentId: remote.id }, "MP webhook payment has no external_reference");
      res.status(200).json({ ok: true });
      return;
    }

    const newStatus = mapMpStatus(remote.status);
    if (!newStatus) {
      res.status(200).json({ ok: true });
      return;
    }

    await db
      .update(ordersTable)
      .set({ status: newStatus, mpPaymentId: remote.id })
      .where(eq(ordersTable.publicToken, externalRef));

    logger.info(
      { paymentId: remote.id, externalRef, mpStatus: remote.status, orderStatus: newStatus },
      "MP webhook processed",
    );

    res.status(200).json({ ok: true });
  } catch (err) {
    logger.error({ err }, "MP webhook handler error");
    // Still 200 — Mercado Pago retries on non-2xx, and a runtime error here is
    // ours to fix, not theirs to retry.
    res.status(200).json({ ok: false });
  }
});

function headerString(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

function mapMpStatus(mpStatus: string): "paid" | "cancelled" | null {
  switch (mpStatus) {
    case "approved":
      return "paid";
    case "cancelled":
    case "rejected":
    case "refunded":
    case "charged_back":
      return "cancelled";
    default:
      return null;
  }
}

export default router;
