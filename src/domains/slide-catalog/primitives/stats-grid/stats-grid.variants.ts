import { tv } from "tailwind-variants";

export const statsGridVariants = tv({
  slots: {
    root: "relative isolate flex h-full w-full flex-col",
    heading: [
      "font-display font-semibold leading-tight text-ink-strong",
      "[text-shadow:var(--tone-text-shadow)]",
    ].join(" "),
    grid: [
      "grid flex-1 auto-rows-fr",
      "[grid-template-columns:repeat(auto-fit,minmax(min(100%,14rem),1fr))]",
    ].join(" "),
    card: [
      "tap-target group relative isolate flex min-h-[13rem] flex-col justify-between overflow-hidden",
      "rounded-f-lg border border-[var(--tone-edge)]",
      "bg-[var(--tone-glass)] p-f6 text-ink outline-none",
      "backdrop-blur-md",
      "[box-shadow:var(--tone-halo)]",
      "transition-[transform,box-shadow,background-color] duration-[var(--motion-duration-base)]",
      "ease-[var(--motion-ease-emphasized)]",
      "hover:[box-shadow:var(--tone-halo-focus)] data-[hovered]:[box-shadow:var(--tone-halo-focus)]",
      "focus-visible:[box-shadow:var(--tone-halo-focus)] data-[focus-visible]:[box-shadow:var(--tone-halo-focus)]",
      "data-[pressed]:scale-[0.985]",
      "data-[selected=true]:[box-shadow:var(--tone-halo-active)]",
      "motion-reduce:transition-none",
    ].join(" "),
    face: [
      "flex h-full flex-col justify-between",
      "transition-opacity duration-[var(--motion-duration-base)] ease-[var(--motion-ease-emphasized)]",
      "group-data-[selected=true]:opacity-0 group-data-[selected=true]:pointer-events-none",
    ].join(" "),
    back: [
      "absolute inset-0 flex flex-col justify-between p-f6 opacity-0 pointer-events-none",
      "transition-opacity duration-[var(--motion-duration-base)] ease-[var(--motion-ease-emphasized)]",
      "group-data-[selected=true]:opacity-100 group-data-[selected=true]:pointer-events-auto",
    ].join(" "),
    value: [
      "font-display font-semibold leading-none text-ink-strong tabular-nums",
      "[text-shadow:var(--tone-text-shadow)]",
    ].join(" "),
    label: [
      "font-mono text-eyebrow uppercase tracking-[0.22em] text-ink-muted",
    ].join(" "),
    hint: "self-start font-mono text-[0.7rem] uppercase tracking-[0.24em] text-[color:var(--tone-surface)]",
    detail: "text-body leading-snug text-ink",
    sheen: [
      "pointer-events-none absolute inset-0",
      "bg-[image:var(--tone-sheen)] opacity-0",
      "transition-opacity duration-[var(--motion-duration-base)] ease-[var(--motion-ease-standard)]",
      "group-hover:opacity-100 group-focus-visible:opacity-100",
    ].join(" "),
  },
  variants: {
    density: {
      comfy:   { heading: "mb-f6 text-h1", grid: "gap-f5", value: "text-display" },
      compact: { heading: "mb-f4 text-h2", grid: "gap-f4", value: "text-h1" },
    },
  },
  defaultVariants: {
    density: "comfy",
  },
});
