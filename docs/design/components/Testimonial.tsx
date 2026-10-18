import Image from "next/image";

/** A single guest quote. Serif quote, sans attribution. Rating is optional and read as text. */
export function Testimonial({
  quote,
  name,
  detail,
  avatar,
  rating,
}: {
  quote: string;
  name: string;
  detail?: string; // e.g. "Regular since 2023"
  avatar?: string;
  rating?: 1 | 2 | 3 | 4 | 5;
}) {
  return (
    <figure className="surface-roast mx-auto max-w-(--container-prose) p-8 md:p-10">
      {rating && (
        <p className="mb-4 text-lamp">
          <span aria-hidden>{"★".repeat(rating)}</span>
          <span className="sr-only">Rated {rating} out of 5</span>
        </p>
      )}
      <blockquote className="font-serif text-h4">
        <p>{quote}</p>
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        {avatar && <Image src={avatar} alt="" width={44} height={44} className="rounded-pill" />}
        <span>
          <span className="block font-semibold">{name}</span>
          {detail && <span className="block text-caption text-chalk-dim">{detail}</span>}
        </span>
      </figcaption>
    </figure>
  );
}
