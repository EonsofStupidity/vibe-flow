/**
 * useFluidScale — numeric interpolated value across the fluid window.
 *
 * @remarks
 * CSS `clamp()` is the right answer for style values. This hook is for
 * the slots CSS cannot reach: SVG numeric attributes, canvas coords,
 * framer-motion `MotionValue` inputs, third-party chart configs.
 *
 * The interpolation window matches the site-wide fluid X/Y curves so a
 * hook-driven number scales in lockstep with a CSS clamp using the same
 * `min`/`max` bounds.
 *
 * @returns The interpolated numeric value in the requested unit (`rem`
 * or `px`). Uses the current window inner size — updates on resize.
 * @public
 */
import { useEffect, useState } from "react";
import { FLUID_X, FLUID_Y } from "../config/fluid-window.const";
import type { FluidAxis, FluidUnit } from "../types/fluid.types";

export interface UseFluidScaleInput {
  readonly min: number;
  readonly max: number;
  readonly axis?: FluidAxis;
  readonly unit?: FluidUnit;
}

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

export function useFluidScale(input: UseFluidScaleInput): number {
  const axis = input.axis ?? "x";
  const unit = input.unit ?? "rem";
  const [value, setValue] = useState<number>(input.min);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const win = axis === "y" ? FLUID_Y : FLUID_X;

    const compute = () => {
      const vpPx = axis === "y" ? window.innerHeight : window.innerWidth;
      const vpRem = vpPx / root;
      const t = clamp01((vpRem - win.minVp) / (win.maxVp - win.minVp));
      const rem = input.min + (input.max - input.min) * t;
      setValue(unit === "px" ? rem * root : rem);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [input.min, input.max, axis, unit]);

  return value;
}
