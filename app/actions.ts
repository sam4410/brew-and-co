"use server";

import { canSeat, formatDate, formatTime, todayInShop } from "@/lib/hours";
import { usPhone } from "@/lib/phone";

export type ReserveState = {
  ok?: boolean;
  summary?: string;
  errors?: Partial<Record<"name" | "party" | "date" | "time" | "phone" | "email" | "form", string>>;
  values?: Record<string, string>;
};

const unavailable = "We couldn't save your booking just now. Please try again in a moment or call us.";

/**
 * Validates a table request, then saves it through the n8n reservation webhook, which re-checks the same rules.
 * Trust boundary: re-checks everything the form already constrains.
 */
export async function reserveTable(_prev: ReserveState, formData: FormData): Promise<ReserveState> {
  const get = (k: string) => String(formData.get(k) ?? "").trim();
  const values = { name: get("name"), party: get("party"), date: get("date"), time: get("time"), phone: get("phone"), email: get("email") };
  const errors: ReserveState["errors"] = {};

  if (!values.name || values.name.length > 80) errors.name = "Enter your name (up to 80 characters).";

  const party = Number(values.party);
  if (!Number.isInteger(party) || party < 1 || party > 12)
    errors.party = "Party size must be between 1 and 12. For bigger groups, call us.";

  if (!/^\d{4}-\d{2}-\d{2}$/.test(values.date) || Number.isNaN(Date.parse(values.date)))
    errors.date = "Pick a date.";
  else if (values.date < todayInShop()) errors.date = "Pick today or a later date.";

  if (!errors.date && !canSeat(values.date, values.time))
    errors.time = "Pick a time while we're open, at least an hour before closing.";

  const phone = usPhone(values.phone);
  if (!phone) errors.phone = "Enter a 10-digit US phone number.";

  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = "Enter a valid email, or leave it blank.";

  if (Object.keys(errors).length) return { errors, values };

  const url = process.env.N8N_RESERVATION_URL;
  const secret = process.env.N8N_RESERVATION_SECRET;
  if (!url || !secret) {
    console.error("reserveTable: N8N_RESERVATION_URL or N8N_RESERVATION_SECRET is not set");
    return { errors: { form: unavailable }, values };
  }

  let result: { result?: string; reason?: string };
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Brew-Secret": secret },
      body: JSON.stringify({
        guest_name: values.name,
        group_size: party,
        booking_date: values.date,
        booking_time: values.time,
        guest_phone: phone,
        guest_email: values.email,
      }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    result = await res.json();
  } catch (e) {
    console.error("reserveTable: reservation webhook failed", e);
    return { errors: { form: unavailable }, values };
  }

  // n8n has the final say (e.g. a time earlier today that has already passed).
  if (result.result !== "booked") {
    console.error("reserveTable: booking rejected by n8n:", result.reason);
    return { errors: { form: "We couldn't book that time. Please pick another time or call us." }, values };
  }

  return {
    ok: true,
    summary: `Table booked for ${party} on ${formatDate(values.date)} at ${formatTime(values.time)}. See you soon.`,
  };
}
