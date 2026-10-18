// Opening hours, Sunday = 0. Times are "HH:MM" in shop time (America/New_York). Days not listed are closed.
export const hours: { days: string; open: string; close: string; dows: number[] }[] = [
  { days: "Mon–Fri", open: "08:00", close: "20:00", dows: [1, 2, 3, 4, 5] },
  { days: "Sat", open: "09:00", close: "20:00", dows: [6] },
];

const minutes = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));

/** Day of week for a "YYYY-MM-DD" date, independent of the server's time zone. */
export const dayOfWeek = (date: string) => new Date(`${date}T12:00:00Z`).getUTCDay();

/** True when `time` falls between opening and one hour before closing on `date`. */
export function canSeat(date: string, time: string) {
  const h = hours.find((h) => h.dows.includes(dayOfWeek(date)));
  if (!h || !/^\d{2}:\d{2}$/.test(time)) return false;
  return minutes(time) >= minutes(h.open) && minutes(time) <= minutes(h.close) - 60;
}

/** Today in Brooklyn as "YYYY-MM-DD" (en-CA formats dates that way). */
export const todayInShop = (now = new Date()) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(now);

/** The next date (today included) that falls on `dow`, as "YYYY-MM-DD". */
export function nextOn(dow: number, today: string) {
  const d = new Date(`${today}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + ((dow - d.getUTCDay() + 7) % 7));
  return d.toISOString().slice(0, 10);
}

export const formatTime = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}${m ? `:${String(m).padStart(2, "0")}` : ""}${h < 12 ? "am" : "pm"}`;
};

export const formatDate = (date: string) =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
