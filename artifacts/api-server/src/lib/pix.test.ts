/**
 * Tests for PIX BR Code generation.
 *
 * Run with: pnpm --filter @workspace/api-server exec tsx src/lib/pix.test.ts
 *
 * We don't pull in a full test runner here to keep zero extra deps; the
 * assertions throw on failure with descriptive messages.
 */
import assert from "node:assert/strict";
import { buildPixBrCode, crc16Ccitt } from "./pix";

// --- CRC16 known vectors (CCITT-FALSE) ---
// "123456789" → 0x29B1 is the canonical test vector for CRC-16/CCITT-FALSE.
assert.equal(crc16Ccitt("123456789"), "29B1", "crc16 canonical vector failed");
// Empty input
assert.equal(crc16Ccitt(""), "FFFF", "crc16 empty input expected FFFF");

// --- BR Code structural tests ---
const code = buildPixBrCode(15000); // R$ 150,00

// Always starts with payload format indicator 0002 01
assert.ok(code.brCode.startsWith("000201"), "BR Code must start with 000201");

// Currency 53 must be BRL (986)
assert.ok(code.brCode.includes("5303986"), "Currency must be BRL (986)");

// Country code must be BR
assert.ok(code.brCode.includes("5802BR"), "Country must be BR");

// The amount field must be present and equal "150.00"
assert.ok(
  code.brCode.includes("5406150.00"),
  `Amount field missing or wrong: ${code.brCode}`,
);

// CRC at the end must match a fresh recomputation of the payload up to "6304"
const idx = code.brCode.lastIndexOf("6304");
assert.notEqual(idx, -1, "CRC field 6304 not found");
const payload = code.brCode.slice(0, idx + 4);
const expected = crc16Ccitt(payload);
const actual = code.brCode.slice(idx + 4);
assert.equal(actual, expected, "CRC mismatch — BR Code is corrupted");

// --- Determinism: same amount → same code ---
const a = buildPixBrCode(2599).brCode;
const b = buildPixBrCode(2599).brCode;
assert.equal(a, b, "BR Code generation must be deterministic");

// --- Different amounts → different codes ---
assert.notEqual(
  buildPixBrCode(100).brCode,
  buildPixBrCode(200).brCode,
  "Different amounts must produce different BR Codes",
);

// --- Reject invalid amounts ---
for (const bad of [0, -1, 1.5, NaN, Infinity]) {
  assert.throws(
    () => buildPixBrCode(bad as number),
    `Expected throw for amountCents=${bad}`,
  );
}

console.log("PIX tests OK");
