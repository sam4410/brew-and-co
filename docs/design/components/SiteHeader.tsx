"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { ReserveDialog } from "./ReserveDialog";

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About us" },
];

/** Top bar on a roast surface, followed by the awning stripe. Marks the current page from the URL. */
export function SiteHeader({
  reserveAction,
  reserveNote,
}: {
  reserveAction: ComponentProps<typeof ReserveDialog>["action"];
  reserveNote?: string;
}) {
  const current = usePathname();
  return (
    <header className="surface-roast">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-(--container-page) flex-wrap items-center gap-x-3 gap-y-2 sm:gap-x-6 px-(--spacing-gutter) py-4 md:px-(--spacing-gutter-lg)"
      >
        <Link href="/" className="sign-type text-body">
          Brew &amp; Co
        </Link>
        <ul className="order-last flex w-full gap-6 sm:order-none sm:ml-auto sm:w-auto">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={current === l.href ? "page" : undefined}
                className="inline-flex h-11 items-center text-chalk-dim transition-colors duration-(--duration-quick) hover:text-chalk aria-[current=page]:text-chalk aria-[current=page]:underline aria-[current=page]:decoration-lamp aria-[current=page]:underline-offset-8"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <ReserveDialog action={reserveAction} note={reserveNote} variant="on-roast" className="ml-auto sm:ml-0" />
      </nav>
      <div className="stripe-band" aria-hidden />
    </header>
  );
}
