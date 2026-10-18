"use server";

import { canSeat, formatDate, formatTime, todayInShop } from "@/lib/hours";

export type ReserveState = {
  ok?: boolean;
  summary?: string;
  errors?: Partial<Record<"name" | "party" | "date" | "time", string>>;
  values?: Record<string, string>;
};

/** Validates a table request. Trust boundary: re-checks everything the form already constrains. Nothing is stored yet. */
export async function reserveTable(_prev: ReserveState, formData: FormData): Promise<ReserveState> {
  const get = (k: string) => String(formData.get(k) ?? "").trim();
  const values = { name: get("name"), party: get("party"), date: get("date"), time: get("time") };
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

  if (Object.keys(errors).length) return { errors, values };
  return {
    ok: true,
    summary: `Table requested for ${party} on ${formatDate(values.date)} at ${formatTime(values.time)}. See you soon.`,
  };
}
