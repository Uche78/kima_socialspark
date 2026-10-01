// Formatting and validation for contact details on the Brand & voice page.

/**
 * Formats a North American phone number as it's typed: (416) 555-0142.
 * A leading 1 (country code) becomes "+1 ", digits past ten become an extension.
 * Separators are only added before a following digit, so backspacing works naturally.
 */
export function formatPhone(input: string): string {
  let digits = input.replace(/\D/g, "");
  let prefix = "";
  // North American area codes never start with 1, so a leading 1 is the country code.
  if (digits.startsWith("1")) {
    prefix = "+1 ";
    digits = digits.slice(1);
  }
  if (!digits) return prefix.trim();
  const area = digits.slice(0, 3);
  const mid = digits.slice(3, 6);
  const last = digits.slice(6, 10);
  const ext = digits.slice(10, 16);
  let out = `(${area}`;
  if (mid) out += `) ${mid}`;
  if (last) out += `-${last}`;
  if (ext) out += ` ext. ${ext}`;
  return prefix + out;
}

export function isValidPhone(value: string | null | undefined): boolean {
  if (!value) return true; // optional
  const digits = value.replace(/\D/g, "").replace(/^1/, "");
  return digits.length >= 10 && digits.length <= 16;
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isValidEmail(value: string | null | undefined): boolean {
  if (!value) return true; // optional
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}
