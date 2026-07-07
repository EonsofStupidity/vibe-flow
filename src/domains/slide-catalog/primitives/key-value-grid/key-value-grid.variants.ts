import { tv } from "tailwind-variants";

export const keyValueGridVariants = tv({
  slots: {
    root: "grid gap-f4",
    pair: [
      "flex flex-col gap-f2 rounded-f-md border border-[var(--tone-edge)] p-f4",
      "bg-[var(--tone-wash)]",
      "transition-[border-color,box-shadow] duration-[var(--motion-duration-base)] ease-[var(--motion-ease-standard)]",
      "hover:border-[var(--tone-surface)] hover:shadow-[var(--tone-halo)]",
    ].join(" "),
    term: [
      "font-mono uppercase tracking-[0.2em]",
      "text-[var(--tone-surface)]",
    ].join(" "),
    definition: "font-display font-semibold leading-snug text-ink-strong",
  },
  variants: {
    columns: {
      1: { root: "grid-cols-1" },
      2: { root: "grid-cols-1 sm:grid-cols-2" },
    },
  },
  defaultVariants: { columns: 2 },
});
