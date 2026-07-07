import { tv } from "tailwind-variants";

export const agendaListVariants = tv({
  slots: {
    root: "flex flex-col",
    chapter: [
      "font-mono uppercase tracking-[0.25em]",
      "text-[var(--tone-surface)] opacity-80",
    ].join(" "),
    list: "flex flex-col",
    item: [
      "group relative flex items-start",
      "transition-[opacity,transform] duration-[var(--motion-duration-base)] ease-[var(--motion-ease-standard)]",
    ].join(" "),
    marker: [
      "relative z-10 mt-[0.2em] shrink-0 rounded-full",
      "border-2 border-[var(--tone-edge)]",
      "transition-[background-color,border-color,box-shadow]",
      "duration-[var(--motion-duration-base)] ease-[var(--motion-ease-emphasized)]",
    ].join(" "),
    content: "flex flex-col",
    label: "font-display font-semibold leading-snug",
    detail: "text-eyebrow text-ink-muted",
  },
  variants: {
    active: {
      true: {
        label: "text-[var(--tone-surface)] [text-shadow:0_0_1.5rem_var(--tone-glow)]",
        marker: "bg-[var(--tone-surface)] border-[var(--tone-surface)] shadow-[0_0_1rem_var(--tone-glow)]",
      },
      false: {
        label: "text-ink-muted",
        marker: "bg-transparent",
      },
    },
    density: {
      comfy: {
        root: "gap-f3",
        chapter: "text-eyebrow mb-f4",
        list: "gap-f5",
        item: "gap-f4",
        marker: "h-f3 w-f3",
        content: "gap-f1 pt-[0.1em]",
        label: "text-h2",
        detail: "mt-f1",
      },
      compact: {
        root: "gap-f2",
        chapter: "text-caption mb-f3",
        list: "gap-f3",
        item: "gap-f3",
        marker: "h-f2 w-f2",
        content: "gap-0 pt-[0.15em]",
        label: "text-h3",
        detail: "mt-f1",
      },
    },
  },
  defaultVariants: { density: "comfy", active: false },
});
