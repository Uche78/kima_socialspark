import QRCode from "qrcode";

/** A QR code as inline SVG (crisp at any size, and rendered by html-to-image without network requests). */
export function QrCode({ text, size, color = "#000", background = "#fff" }: { text: string; size: number; color?: string; background?: string }) {
  const qr = QRCode.create(text, { errorCorrectionLevel: "M" });
  const n = qr.modules.size;
  const quiet = 2;
  let d = "";
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) if (qr.modules.get(x, y)) d += `M${x + quiet} ${y + quiet}h1v1h-1z`;
  }
  const total = n + quiet * 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${total} ${total}`} shapeRendering="crispEdges" style={{ display: "block" }}>
      <rect width={total} height={total} fill={background} />
      <path d={d} fill={color} />
    </svg>
  );
}

/** A website as a full URL for a QR code ("example.com" → "https://example.com"). */
export function qrUrl(website: string | null | undefined) {
  const w = website?.trim();
  if (!w) return null;
  return /^https?:\/\//i.test(w) ? w : `https://${w}`;
}
