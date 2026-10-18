import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/docs/design/components";

export const metadata: Metadata = {
  title: "About us",
  description: "How Maya and Daniel turned an empty Brooklyn corner shop into Brew & Co.",
};

const container = "mx-auto max-w-(--container-page) px-(--spacing-gutter) md:px-(--spacing-gutter-lg)";

const values = [
  ["Coffee you can taste the farm in", "We buy from three importers we know by name and roast in small batches every Tuesday."],
  ["Bake it here, bake it today", "Everything in the pastry case was dough at 4am. What doesn't sell goes to the shelter on Union Avenue."],
  ["A room for the block", "Strollers, laptops, poets, and the man who's done the crossword at table six since day one."],
];

export default function About() {
  return (
    <>
      <div className={`${container} grid items-center gap-10 py-(--spacing-section) md:grid-cols-2`}>
        <div>
          <h1 className="text-h1">Two neighbours and an espresso machine</h1>
          <p className="mt-6 max-w-(--container-prose) text-lead text-roast-soft">
            Brew &amp; Co started with a secondhand machine, a lease we couldn&apos;t quite afford and a promise to know
            everyone&apos;s name.
          </p>
        </div>
        <div className="relative aspect-[4/3] bg-latte">
          <Image
            src="/images/about-story.webp"
            alt="Two baristas working the counter with the espresso machine behind them"
            fill
            priority
            sizes="(min-width: 768px) 36rem, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      <section aria-labelledby="story" className="surface-latte py-(--spacing-section)">
        <div className={`${container} max-w-(--container-prose) space-y-5 text-body`}>
          <h2 id="story" className="text-h2">
            Our story
          </h2>
          <p>
            Maya Okafor spent ten years on the line in Manhattan kitchens, and Daniel Reyes spent the same ten roasting
            coffee in a warehouse in Red Hook. They met in 2017 at the laundromat on Lorimer Street, arguing politely about
            whether the bodega coffee next door was any good. (It wasn&apos;t, they agreed.)
          </p>
          <p>
            When the old hardware store on the corner closed in 2018, they walked past the &ldquo;for lease&rdquo; sign
            every day for a month before calling the number. Daniel found a 1998 La Marzocco on a restaurant auction
            site, Maya&apos;s mum lent them her oven trays, and friends spent four weekends sanding the floor. Brew &amp; Co
            opened in March 2019 with six tables, one croissant recipe and a hand-painted sign Maya still thinks is
            slightly crooked.
          </p>
          <p>
            Open mic Fridays started by accident. A regular asked if she could play two songs while she waited for her
            sandwich; twenty people stayed to listen. Now it&apos;s the busiest night of the week. Saturday tastings came
            from Daniel, who can&apos;t stop talking about where coffee comes from and finally found people who
            wanted to listen.
          </p>
          <p>
            Five years on, the machine is the same, the oven is bigger, and Maya still bakes the first tray of
            croissants herself every morning.
          </p>
        </div>
      </section>

      <section aria-labelledby="values" className={`${container} grid gap-10 py-(--spacing-section) md:grid-cols-2`}>
        <div className="relative aspect-[4/5] bg-latte">
          <Image
            src="/images/about-roastery.webp"
            alt="Warm café corner with shelves, plants and a pendant lamp"
            fill
            sizes="(min-width: 768px) 36rem, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <h2 id="values" className="text-h2">
            What we care about
          </h2>
          <dl className="mt-8 space-y-6">
            {values.map(([title, text]) => (
              <div key={title} className="border-t border-latte-deep pt-4">
                <dt className="text-h4 font-serif">{title}</dt>
                <dd className="mt-2 text-roast-soft">{text}</dd>
              </div>
            ))}
          </dl>
          <ButtonLink href="/menu" className="mt-10">
            View the menu
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
