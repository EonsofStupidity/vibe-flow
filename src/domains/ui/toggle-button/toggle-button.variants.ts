import { tv } from "tailwind-variants";

export const toggleButtonVariants = tv({
  base: [
    "tap-target inline-flex select-none items-center justify-center gap-f2",
    "rounded-full px-f5 font-mono text-eyebrow uppercase tracking-[0.2em]",
    "outline-none transition-[background-color,color,transform] duration-150",
    "bg-surface-raised text-ink",
    "data-[hovered]:bg-surface-overlay",
    "data-[selected]:bg-brand data-[selected]:text-brand-ink",
    "data-[focus-visible]:ring-2 data-[focus-visible]:ring-focus-ring data-[focus-visible]:ring-offset-2 data-[focus-visible]:ring-offset-surface",
    "data-[pressed]:scale-[0.98]",
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  ].join(" "),
  variants: {
    shape: {
      pill: "rounded-full",
      square: "rounded-f-md",
      icon: "aspect-square rounded-full px-0",
    },
  },
  defaultVariants: { shape: "pill" },
});
