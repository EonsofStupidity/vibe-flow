/**
 * fluidAxis — canonical math core for site-wide fluid clamping.
 *
 * @remarks
 * Every clamp string emitted by the foundry AND every clamp computed at
 * runtime flows through this one function. Both the runtime helpers
 * (`fluid`, `fluidY`, `useFluid`) and the build-time transform
 * (`build/transforms/fluid.transform.ts`) import from here so a single
 * change to the interpolation window in
 * `src/domains/fluid/config/fluid-window.const.ts` rescales the entire
 * site.
 *
 * Output is a pure CSS `clamp(min, calc(base + slope·unit), max)` string,
 * so the browser evaluates the curve natively — no JS at runtime for the
 * values themselves.
 *
 * @param input - min/max pair, axis, optional window overrides, output unit.
 * @returns A `clamp(...)` string suitable for any CSS value slot.
 * @public
 */
import { FLUID_X, FLUID_Y } from "../config/fluid-window.const";
import type { FluidAxisInput, FluidRange } from "../types/fluid.types";

const DECIMALS = 4;

function windowFor(axis: "x" | "y"): { minVp: number; maxVp: number } {
  return axis === "y" ? FLUID_Y : FLUID_X;
}

/** Numeric decomposition — same shape the CSS string is built from. */
export function fluidRange(input: FluidAxisInput): FluidRange {
  const axis = input.axis ?? "x";
  const unit = input.unit ?? "rem";
  const win = windowFor(axis);
  const minVp = input.minVp ?? win.minVp;
  const maxVp = input.maxVp ?? win.maxVp;
  if (maxVp === minVp) {
    throw new Error("[fluid] minVp and maxVp must differ");
  }
  const slope = (input.max - input.min) / (maxVp - minVp);
  const intercept = input.min - slope * minVp;
  return {
    min: input.min,
    max: input.max,
    minVp,
    maxVp,
    axis,
    unit,
    slope,
    intercept,
  };
}

/** Emit a CSS `clamp()` string. */
export function fluidAxis(input: FluidAxisInput): string {
  const r = fluidRange(input);
  const viewportUnit = r.axis === "y" ? "svh" : "vw";
  const vw = (r.slope * 100).toFixed(DECIMALS);
  const base = r.intercept.toFixed(DECIMALS);
  const min = r.min.toFixed(DECIMALS);
  const max = r.max.toFixed(DECIMALS);
  return `clamp(${min}${r.unit}, calc(${base}${r.unit} + ${vw}${viewportUnit}), ${max}${r.unit})`;
}
