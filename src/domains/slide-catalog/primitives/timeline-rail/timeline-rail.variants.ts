import { tv } from "tailwind-variants";

export const timelineRailVariants = tv({
  slots: {
    root: "relative isolate",
    track: "relative flex",
    line: [
      "absolute bg-[var(--tone-edge)]",
      "transition-[background-color] duration-[var(--motion-duration-base)]",
    ].join(" "),
    item: "relative flex shrink-0",
    dot: [
      "relative z-10 shrink-0 rounded-full border-2",
      "transition-[background-color,border-color,box-shadow,transform]",
      "duration-[var(--motion-duration-base)] ease-[var(--motion-ease-emphasized)]",
    ].join(" "),
    content: "flex flex-col",
    label: "font-display font-semibold leading-tight text-ink-strong",
    detail: "text-eyebrow text-ink-muted",
  },
  variants: {
    orientation: {
      vertical: {
        root: "w-full",
        track: "flex-col gap-0",
        line: "left-[calc(var(--dot-size)/2-0.0625rem)] top-[var(--dot-size)] w-[0.125rem]",
        item: "items-start gap-f4",
        content: "pb-f6",
        label: "mt-f1",
      },
      horizontal: {
        root: "w-full",
        track: "flex-row items-start",
        line: "top-[calc(var(--dot-size)/2-0.0625rem)] left-[var(--dot-size)] h-[0.125rem]",
        item: "flex-col items-center gap-f2",
        content: "items-center text-center",
        label: "mt-0",
      },
    },
    density: {
      comfy:   {
        dot: "h-f5 w-f5 [--dot-size:var(--sp-5)]",
        label: "text-h3",
        detail: "mt-f1",
        item: "gap-f4",
      },
      compact: {
        dot: "h-f4 w-f4 [--dot-size:var(--sp-4)]",
        label: "text-body",
        detail: "mt-0",
        item: "gap-f3",
      },
    },
  },
  defaultVariants: { orientation: "vertical", density: "comfy" },
});
