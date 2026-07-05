/**
 * Gradient recipe transform. Emits linear/radial/conic gradient tokens
 * derived from a palette's own ladder — no hand-picked stops.
 */
import type { Ladder, LadderStep } from "../../foundry.types";
import { oklchString } from "./oklch-ladder.transform";

export interface GradientToken {
  readonly name: string; // e.g. "brand-linear", "brand-radial"
  readonly value: string;
}

/**
 * Standard recipe set per palette:
 * - linear: 400 → 700 diagonal (subtle depth)
 * - vivid:  300 → 600 diagonal (loud, promo)
 * - radial: 500 center → 900 edge
 * - conic:  500 → 300 → 500 sweep (subtle rim light)
 */
export function buildGradients(paletteName: string, ladder: Ladder): readonly GradientToken[] {
  const stop = (step: LadderStep) => oklchString(ladder[step]);
  return [
    {
      name: `${paletteName}-linear`,
      value: `linear-gradient(135deg, ${stop(400)} 0%, ${stop(700)} 100%)`,
    },
    {
      name: `${paletteName}-vivid`,
      value: `linear-gradient(135deg, ${stop(300)} 0%, ${stop(600)} 100%)`,
    },
    {
      name: `${paletteName}-radial`,
      value: `radial-gradient(circle at 30% 20%, ${stop(500)} 0%, ${stop(900)} 100%)`,
    },
    {
      name: `${paletteName}-conic`,
      value: `conic-gradient(from 120deg at 50% 50%, ${stop(500)}, ${stop(300)}, ${stop(500)})`,
    },
  ];
}
