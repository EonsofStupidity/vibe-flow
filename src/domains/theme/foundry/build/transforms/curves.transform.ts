/**
 * Ladder curves — target lightness per step and chroma modulation.
 *
 * @remarks
 * The anchor's `l` is informational; the curve determines the actual
 * L for each step. Chroma is anchor.c multiplied by the curve modulator.
 * Hue stays constant across the ladder.
 */
import type { LadderCurve, ChromaCurve, LadderStep } from "../../foundry.types";

export const LIGHTNESS: Record<LadderCurve, Record<LadderStep, number>> = {
  brand: {
    50: 0.98, 100: 0.95, 200: 0.90, 300: 0.84, 400: 0.79, 500: 0.72,
    600: 0.62, 700: 0.52, 800: 0.42, 900: 0.32, 950: 0.22,
  },
  perceptual: {
    50: 0.98, 100: 0.95, 200: 0.90, 300: 0.84, 400: 0.79, 500: 0.72,
    600: 0.62, 700: 0.52, 800: 0.42, 900: 0.32, 950: 0.22,
  },
  neutral: {
    50: 0.98, 100: 0.94, 200: 0.86, 300: 0.72, 400: 0.58, 500: 0.44,
    600: 0.32, 700: 0.24, 800: 0.20, 900: 0.16, 950: 0.10,
  },
  muted: {
    50: 0.94, 100: 0.88, 200: 0.80, 300: 0.72, 400: 0.62, 500: 0.52,
    600: 0.44, 700: 0.36, 800: 0.28, 900: 0.22, 950: 0.16,
  },
};

export const CHROMA: Record<ChromaCurve, Record<LadderStep, number>> = {
  "linear-to-500": {
    50: 0.15, 100: 0.30, 200: 0.55, 300: 0.80, 400: 0.95, 500: 1.00,
    600: 1.00, 700: 0.90, 800: 0.75, 900: 0.55, 950: 0.35,
  },
  flat: {
    50: 1, 100: 1, 200: 1, 300: 1, 400: 1, 500: 1,
    600: 1, 700: 1, 800: 1, 900: 1, 950: 1,
  },
  soft: {
    50: 0.40, 100: 0.55, 200: 0.70, 300: 0.85, 400: 0.95, 500: 1.00,
    600: 0.95, 700: 0.85, 800: 0.70, 900: 0.55, 950: 0.40,
  },
};
