// Minimal PDF writer: each JPEG becomes one full-bleed page. Enough for printable feature sheets,
// without shipping a PDF library to the browser.

export type PdfImage = { jpeg: Uint8Array; width: number; height: number };

/** US Letter in points (8.5 × 11 in). */
export const LETTER = { width: 612, height: 792 };

export function jpegsToPdf(images: PdfImage[], page = LETTER): Uint8Array {
  const enc = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const offsets: number[] = [];
  let length = 0;
  const push = (b: Uint8Array | string) => {
    const bytes = typeof b === "string" ? enc.encode(b) : b;
    chunks.push(bytes);
    length += bytes.length;
  };
  const object = (id: number, body: (() => void) | string) => {
    offsets[id] = length;
    push(`${id} 0 obj\n`);
    if (typeof body === "string") push(body);
    else body();
    push("\nendobj\n");
  };

  // Object ids: 1 catalog, 2 pages, then per page: page, image, content.
  const pageIds = images.map((_, i) => 3 + i * 3);
  push("%PDF-1.4\n%âãÏÓ\n");
  object(1, "<< /Type /Catalog /Pages 2 0 R >>");
  object(2, `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${images.length} >>`);
  images.forEach((img, i) => {
    const pageId = pageIds[i];
    const imageId = pageId + 1;
    const contentId = pageId + 2;
    object(
      pageId,
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${page.width} ${page.height}] /Resources << /XObject << /Im${i} ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>`,
    );
    object(imageId, () => {
      push(`<< /Type /XObject /Subtype /Image /Width ${img.width} /Height ${img.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${img.jpeg.length} >>\nstream\n`);
      push(img.jpeg);
      push("\nendstream");
    });
    const draw = `q ${page.width} 0 0 ${page.height} 0 0 cm /Im${i} Do Q`;
    object(contentId, `<< /Length ${draw.length} >>\nstream\n${draw}\nendstream`);
  });

  const objectCount = 3 + images.length * 3;
  const xref = length;
  push(`xref\n0 ${objectCount}\n0000000000 65535 f \n`);
  for (let id = 1; id < objectCount; id++) push(`${String(offsets[id]).padStart(10, "0")} 00000 n \n`);
  push(`trailer\n<< /Size ${objectCount} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);

  const out = new Uint8Array(length);
  let at = 0;
  for (const c of chunks) {
    out.set(c, at);
    at += c.length;
  }
  return out;
}

/** Bytes of a JPEG data URL. */
export function dataUrlBytes(dataUrl: string): Uint8Array {
  const b64 = dataUrl.slice(dataUrl.indexOf(",") + 1);
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
