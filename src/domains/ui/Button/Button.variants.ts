import { tv } from "tailwind-variants";

/**
 * Variant recipe for {@link Button}.
 *
 * @remarks
 * Base class enforces the runtime-wide `.tap-target` 64px minimum. State
 * selectors read RAC's emitted `data-*` attributes so we never need
 * JS handlers to style hover/press/focus.
 */
export const buttonVariants = tv({
  base: [
    "tap-target inline-flex select-none items-center justify-center gap-2",
    "rounded-full px-6 font-mono text-xs uppercase tracking-[0.2em]",
    "outline-none transition-[background-color,color,transform] duration-150",
    "data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring data-[focus-visible]:ring-offset-2 data-[focus-visible]:ring-offset-background",
    "data-[pressed]:scale-[0.98]",
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  ].join(" "),
  variants: {
    tone: {
      neutral: "bg-secondary text-secondary-foreground data-[hovered]:bg-muted",
      primary: "bg-primary text-primary-foreground data-[hovered]:brightness-110",
      ghost: "bg-transparent text-foreground data-[hovered]:bg-secondary",
    },
    shape: {
      pill: "rounded-full",
      square: "rounded-md",
      icon: "aspect-square rounded-full px-0",
    },
  },
  defaultVariants: {
    tone: "neutral",
    shape: "pill",
  },
});
