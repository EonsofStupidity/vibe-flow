/**
 * OKLCH ladder transform. Turns a `PaletteSource` into a resolved
 * `Ladder` (50..950 → OKLCH). Enforces the "never pure black" rule.
 */
import type { Ladder, LadderStep, Oklch, PaletteSource } from "../../foundry.types";
import { LADDER_STEPS } from "../../foundry.types";
import { LIGHTNESS, CHROMA } from "./curves.transform";

const MIN_L = 0.10;

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

/**
 * Generate a full 11-step OKLCH ladder from a palette source.
 *
 * @throws When any generated step lands below `L 0.10` (violates the
 * "never pure black" rule). Fix by raising the curve floor or overriding
 * that step in the palette source.
 */
export function buildLadder(source: PaletteSource): Ladder {
  const lMap = LIGHTNESS[source.curve];
  const cMap = CHROMA[source.chroma];
  const out = {} as Record<LadderStep, Oklch>;
  for (const step of LADDER_STEPS) {
    const override = source.overrides?.[step];
    const l = override?.l ?? lMap[step];
    const c = override?.c ?? clamp01(source.anchor.c * cMap[step]);
    const h = override?.h ?? source.anchor.h;
    if (l < MIN_L) {
      throw new Error(
        `[foundry] palette "${source.name}" step ${step} L=${l.toFixed(3)} < ${MIN_L}. Never pure black.`,
      );
    }
    out[step] = { l: clamp01(l), c, h };
  }
  return out as Ladder;
}

/** Serialize an OKLCH triple to a CSS `oklch(...)` string. */
export function oklchString(v: Oklch): string {
  const l = v.l.toFixed(4);
  const c = v.c.toFixed(4);
  const h = v.h.toFixed(2);
  return `oklch(${l} ${c} ${h})`;
}
