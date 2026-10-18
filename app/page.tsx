import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { ButtonLink, ProductCard, ReserveDialog, SignWordmark, Testimonial } from "@/docs/design/components";
import { formatDate, nextOn, todayInShop } from "@/lib/hours";
import { menu } from "@/lib/menu";
import { reserveTable } from "./actions";

const container = "mx-auto max-w-(--container-page) px-(--spacing-gutter) md:px-(--spacing-gutter-lg)";

const events = [
  {
    title: "Open mic night",
    dow: 5,
    when: "Every Friday, 7–10pm",
    text: "Songs, poems, the odd stand-up set. Sign up at the counter from 6pm; everyone gets ten minutes and a free drip coffee.",
    image: { src: "/images/event-live-music.webp", alt: "Singer with an acoustic guitar performing at a microphone" },
  },
  {
    title: "Saturday coffee tasting",
    dow: 6,
    when: "Every Saturday, 9–11am",
    text: "Taste three coffees side by side with our roaster and learn what to look for. Free, about 12 seats, first come first served.",
    image: { src: "/images/event-cupping.webp", alt: "Coffee cupping bowls and tasting spoons on a wooden table" },
  },
];

async function NextDate({ dow }: { dow: number }) {
  await connection(); // "next Friday" depends on today, so render per request
  return <>Next: {formatDate(nextOn(dow, todayInShop()))}</>;
}

export default function Home() {
  const favourites = menu.filter((i) => i.favorite);
  return (
    <>
      <section className="surface-roast relative isolate overflow-hidden">
        <Image
          src="/images/hero-cafe.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover opacity-45"
        />
        <div className={`${container} flex min-h-[70svh] flex-col items-start justify-center gap-6 py-(--spacing-section)`}>
          <SignWordmark as="h1" />
          <p className="max-w-(--container-prose) text-lead text-chalk">
            Specialty coffee, pastries baked every morning and light lunches, on a Brooklyn corner since 2019.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <ReserveDialog action={reserveTable} variant="on-roast" size="lg" />
            <Link href="/menu" className="inline-flex h-13 items-center font-semibold text-chalk underline decoration-lamp underline-offset-8 hover:decoration-chalk">
              View the menu
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="favourites" className="surface-latte py-(--spacing-section)">
        <div className={container}>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="favourites" className="text-h2">
                House favourites
              </h2>
              <p className="mt-3 max-w-(--container-prose) text-lead">What the regulars order before they&apos;ve reached the counter.</p>
            </div>
            <ButtonLink href="/menu" variant="secondary">
              See the full menu
            </ButtonLink>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favourites.map((i) => (
              <ProductCard key={i.name} drink={i} />
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="events" className="surface-roast py-(--spacing-section)">
        <div className={container}>
          <h2 id="events" className="mb-10 text-h2">
            Upcoming events
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            {events.map((e) => (
              <article key={e.title} className="flex flex-col border border-chalk-dim/40">
                <div className="relative aspect-[4/3] bg-latte">
                  <Image src={e.image.src} alt={e.image.alt} fill sizes="(min-width: 768px) 36rem, 100vw" className="object-cover" />
                </div>
                <div className="flex flex-col gap-2 p-6">
                  <h3 className="text-h3">{e.title}</h3>
                  <p className="font-semibold text-lamp">{e.when}</p>
                  <p className="text-caption text-chalk-dim">
                    <Suspense fallback={" "}>
                      <NextDate dow={e.dow} />
                    </Suspense>
                  </p>
                  <p className="mt-2 text-chalk">{e.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-(--spacing-section)">
        <div className={container}>
          <Testimonial
            quote="I came in for a flat white during a rainy week in 2020 and somehow I'm now reading poems at open mic. Best coffee on the block, and they know my order."
            name="Priya S."
            detail="Regular since 2020"
            rating={5}
          />
        </div>
      </section>
    </>
  );
}
