/**
 * Fluid type ramp — emits `--fs-*`, `--leading-*`, `--tracking-*`.
 *
 * @remarks
 * Names align with the `@theme inline` block in `src/styles.css`
 * (`--text-eyebrow: var(--fs-eyebrow)` etc.) — do not rename without
 * updating that file too.
 */
import type { FluidSourceEntry } from "./fluid-source.types";

export const typeFluid: readonly FluidSourceEntry[] = [
  { name: "fs-eyebrow", min: 0.6875, max: 0.9375, companions: [{ suffix: "leading-eyebrow", value: 1.4 }, { suffix: "tracking-eyebrow", value: "0.08em" }] },
  { name: "fs-body-sm", min: 0.8125, max: 0.9375, companions: [{ suffix: "leading-body-sm", value: 1.5 }] },
  { name: "fs-body",    min: 0.9375, max: 1.1250, companions: [{ suffix: "leading-body", value: 1.55 }] },
  { name: "fs-body-lg", min: 1.0625, max: 1.2500, companions: [{ suffix: "leading-body-lg", value: 1.5 }] },
  { name: "fs-h4",      min: 1.1250, max: 1.3750, companions: [{ suffix: "leading-h4", value: 1.35 }, { suffix: "tracking-h4", value: "-0.005em" }] },
  { name: "fs-h3",      min: 1.3750, max: 1.7500, companions: [{ suffix: "leading-h3", value: 1.25 }, { suffix: "tracking-h3", value: "-0.01em" }] },
  { name: "fs-h2",      min: 1.7500, max: 2.5000, companions: [{ suffix: "leading-h2", value: 1.15 }, { suffix: "tracking-h2", value: "-0.015em" }] },
  { name: "fs-h1",      min: 2.2500, max: 3.5000, companions: [{ suffix: "leading-h1", value: 1.05 }, { suffix: "tracking-h1", value: "-0.02em" }] },
  { name: "fs-display", min: 3.0000, max: 5.5000, companions: [{ suffix: "leading-display", value: 0.98 }, { suffix: "tracking-display", value: "-0.03em" }] },
  { name: "fs-display-xl", min: 4.0000, max: 8.5000, companions: [{ suffix: "leading-display-xl", value: 0.94 }, { suffix: "tracking-display-xl", value: "-0.035em" }] },
];
