/**
 * Fluid spacing steps — emits `--sp-1..8`.
 *
 * @remarks
 * Names align with the `--spacing-f1..f8` mapping in `src/styles.css`
 * which powers Tailwind utilities like `gap-f3`, `p-f7`, `px-f4`.
 */
import type { FluidSourceEntry } from "./fluid-source.types";

export const spaceFluid: readonly FluidSourceEntry[] = [
  { name: "sp-1", min: 0.2500, max: 0.3750 }, //  4 →  6
  { name: "sp-2", min: 0.5000, max: 0.7500 }, //  8 → 12
  { name: "sp-3", min: 0.7500, max: 1.1250 }, // 12 → 18
  { name: "sp-4", min: 1.0000, max: 1.5000 }, // 16 → 24
  { name: "sp-5", min: 1.2500, max: 1.8750 }, // 20 → 30
  { name: "sp-6", min: 1.5000, max: 2.2500 }, // 24 → 36
  { name: "sp-7", min: 2.0000, max: 3.0000 }, // 32 → 48
  { name: "sp-8", min: 3.0000, max: 4.5000 }, // 48 → 72
];
