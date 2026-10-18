import Image from "next/image";
import { Button } from "./Button";

export type Drink = {
  name: string;
  note: string; // one line on taste, e.g. "Double shot, hot water, crema on top"
  price: number; // in minor units (cents) to avoid float rounding
  image: { src: string; alt: string };
};

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

/** Drink tile: square photo, name, note, price, optional tag and add button. Square corners, border only. */
export function ProductCard({ drink, onAddLabel, tag }: { drink: Drink; onAddLabel?: string; tag?: string }) {
  return (
    <article className="flex flex-col border border-latte-deep bg-plaster">
      <div className="relative aspect-square bg-latte">
        <Image
          src={drink.image.src}
          alt={drink.image.alt}
          fill
          sizes="(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-5">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-h4">{drink.name}</h3>
          <p className="font-semibold tabular-nums">{money.format(drink.price / 100)}</p>
        </div>
        <p className="text-roast-soft">{drink.note}</p>
        {tag && <p className="mt-2 text-caption font-semibold text-oak-deep">{tag}</p>}
        {onAddLabel && (
          <Button variant="secondary" className="mt-4 w-full" aria-label={`${onAddLabel}: ${drink.name}`}>
            {onAddLabel}
          </Button>
        )}
      </div>
    </article>
  );
}
