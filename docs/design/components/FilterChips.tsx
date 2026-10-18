"use client";

/** Single-select filter for the drinks grid (All / Black / Espresso / Milk …). Controlled. */
export function FilterChips({
  options,
  value,
  onChange,
  label,
}: {
  options: string[];
  value: string;
  onChange: (next: string) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          aria-pressed={value === o}
          onClick={() => onChange(o)}
          className="h-9 rounded-pill border border-roast-soft px-4 text-caption font-medium text-roast-soft transition-colors duration-(--duration-quick) hover:border-roast hover:text-roast aria-pressed:border-roast aria-pressed:bg-roast aria-pressed:text-chalk"
        >
          {o}
        </button>
      ))}
    </div>
  );
}
