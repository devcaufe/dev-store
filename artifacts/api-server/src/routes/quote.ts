import { Router, type IRouter } from "express";
import { EstimateQuoteBody } from "@workspace/api-zod";
import { estimateQuote, type Category } from "../lib/pricing";
import { quoteEstimateLimiter } from "../middlewares/rateLimit";

const router: IRouter = Router();

/**
 * POST /api/quote/estimate
 *
 * Returns a deterministic, server-side price estimate for the given
 * category + description. Same inputs → same output. Used by the request
 * form to show a live, automatically-calculated value as the user types.
 *
 * Security:
 * - Body validated with the generated Zod schema.
 * - Rate-limited per IP (the form debounces, but we still cap abuse).
 * - The endpoint is read-only and never trusts the result for the actual
 *   charge: /api/orders re-runs the same function before persisting.
 */
router.post("/quote/estimate", quoteEstimateLimiter, (req, res, next) => {
  try {
    const data = EstimateQuoteBody.parse(req.body);
    const result = estimateQuote(data.category as Category, data.description);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
