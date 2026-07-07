import { tv } from "tailwind-variants";

export const quoteBlockVariants = tv({
  slots: {
    root: [
      "relative isolate flex flex-col justify-center",
    ].join(" "),
    mark: [
      "absolute left-0 top-0 font-display leading-none text-[var(--tone-surface)]",
      "[text-shadow:0_0_3rem_var(--tone-glow)]",
      "select-none pointer-events-none",
    ].join(" "),
    quote: [
      "relative font-display font-semibold leading-tight tracking-tight text-ink-strong",
      "[text-shadow:var(--tone-text-shadow)]",
    ].join(" "),
    attribution: [
      "relative mt-f5 flex flex-col",
    ].join(" "),
    name: "font-mono uppercase tracking-[0.2em] text-[var(--tone-surface)]",
    role: "mt-f1 text-eyebrow text-ink-muted",
    bar: [
      "absolute left-0 top-0 bottom-0 w-[0.25rem] rounded-full",
      "bg-[var(--tone-surface)] shadow-[0_0_1.5rem_var(--tone-glow)]",
    ].join(" "),
  },
  variants: {
    density: {
      comfy:   {
        root: "gap-f5 pl-f8",
        mark: "text-[10rem] -top-f6 -left-f5",
        quote: "text-h1",
        attribution: "pl-f3",
      },
      compact: {
        root: "gap-f3 pl-f6",
        mark: "text-[7rem] -top-f4 -left-f3",
        quote: "text-h2",
        attribution: "pl-f2",
      },
    },
  },
  defaultVariants: { density: "comfy" },
});
