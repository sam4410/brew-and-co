import type { ComponentProps } from "react";

/**
 * The shop sign. Wide, tracked lettering on a roast panel (ref: kiosk sign).
 * Use once per page: hero, or footer. Never for section headings.
 */
export function SignWordmark({
  children = "Brew & Co",
  as: Tag = "p",
  className = "",
  ...props
}: { as?: "h1" | "p" | "span" } & ComponentProps<"p">) {
  return (
    <Tag
      className={`surface-roast inline-block border-4 border-roast px-[0.6em] py-[0.35em] text-sign sign-type ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
