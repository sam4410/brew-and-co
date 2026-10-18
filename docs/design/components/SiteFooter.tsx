/** Footer on roast: address, hours, photo credit. Sits below a stripe band. */
export function SiteFooter({
  address,
  hours,
}: {
  address: string[];
  hours: { days: string; time: string }[];
}) {
  return (
    <footer className="surface-roast">
      <div className="stripe-band" aria-hidden />
      <div className="mx-auto grid max-w-(--container-page) gap-8 px-(--spacing-gutter) py-12 sm:grid-cols-3 md:px-(--spacing-gutter-lg)">
        <div>
          <h2 className="mb-3 font-sans text-body font-semibold text-lamp">Visit us</h2>
          <address className="not-italic">
            {address.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
        </div>
        <div>
          <h2 className="mb-3 font-sans text-body font-semibold text-lamp">Hours</h2>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
            {hours.map((h) => (
              <div key={h.days} className="contents">
                <dt>{h.days}</dt>
                <dd className="tabular-nums">{h.time}</dd>
              </div>
            ))}
          </dl>
        </div>
        <p className="text-caption text-chalk-dim sm:self-end">
          Photos from{" "}
          <a href="https://www.pexels.com" className="underline underline-offset-4 hover:text-chalk">
            Pexels
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
