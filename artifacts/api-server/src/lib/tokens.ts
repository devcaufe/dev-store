import { randomBytes } from "node:crypto";

/**
 * Generate an opaque, URL-safe public token for an order. We use 16 random
 * bytes (128 bits) encoded in base64url — enough entropy that brute-forcing
 * a valid token is infeasible. This is the only identifier exposed to the
 * client; the database UUID is never sent over the wire.
 */
export function generatePublicToken(): string {
  return randomBytes(16).toString("base64url");
}
