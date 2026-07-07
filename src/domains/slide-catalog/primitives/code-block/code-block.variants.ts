import { tv } from "tailwind-variants";

export const codeBlockVariants = tv({
  slots: {
    root: [
      "relative isolate flex h-full w-full flex-col overflow-hidden",
      "rounded-f-md border border-[var(--tone-edge)] bg-[var(--tone-glass)]",
      "backdrop-blur-md text-ink [box-shadow:var(--tone-halo)]",
    ].join(" "),
    header: [
      "flex items-center justify-between gap-f4 border-b border-[var(--tone-edge)]",
      "bg-[var(--tone-wash)] px-f5 py-f3",
    ].join(" "),
    label: [
      "font-mono uppercase tracking-[0.22em] text-[color:var(--tone-surface)]",
      "[text-shadow:var(--tone-text-shadow)]",
    ].join(" "),
    lang: "font-mono text-eyebrow uppercase tracking-[0.24em] text-ink-muted",
    scroll: [
      "relative flex-1 overflow-auto",
      "scrollbar-thin",
    ].join(" "),
    grid: "grid grid-cols-[auto_1fr] font-mono leading-[1.55] text-body",
    gutter: [
      "select-none pr-f4 text-right text-ink-muted",
      "border-r border-[var(--tone-edge)]/40",
    ].join(" "),
    line: [
      "whitespace-pre px-f4",
      "data-[hl=true]:bg-[var(--tone-wash)]",
      "data-[hl=true]:[box-shadow:inset_0.1875rem_0_0_var(--tone-surface)]",
    ].join(" "),
    gutterCell: "px-f3 text-right",
  },
  variants: {
    density: {
      comfy:   { grid: "text-body py-f3", header: "py-f3", label: "text-eyebrow" },
      compact: { grid: "text-eyebrow py-f2", header: "py-f2", label: "text-[0.7rem]" },
    },
  },
  defaultVariants: {
    density: "comfy",
  },
});
