/**
 * Fluid radii — emits `--r-sm`, `--r-md`, `--r-lg`.
 *
 * @remarks
 * `--radius-f-sm/md/lg` in `src/styles.css` maps to these so Tailwind's
 * `rounded-f-sm/md/lg` utilities interpolate with the viewport.
 */
import type { FluidSourceEntry } from "./fluid-source.types";

export const radiusFluid: readonly FluidSourceEntry[] = [
  { name: "r-sm", min: 0.2500, max: 0.3750 },
  { name: "r-md", min: 0.5000, max: 0.7500 },
  { name: "r-lg", min: 0.7500, max: 1.1250 },
];
