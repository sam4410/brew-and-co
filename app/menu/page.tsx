import type { Metadata } from "next";
import { MenuBoard, ProductCard } from "@/docs/design/components";
import { byCategory, menu, slug } from "@/lib/menu";

export const metadata: Metadata = {
  title: "Menu",
  description: "Espresso drinks, cold drinks, pastries baked every morning and lunch sandwiches at Brew & Co.",
};

const container = "mx-auto max-w-(--container-page) px-(--spacing-gutter) md:px-(--spacing-gutter-lg)";
const sections = byCategory(menu);

export default function MenuPage() {
  return (
    <>
      <div className={`${container} pt-(--spacing-section)`}>
        <h1 className="text-h1">Menu</h1>
        <p className="mt-4 max-w-(--container-prose) text-lead text-roast-soft">
          Coffee from our house blend, pastries out of the oven by 7am and sandwiches made to order until close.
        </p>
        <nav aria-label="Menu categories" className="mt-8">
          <ul className="flex flex-wrap gap-2">
            {sections.map((s) => (
              <li key={s.title}>
                <a
                  href={`#${slug(s.title)}`}
                  className="inline-flex h-11 items-center rounded-pill border border-roast-soft px-4 font-medium text-roast-soft transition-colors duration-(--duration-quick) hover:border-roast hover:bg-roast hover:text-chalk"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {sections.map((s, n) => (
        <section
          key={s.title}
          id={slug(s.title)}
          aria-labelledby={`${slug(s.title)}-title`}
          className={`scroll-mt-4 py-(--spacing-section) ${n % 2 ? "surface-latte" : ""}`}
        >
          <div className={container}>
            <h2 id={`${slug(s.title)}-title`} className="mb-10 text-h2">
              {s.title}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {s.items.map((i) => (
                <ProductCard key={i.name} drink={i} tag={i.favorite ? "House favourite" : undefined} />
              ))}
            </div>
          </div>
        </section>
      ))}

      <div className={`${container} py-(--spacing-section)`}>
        <MenuBoard heading="The whole board" sections={sections} />
      </div>
    </>
  );
}
