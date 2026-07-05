/**
 * fluid — X-axis fluid clamp (viewport-width driven).
 *
 * @remarks
 * Thin wrapper over {@link fluidAxis} — kept for call-site ergonomics.
 * The math core lives in `fluid-axis.util.ts` and the interpolation
 * window in `config/fluid-window.const.ts`.
 *
 * @public
 */
import { fluidAxis } from "./fluid-axis.util";
import type { FluidUnit } from "../types/fluid.types";

export function fluid(
  min: number,
  max: number,
  opts: { minVw?: number; maxVw?: number; unit?: FluidUnit } = {},
): string {
  return fluidAxis({
    min,
    max,
    axis: "x",
    minVp: opts.minVw,
    maxVp: opts.maxVw,
    unit: opts.unit,
  });
}
