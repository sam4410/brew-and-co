import { useId } from "react";

export type MenuSection = {
  title: string;
  items: { name: string; price: number; note?: string }[]; // price in cents
};

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

/**
 * The chalk menu board (ref: kiosk board). Roast surface, dotted leaders, tabular prices.
 * Columns flow 1 → 2 → 3 with viewport; sections never split across columns.
 */
export function MenuBoard({ sections, heading = "Menu" }: { sections: MenuSection[]; heading?: string }) {
  const id = useId();
  return (
    <section aria-labelledby={id} className="surface-roast p-6 md:p-10">
      <h2 id={id} className="mb-8 text-h2">
        {heading}
      </h2>
      <div className="gap-10 sm:columns-2 lg:columns-3">
        {sections.map((s) => (
          <div key={s.title} className="mb-8 break-inside-avoid">
            <h3 className="mb-3 border-b border-chalk-dim/40 pb-2 font-sans text-lead font-semibold text-lamp">
              {s.title}
            </h3>
            <dl className="space-y-2">
              {s.items.map((i) => (
                <div key={i.name}>
                  <div className="flex items-baseline gap-2">
                    <dt>{i.name}</dt>
                    <span aria-hidden className="flex-1 translate-y-[-0.25em] border-b border-dotted border-chalk-dim/60" />
                    <dd className="tabular-nums">{money.format(i.price / 100)}</dd>
                  </div>
                  {i.note && <p className="text-caption text-chalk-dim">{i.note}</p>}
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </section>
  );
}
