import rateLimit from "express-rate-limit";

/**
 * Global, gentle rate limit for the whole API surface to soften scraping
 * and brute-force attempts.
 */
export const globalLimiter = rateLimit({
  windowMs: 60_000, // 1 minute
  limit: 120, // 120 req/min/IP
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    error: "Muitas requisições. Aguarde alguns instantes e tente novamente.",
    code: "RATE_LIMITED",
  },
});

/**
 * Stricter limit on order creation to prevent abuse of QR generation and
 * spammy fake-project submissions.
 */
export const createOrderLimiter = rateLimit({
  windowMs: 10 * 60_000, // 10 minutes
  limit: 8, // 8 orders / 10 min / IP
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    error:
      "Limite de solicitações atingido. Aguarde alguns minutos antes de criar um novo pedido.",
    code: "RATE_LIMITED",
  },
});
