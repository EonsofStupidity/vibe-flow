/**
 * useFluid — memoized `clamp()` string for render-time consumers.
 *
 * @remarks
 * Prefer CSS token vars (`var(--sp-4)`, `var(--fs-body)`) over this hook.
 * Use it only when you must feed a fluid value into a slot that cannot
 * accept a CSS variable (SVG numeric attributes, canvas, third-party
 * charts).
 *
 * @public
 */
import { useMemo } from "react";
import { fluidAxis } from "../utils/fluid-axis.util";
import type { FluidAxisInput } from "../types/fluid.types";

export function useFluid(min: number, max: number, opts: Omit<FluidAxisInput, "min" | "max"> = {}): string {
  return useMemo(
    () => fluidAxis({ min, max, ...opts }),
    [min, max, opts.axis, opts.minVp, opts.maxVp, opts.unit],
  );
}
