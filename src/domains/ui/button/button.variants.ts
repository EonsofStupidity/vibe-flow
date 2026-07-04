import { tv } from "tailwind-variants";

/**
 * Variant recipe for `Button`.
 *
 * @remarks
 * Base class enforces the runtime-wide `.tap-target` 4rem minimum. State
 * selectors read RAC's emitted `data-*` attributes so we never need JS
 * handlers to style hover/press/focus.
 *
 * Tones read from the **semantic** token surface only. Brand tone follows
 * the active `data-brand` on any ancestor.
 */
export const buttonVariants = tv({
  base: [
    "tap-target inline-flex select-none items-center justify-center gap-f2",
    "rounded-full px-f5 font-mono text-eyebrow uppercase tracking-[0.2em]",
    "outline-none transition-[background-color,color,transform] duration-150",
    "data-[focus-visible]:ring-2 data-[focus-visible]:ring-focus-ring data-[focus-visible]:ring-offset-2 data-[focus-visible]:ring-offset-surface",
    "data-[pressed]:scale-[0.98]",
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  ].join(" "),
  variants: {
    tone: {
      neutral: "bg-surface-raised text-ink data-[hovered]:bg-surface-overlay",
      brand: "bg-brand text-brand-ink data-[hovered]:brightness-110",
      ghost: "bg-transparent text-ink data-[hovered]:bg-surface-raised",
      danger: "bg-danger text-danger-ink data-[hovered]:brightness-110",
    },
    shape: {
      pill: "rounded-full",
      square: "rounded-f-md",
      icon: "aspect-square rounded-full px-0",
    },
  },
  defaultVariants: {
    tone: "neutral",
    shape: "pill",
  },
});
