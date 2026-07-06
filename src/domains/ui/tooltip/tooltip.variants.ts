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
      "z-50 select-none rounded-f-md font-mono uppercase tracking-[0.15em]",
      "shadow-[var(--tooltip-shadow)]",
      "ring-1 ring-[color-mix(in_oklch,var(--tooltip-ring)_45%,transparent)]",
      "will-change-[transform,opacity] outline-none",
      "data-[entering]:animate-[tooltip-in_var(--motion-duration-fast)_var(--motion-ease-emphasized)_both]",
      "data-[exiting]:animate-[tooltip-out_var(--motion-duration-fast)_var(--motion-ease-standard)_both]",
      "motion-reduce:animate-none motion-reduce:transition-none",
    ].join(" "),
    arrow: "block h-[0.5rem] w-[0.75rem] fill-[var(--tooltip-bg)]",
  },
  variants: {
    tone: {
      neutral: { root: "bg-[var(--tooltip-bg-neutral)] text-[var(--tooltip-ink-neutral)] [--tooltip-bg:var(--tooltip-bg-neutral)]" },
      brand:   { root: "bg-[var(--tooltip-bg-brand)] text-[var(--tooltip-ink-brand)] [--tooltip-bg:var(--tooltip-bg-brand)]" },
      info:    { root: "bg-[var(--tooltip-bg-info)] text-[var(--tooltip-ink-info)] [--tooltip-bg:var(--tooltip-bg-info)]" },
      warning: { root: "bg-[var(--tooltip-bg-warning)] text-[var(--tooltip-ink-warning)] [--tooltip-bg:var(--tooltip-bg-warning)]" },
      danger:  { root: "bg-[var(--tooltip-bg-danger)] text-[var(--tooltip-ink-danger)] [--tooltip-bg:var(--tooltip-bg-danger)]" },
      lime:    { root: "bg-[var(--tooltip-bg-lime)] text-[var(--tooltip-ink-on-accent)] [--tooltip-bg:var(--tooltip-bg-lime)]" },
      cyan:    { root: "bg-[var(--tooltip-bg-cyan)] text-[var(--tooltip-ink-on-accent)] [--tooltip-bg:var(--tooltip-bg-cyan)]" },
      magenta: { root: "bg-[var(--tooltip-bg-magenta)] text-[var(--tooltip-ink-on-accent)] [--tooltip-bg:var(--tooltip-bg-magenta)]" },
      violet:  { root: "bg-[var(--tooltip-bg-violet)] text-[var(--tooltip-ink-on-accent)] [--tooltip-bg:var(--tooltip-bg-violet)]" },
      coral:   { root: "bg-[var(--tooltip-bg-coral)] text-[var(--tooltip-ink-on-accent)] [--tooltip-bg:var(--tooltip-bg-coral)]" },
    },
    size: {
      sm: { root: "px-f2 py-f1 text-eyebrow" },
      md: { root: "px-f3 py-f2 text-eyebrow" },
      lg: { root: "px-f4 py-f3 text-body" },
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
