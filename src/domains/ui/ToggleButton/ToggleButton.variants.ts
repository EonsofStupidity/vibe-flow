import { tv } from "tailwind-variants";

export const toggleButtonVariants = tv({
  base: [
    "tap-target inline-flex select-none items-center justify-center gap-2",
    "rounded-full px-6 font-mono text-xs uppercase tracking-[0.2em]",
    "outline-none transition-[background-color,color,transform] duration-150",
    "bg-secondary text-secondary-foreground",
    "data-[hovered]:bg-muted",
    "data-[selected]:bg-primary data-[selected]:text-primary-foreground",
    "data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring data-[focus-visible]:ring-offset-2 data-[focus-visible]:ring-offset-background",
    "data-[pressed]:scale-[0.98]",
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  ].join(" "),
  variants: {
    shape: {
      pill: "rounded-full",
      square: "rounded-md",
      icon: "aspect-square rounded-full px-0",
    },
  },
  defaultVariants: { shape: "pill" },
});
