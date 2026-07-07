import { tv } from "tailwind-variants";

export const numberedSequenceVariants = tv({
  slots: {
    root: "flex flex-col",
    item: [
      "group relative flex items-start",
      "transition-opacity duration-[var(--motion-duration-base)] ease-[var(--motion-ease-standard)]",
    ].join(" "),
    number: [
      "relative z-10 flex shrink-0 items-center justify-center rounded-full",
      "font-mono font-semibold tabular-nums",
      "border-2 border-[var(--tone-edge)]",
      "transition-[background-color,border-color,box-shadow,color]",
      "duration-[var(--motion-duration-base)] ease-[var(--motion-ease-emphasized)]",
    ].join(" "),
    connector: [
      "absolute left-0 w-[0.125rem] rounded-full",
      "bg-[var(--tone-edge)] opacity-40",
    ].join(" "),
    content: "flex flex-col",
    label: "font-display font-semibold leading-tight text-ink-strong",
    detail: "text-eyebrow text-ink-muted",
  },
  variants: {
    density: {
      comfy: {
        root: "gap-f6",
        item: "gap-f5",
        number: "h-f8 w-f8 text-h3",
        content: "gap-f1 pt-f2",
        label: "text-h2",
        detail: "mt-f2",
      },
      compact: {
        root: "gap-f4",
        item: "gap-f3",
        number: "h-f7 w-f7 text-body",
        content: "gap-0 pt-f1",
        label: "text-h3",
        detail: "mt-f1",
      },
    },
  },
  defaultVariants: { density: "comfy" },
});
