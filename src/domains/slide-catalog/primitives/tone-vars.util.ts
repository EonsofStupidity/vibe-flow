/**
 * Tone helper — publish one row of the effects matrix as `--tone-*` CSS
 * locals so a primitive can read them without re-declaring color logic.
 *
 * @remarks
 * Every content-driven primitive in this folder sets `style={toneVars(tone)}`
 * on its outermost element and then uses `var(--tone-glass)`, `var(--tone-edge)`,
 * `var(--tone-ring)`, `var(--tone-glow)`, `var(--tone-halo)`,
 * `var(--tone-halo-focus)`, `var(--tone-sheen)`, `var(--tone-surface)`,
 * `var(--tone-wash)` in class strings. Adding a matrix column = one new
 * pass-through here; every primitive picks it up automatically.
 */
import type { CSSProperties } from "react";
import type { ToneName } from "./types";

export function toneVars(tone: ToneName): CSSProperties {
  return {
    ["--tone-surface" as string]: `var(--fx-surface-${tone})`,
    ["--tone-ink" as string]: `var(--fx-ink-${tone})`,
    ["--tone-glass" as string]: `var(--fx-glass-${tone})`,
    ["--tone-glass-strong" as string]: `var(--fx-glass-strong-${tone})`,
    ["--tone-wash" as string]: `var(--fx-wash-${tone})`,
    ["--tone-edge" as string]: `var(--fx-edge-${tone})`,
    ["--tone-ring" as string]: `var(--fx-ring-${tone})`,
    ["--tone-glow" as string]: `var(--fx-glow-${tone})`,
    ["--tone-glow-strong" as string]: `var(--fx-glow-strong-${tone})`,
    ["--tone-sheen" as string]: `var(--fx-sheen-${tone})`,
    ["--tone-halo" as string]: `var(--fx-halo-${tone})`,
    ["--tone-halo-focus" as string]: `var(--fx-halo-focus-${tone})`,
    ["--tone-halo-active" as string]: `var(--fx-halo-active-${tone})`,
    ["--tone-shadow-pop" as string]: `var(--fx-shadow-pop-${tone})`,
    ["--tone-text-shadow" as string]: `var(--fx-text-shadow-${tone})`,
    ["--tone-bloom" as string]: `var(--fx-background-bloom-${tone})`,
  } as CSSProperties;
}
