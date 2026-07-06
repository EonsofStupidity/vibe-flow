/**
 * Variant recipe for `Tooltip`.
 *
 * @remarks
 * Base class enables RAC `data-entering` / `data-exiting` / `data-placement`
 * keyframe hooks defined in `src/styles.css` (`tooltip-motion` utility) — no
 * JS animation controller, the browser owns the timeline.
 *
 * Tones read directly from the effects matrix (`--fx-glass-<tone>`,
 * `--fx-edge-<tone>`, `--fx-ink-<tone>`, `--fx-glow-<tone>`,
 * `--fx-sheen-diag-<tone>`, `--fx-shadow-pop-<tone>`,
 * `--fx-text-shadow-<tone>`) — the tooltip itself declares zero
 * color vars, and a new tone is one row in the matrix.
 */
import { tv } from "tailwind-variants";
import type { ToneName } from "@/domains/theme/foundry/source/effects/effects.matrix";

/**
 * Emit the `[--tooltip-tone:...]` local vars that the `tooltip-motion`
 * utility reads. Every value is a pass-through of the matrix column for
 * this tone — no per-domain color logic.
 */
function toneClass(tone: ToneName): string {
  return [
    `[--tooltip-tone:var(--fx-surface-${tone})]`,
    `[--tooltip-glass:var(--fx-glass-${tone})]`,
    `[--tooltip-edge:var(--fx-edge-${tone})]`,
    `[--tooltip-ink:var(--fx-ink-${tone})]`,
    `[--tooltip-ring:var(--fx-ring-${tone})]`,
    `[--tooltip-glow:var(--fx-glow-${tone})]`,
    `[--tooltip-sheen:var(--fx-sheen-diag-${tone})]`,
    `[--tooltip-shadow:var(--fx-shadow-pop-${tone})]`,
    `[--tooltip-text-shadow:var(--fx-text-shadow-${tone})]`,
  ].join(" ");
}

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
      neutral: { root: toneClass("neutral") },
      brand:   { root: toneClass("brand") },
      info:    { root: toneClass("info") },
      warning: { root: toneClass("warning") },
      danger:  { root: toneClass("danger") },
      lime:    { root: toneClass("lime") },
      cyan:    { root: toneClass("cyan") },
      magenta: { root: toneClass("magenta") },
      violet:  { root: toneClass("violet") },
      coral:   { root: toneClass("coral") },
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

export type TooltipTone = ToneName;
export type TooltipSize = "sm" | "md" | "lg";
