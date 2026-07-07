import { tv } from "tailwind-variants";

/**
 * Variant recipe for `BulletsList`.
 *
 * @remarks
 * Reads tone via `var(--tone-*)` locals published by `toneVars(tone)` on
 * the root. No inline color decisions; adding a matrix column here is a
 * new class, never a new prop.
 */
export const bulletsListVariants = tv({
  slots: {
    root: [
      "relative isolate flex h-full w-full flex-col",
      "text-ink",
    ].join(" "),
    heading: [
      "font-display font-semibold leading-tight text-ink-strong",
      "[text-shadow:var(--tone-text-shadow)]",
    ].join(" "),
    list: "flex flex-col",
    item: [
      "tap-target group relative isolate flex items-start gap-f4 overflow-hidden",
      "rounded-f-md border border-transparent outline-none",
      "text-left text-ink transition-[background-color,color,box-shadow,transform,border-color]",
      "duration-[var(--motion-duration-base)] ease-[var(--motion-ease-emphasized)]",
      "hover:border-[var(--tone-edge)] hover:bg-[var(--tone-wash)]",
      "hover:[box-shadow:var(--tone-halo)]",
      "data-[hovered]:border-[var(--tone-edge)] data-[hovered]:bg-[var(--tone-wash)]",
      "data-[hovered]:[box-shadow:var(--tone-halo)]",
      "data-[focus-visible]:[box-shadow:var(--tone-halo-focus)] data-[focus-visible]:border-[var(--tone-edge)]",
      "focus-visible:[box-shadow:var(--tone-halo-focus)] focus-visible:border-[var(--tone-edge)]",
      "data-[pressed]:scale-[0.995]",
      "data-[selected=true]:border-[var(--tone-edge)] data-[selected=true]:bg-[var(--tone-glass)]",
      "data-[selected=true]:[box-shadow:var(--tone-halo-active)]",
      "motion-reduce:transition-none",
    ].join(" "),
    bullet: [
      "relative mt-[0.375rem] h-[0.5rem] w-[0.5rem] shrink-0 rounded-full",
      "bg-[var(--tone-surface)] shadow-[0_0_0.5rem_var(--tone-glow)]",
      "transition-transform duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-emphasized)]",
      "group-hover:scale-125 group-data-[selected=true]:scale-125",
      "motion-reduce:transform-none",
    ].join(" "),
    label: "min-w-0 flex-1 text-body leading-snug",
    detail: [
      "mt-f1 text-eyebrow text-ink-muted",
      "opacity-70 transition-opacity duration-[var(--motion-duration-base)]",
      "group-hover:opacity-100 group-data-[selected=true]:opacity-100 group-focus-visible:opacity-100",
    ].join(" "),
  },
  variants: {
    density: {
      comfy:   { list: "gap-f3", heading: "mb-f6 text-h1", item: "px-f5 py-f4" },
      compact: { list: "gap-f2", heading: "mb-f4 text-h2", item: "px-f4 py-f3" },
    },
  },
  defaultVariants: {
    density: "comfy",
  },
});
