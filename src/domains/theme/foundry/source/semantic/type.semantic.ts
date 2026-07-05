/**
 * Fluid type ramp definitions. Values are `[minRem, maxRem]` clamped
 * across the same 24vw → 120vw window as `src/domains/fluid/utils/fluid.util.ts`.
 * The build step emits these as CSS `clamp()` strings so no JS runs at runtime.
 */
export interface FluidType {
  readonly name: string;
  readonly min: number;
  readonly max: number;
  readonly leading?: number;
  readonly tracking?: string;
}

export const typeRamp: readonly FluidType[] = [
  { name: "eyebrow",   min: 0.6875, max: 0.8125, leading: 1.4,  tracking: "0.08em" },
  { name: "body-sm",   min: 0.8125, max: 0.9375, leading: 1.5 },
  { name: "body",      min: 0.9375, max: 1.0625, leading: 1.55 },
  { name: "body-lg",   min: 1.0625, max: 1.25,   leading: 1.5 },
  { name: "h4",        min: 1.125,  max: 1.375,  leading: 1.35, tracking: "-0.005em" },
  { name: "h3",        min: 1.375,  max: 1.75,   leading: 1.25, tracking: "-0.01em" },
  { name: "h2",        min: 1.75,   max: 2.5,    leading: 1.15, tracking: "-0.015em" },
  { name: "h1",        min: 2.25,   max: 3.5,    leading: 1.05, tracking: "-0.02em" },
  { name: "display",   min: 3.0,    max: 5.5,    leading: 0.98, tracking: "-0.03em" },
  { name: "display-xl",min: 4.0,    max: 8.5,    leading: 0.94, tracking: "-0.035em" },
];
