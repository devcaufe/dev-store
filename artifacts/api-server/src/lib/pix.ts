/**
 * PIX BR Code (EMV-MPM) generator.
 *
 * The generator takes a static merchant payload and rebuilds it with a
 * server-controlled transaction amount (field 54). The CRC16 (field 63) is
 * recomputed at the end using the CCITT-FALSE polynomial (0x1021, init
 * 0xFFFF), which is what Banco Central do Brasil specifies.
 *
 * Security notes:
 * - The amount is ALWAYS derived from a server-validated integer (cents). The
 *   client never supplies the BR Code itself, only the amount, so an attacker
 *   cannot reuse this function to embed an arbitrary destination.
 * - Merchant identification (PIX key, name, city) is configured here and is
 *   not user-controllable.
 */

const PIX_KEY = "devcaufe@gmail.com";
const MERCHANT_NAME = "Caua Felipe Santanna Da S";
const MERCHANT_CITY = "Aracaju";
const TXID = "***";

// ---------- helpers ----------

function tlv(id: string, value: string): string {
  if (id.length !== 2) {
    throw new Error(`Invalid TLV id "${id}"`);
  }
  const len = value.length.toString().padStart(2, "0");
  if (len.length !== 2) {
    throw new Error(`TLV value too long for field ${id} (${value.length})`);
  }
  return `${id}${len}${value}`;
}

/**
 * CRC-16/CCITT-FALSE — polynomial 0x1021, initial value 0xFFFF, no reflection,
 * no XOR-out. This is the algorithm specified by Banco Central in the PIX
 * EMV-MPM standard (field 63).
 */
export function crc16Ccitt(input: string): string {
  let crc = 0xffff;
  const bytes = Buffer.from(input, "utf8");

  for (const byte of bytes) {
    crc ^= byte << 8;
    for (let i = 0; i < 8; i++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
      crc &= 0xffff;
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, "0");
}

/**
 * Format an integer cents amount as the EMV transaction amount (field 54).
 * Brazilian PIX requires "." as decimal separator and no thousand separators.
 */
function formatAmount(amountCents: number): string {
  if (!Number.isInteger(amountCents) || amountCents <= 0) {
    throw new Error("amountCents must be a positive integer");
  }
  const reais = Math.floor(amountCents / 100);
  const cents = amountCents % 100;
  return `${reais}.${cents.toString().padStart(2, "0")}`;
}

// ---------- public API ----------

export interface BuiltPixCode {
  brCode: string;
  amountCents: number;
  merchantName: string;
  merchantCity: string;
}

/**
 * Build a PIX BR Code with the given amount in cents. The merchant data is
 * baked in from the constants above.
 */
export function buildPixBrCode(amountCents: number): BuiltPixCode {
  // Field 26 — Merchant Account Information (PIX)
  //   00 GUI = "br.gov.bcb.pix"
  //   01 Chave PIX
  const merchantAccount =
    tlv("00", "br.gov.bcb.pix") + tlv("01", PIX_KEY);

  // Field 62 — Additional Data Field Template
  //   05 Reference Label / TXID
  const additionalData = tlv("05", TXID);

  const amountStr = formatAmount(amountCents);

  const payloadWithoutCrc =
    tlv("00", "01") + // Payload Format Indicator
    tlv("26", merchantAccount) + // Merchant Account Information (PIX)
    tlv("52", "0000") + // Merchant Category Code
    tlv("53", "986") + // Currency: 986 = BRL
    tlv("54", amountStr) + // Transaction Amount
    tlv("58", "BR") + // Country
    tlv("59", MERCHANT_NAME) + // Merchant Name
    tlv("60", MERCHANT_CITY) + // Merchant City
    tlv("62", additionalData) + // Additional Data Field
    "6304"; // Field 63 (CRC) header — value follows

  const crc = crc16Ccitt(payloadWithoutCrc);

  return {
    brCode: payloadWithoutCrc + crc,
    amountCents,
    merchantName: MERCHANT_NAME,
    merchantCity: MERCHANT_CITY,
  };
}
