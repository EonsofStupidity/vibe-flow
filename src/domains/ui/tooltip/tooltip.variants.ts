/**
 * Variant recipe for `Tooltip`.
 *
 * @remarks
 * Base class enables RAC `data-entering` / `data-exiting` / `data-placement`
 * keyframe hooks defined in `src/styles.css` (`tooltip-*` keyframes) — no JS
 * animation controller, the browser owns the timeline.
 *
 * Tones map to the tooltip role tokens in `semantics.css`. Each tone sets
 * the surface color, ink color, and arrow fill from the same CSS var so a
 * `data-brand` swap re-tints the tooltip automatically.
 */
import { tv } from "tailwind-variants";

export const tooltipVariants = tv({
  slots: {
    root: [
      "tooltip-motion relative isolate z-50 max-w-[18rem] select-none overflow-hidden rounded-f-md",
      "border border-[var(--tooltip-edge)] bg-[var(--tooltip-glass)] text-[var(--tooltip-ink)]",
      "font-mono uppercase tracking-[0.15em] backdrop-blur-xl backdrop-saturate-150",
      "[box-shadow:var(--tooltip-shadow)] ring-1 ring-[var(--tooltip-ring)]",
      "[text-shadow:var(--tooltip-text-shadow)] will-change-[transform,opacity,filter] outline-none",
      "motion-reduce:transition-none",
    ].join(" "),
    arrow: [
      "block h-[0.5rem] w-[0.75rem] fill-[var(--tooltip-glass)] stroke-[var(--tooltip-edge)] stroke-[0.75]",
      "drop-shadow-[0_0.25rem_0.75rem_var(--tooltip-glow)]",
    ].join(" "),
  },
  variants: {
    tone: {
      neutral: { root: "[--tooltip-tone:var(--tooltip-bg-neutral)] [--tooltip-glass:var(--tooltip-glass-neutral)] [--tooltip-edge:var(--tooltip-edge-neutral)] [--tooltip-ink:var(--tooltip-ink-neutral)]" },
      brand:   { root: "[--tooltip-tone:var(--tooltip-bg-brand)] [--tooltip-glass:var(--tooltip-glass-brand)] [--tooltip-edge:var(--tooltip-edge-brand)] [--tooltip-ink:var(--tooltip-ink-brand)]" },
      info:    { root: "[--tooltip-tone:var(--tooltip-bg-info)] [--tooltip-glass:var(--tooltip-glass-info)] [--tooltip-edge:var(--tooltip-edge-info)] [--tooltip-ink:var(--tooltip-ink-info)]" },
      warning: { root: "[--tooltip-tone:var(--tooltip-bg-warning)] [--tooltip-glass:var(--tooltip-glass-warning)] [--tooltip-edge:var(--tooltip-edge-warning)] [--tooltip-ink:var(--tooltip-ink-warning)]" },
      danger:  { root: "[--tooltip-tone:var(--tooltip-bg-danger)] [--tooltip-glass:var(--tooltip-glass-danger)] [--tooltip-edge:var(--tooltip-edge-danger)] [--tooltip-ink:var(--tooltip-ink-danger)]" },
      lime:    { root: "[--tooltip-tone:var(--tooltip-bg-lime)] [--tooltip-glass:var(--tooltip-glass-lime)] [--tooltip-edge:var(--tooltip-edge-lime)] [--tooltip-ink:var(--tooltip-ink-on-accent)]" },
      cyan:    { root: "[--tooltip-tone:var(--tooltip-bg-cyan)] [--tooltip-glass:var(--tooltip-glass-cyan)] [--tooltip-edge:var(--tooltip-edge-cyan)] [--tooltip-ink:var(--tooltip-ink-on-accent)]" },
      magenta: { root: "[--tooltip-tone:var(--tooltip-bg-magenta)] [--tooltip-glass:var(--tooltip-glass-magenta)] [--tooltip-edge:var(--tooltip-edge-magenta)] [--tooltip-ink:var(--tooltip-ink-on-accent)]" },
      violet:  { root: "[--tooltip-tone:var(--tooltip-bg-violet)] [--tooltip-glass:var(--tooltip-glass-violet)] [--tooltip-edge:var(--tooltip-edge-violet)] [--tooltip-ink:var(--tooltip-ink-on-accent)]" },
      coral:   { root: "[--tooltip-tone:var(--tooltip-bg-coral)] [--tooltip-glass:var(--tooltip-glass-coral)] [--tooltip-edge:var(--tooltip-edge-coral)] [--tooltip-ink:var(--tooltip-ink-on-accent)]" },
    },
    size: {
      sm: { root: "py-f1 pl-f4 pr-f2 text-eyebrow" },
      md: { root: "py-f2 pl-f4 pr-f3 text-eyebrow" },
      lg: { root: "py-f3 pl-f5 pr-f4 text-body" },
    },
  },
  defaultVariants: {
    tone: "neutral",
    size: "md",
  },
});

export type TooltipTone =
  | "neutral" | "brand" | "info" | "warning" | "danger"
  | "lime" | "cyan" | "magenta" | "violet" | "coral";
export type TooltipSize = "sm" | "md" | "lg";
