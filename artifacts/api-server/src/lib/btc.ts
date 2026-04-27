/**
 * Bitcoin BIP21 URI builder.
 *
 * BTC has volatile pricing — to keep the implementation deterministic and
 * avoid depending on a third-party price API on every request, we expose the
 * amount in BTC ONLY when an explicit BRL→BTC rate is provided via the
 * BTC_BRL_RATE environment variable. Otherwise we emit a URI without an
 * amount (still valid BIP21) and let the user enter it manually in their
 * wallet. This is safe-by-default: we never silently invent a wrong amount.
 */

const BTC_ADDRESS = "bc1qcgfrv79marhzve5cnmdl08khxx67d0477chjc8";

export interface BtcUri {
  uri: string;
  address: string;
  amountBtc: string;
}

export function buildBtcUri(amountCents: number): BtcUri {
  if (!Number.isInteger(amountCents) || amountCents <= 0) {
    throw new Error("amountCents must be a positive integer");
  }

  const rateStr = process.env["BTC_BRL_RATE"];
  let amountBtc = "";
  if (rateStr) {
    const rate = Number(rateStr);
    if (Number.isFinite(rate) && rate > 0) {
      const reais = amountCents / 100;
      amountBtc = (reais / rate).toFixed(8);
    }
  }

  const uri =
    amountBtc !== ""
      ? `bitcoin:${BTC_ADDRESS}?amount=${amountBtc}`
      : `bitcoin:${BTC_ADDRESS}`;

  return {
    uri,
    address: BTC_ADDRESS,
    amountBtc,
  };
}
