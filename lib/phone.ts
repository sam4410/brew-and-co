/** US phone as "+1XXXXXXXXXX", or null. Accepts any punctuation and an optional leading 1. */
export function usPhone(raw: string) {
  let digits = raw.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
  return digits.length === 10 ? `+1${digits}` : null;
}
