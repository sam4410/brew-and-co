import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "on-roast";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-control font-sans font-semibold " +
  "transition-colors duration-(--duration-quick) ease-pour " +
  "disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-counter text-white hover:bg-counter-hover",
  secondary: "border border-roast text-roast hover:bg-roast hover:text-chalk",
  "on-roast": "bg-chalk text-roast hover:bg-white",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-body", // 44px: minimum touch target
  lg: "h-13 px-7 text-lead",
};

type Common = { variant?: Variant; size?: Size };

export function buttonClass({ variant = "primary", size = "md" }: Common = {}) {
  return `${base} ${variants[variant]} ${sizes[size]}`;
}

/** Action button. Use for things that change state (order, subscribe, save). */
export function Button({
  variant,
  size,
  className = "",
  type = "button",
  ...props
}: Common & ComponentProps<"button">) {
  return <button type={type} className={`${buttonClass({ variant, size })} ${className}`} {...props} />;
}

/** Same look, but navigates. Use for links styled as buttons (view menu, find us). */
export function ButtonLink({
  variant,
  size,
  className = "",
  ...props
}: Common & ComponentProps<typeof Link>) {
  return <Link className={`${buttonClass({ variant, size })} ${className}`} {...props} />;
}
