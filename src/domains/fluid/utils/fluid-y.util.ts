/**
 * fluidY — Y-axis fluid clamp (small-viewport-height driven).
 *
 * @remarks
 * Thin wrapper over {@link fluidAxis} with `axis: "y"`. Uses `svh` so
 * mobile browser chrome shrinking does not cause a jump.
 *
 * @public
 */
import { fluidAxis } from "./fluid-axis.util";
import type { FluidUnit } from "../types/fluid.types";

export function fluidY(
  min: number,
  max: number,
  opts: { minSvh?: number; maxSvh?: number; unit?: FluidUnit } = {},
): string {
  return fluidAxis({
    min,
    max,
    axis: "y",
    minVp: opts.minSvh,
    maxVp: opts.maxSvh,
    unit: opts.unit,
  });
}
