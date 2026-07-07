import { tv } from "tailwind-variants";

export const mediaHotspotsVariants = tv({
  slots: {
    root: "relative flex h-full w-full flex-col items-center gap-f5",
    frame: [
      "relative flex h-full w-full items-center justify-center overflow-hidden",
      "rounded-f-md border border-[var(--tone-edge)] bg-[var(--tone-glass)]",
      "[box-shadow:var(--tone-halo)]",
    ].join(" "),
    image: "pointer-events-none max-h-full max-w-full select-none object-contain",
    hotspot: [
      "tap-target absolute -translate-x-1/2 -translate-y-1/2",
      "grid place-items-center rounded-full",
      "border border-[var(--tone-edge)] bg-[var(--tone-glass-strong)] text-[color:var(--tone-surface)]",
      "backdrop-blur-md [box-shadow:var(--tone-halo)] outline-none",
      "transition-[transform,box-shadow] duration-[var(--motion-duration-base)] ease-[var(--motion-ease-emphasized)]",
      "hover:scale-110 data-[hovered]:scale-110",
      "focus-visible:[box-shadow:var(--tone-halo-focus)] data-[focus-visible]:[box-shadow:var(--tone-halo-focus)]",
      "focus-visible:scale-110 data-[focus-visible]:scale-110",
      "data-[pressed]:scale-95",
      "motion-reduce:transform-none motion-reduce:transition-none",
    ].join(" "),
    dot: [
      "block h-[0.75rem] w-[0.75rem] rounded-full bg-[var(--tone-surface)]",
      "shadow-[0_0_0.75rem_var(--tone-glow-strong)]",
      "animate-[hotspot-pulse_1.6s_var(--motion-ease-standard)_infinite]",
      "motion-reduce:animate-none",
    ].join(" "),
    caption: "max-w-3xl text-center text-h3 text-ink-muted",
  },
});
