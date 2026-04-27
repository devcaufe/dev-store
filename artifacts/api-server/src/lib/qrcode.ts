import QRCode from "qrcode";

/**
 * Render a payload as a PNG QR code, returned as a base64 data URL ready to
 * be used directly as an <img src>. We use error correction level "M" — a
 * sensible default that survives mild printing/scanning damage without
 * making the code visually overcrowded.
 */
export async function renderQrDataUrl(payload: string): Promise<string> {
  return QRCode.toDataURL(payload, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: 360,
  });
}
