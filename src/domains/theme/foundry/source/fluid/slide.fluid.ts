/**
 * Fluid slide chrome — emits `--slide-pad-x` (vw-driven) and
 * `--slide-pad-y` (svh-driven).
 */
import type { FluidSourceEntry } from "./fluid-source.types";

export const slideFluid: readonly FluidSourceEntry[] = [
  { name: "slide-pad-x", min: 1.0000, max: 4.0000, axis: "x" },
  { name: "slide-pad-y", min: 1.0000, max: 3.0000, axis: "y" },
];
