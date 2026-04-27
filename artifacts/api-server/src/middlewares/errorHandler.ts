import type { ErrorRequestHandler } from "express";
// IMPORTANT: orval-generated schemas import from "zod" (v3 API surface), so
// runtime validation throws v3-style ZodError. We must use the same import.
import { ZodError, type ZodIssue } from "zod";

/**
 * Generic error handler. NEVER leaks internal error messages or stack traces
 * to the client. Validation errors (Zod) return 400 with a sanitized list of
 * issues; everything else returns a generic 500. The full error is sent to
 * the request logger for observability.
 */
export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof ZodError) {
    req.log.warn({ issues: err.issues }, "Validation error");
    res.status(400).json({
      error: "Dados inválidos. Revise os campos e tente novamente.",
      code: "VALIDATION_ERROR",
      issues: err.issues.map((i: ZodIssue) => ({
        path: i.path.join("."),
        message: i.message,
      })),
    });
    return;
  }

  req.log.error({ err }, "Unhandled error");
  res.status(500).json({
    error: "Ocorreu um erro inesperado. Tente novamente em instantes.",
    code: "INTERNAL_ERROR",
  });
};
