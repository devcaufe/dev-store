import { Router, type IRouter } from "express";
import { GetBtcUriQueryParams } from "@workspace/api-zod";
import { buildBtcUri } from "../lib/btc";
import { renderQrDataUrl } from "../lib/qrcode";

const router: IRouter = Router();

/**
 * GET /api/payments/btc-uri?amountCents=...
 *
 * Standalone endpoint to preview the BTC URI for a given amount without
 * creating an order. Useful for the "before you submit" payment preview in
 * the request form.
 */
router.get("/payments/btc-uri", async (req, res, next) => {
  try {
    const params = GetBtcUriQueryParams.parse({
      amountCents: Number(req.query["amountCents"]),
    });
    const btc = buildBtcUri(params.amountCents);
    const qrImageDataUrl = await renderQrDataUrl(btc.uri);
    res.json({ ...btc, qrImageDataUrl });
  } catch (err) {
    next(err);
  }
});

export default router;
