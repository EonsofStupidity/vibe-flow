/**
 * Shared types for the fluid clamp domain.
 *
 * @remarks
 * `FluidAxisInput` is the canonical input shape for the math core in
 * `utils/fluid-axis.util.ts`. Every other fluid helper narrows this shape.
 */

/** Axis the interpolation runs along. `"x"` uses `vw`, `"y"` uses `svh`. */
export type FluidAxis = "x" | "y";

/** Length unit emitted by the clamp string. */
export type FluidUnit = "rem" | "px";

/**
 * Canonical input for `fluidAxis(...)`. `minVp`/`maxVp` default to the
 * project-wide window in `config/fluid-window.const.ts` for the requested
 * axis, so callers rarely pass them.
 */
export interface FluidAxisInput {
  readonly min: number;
  readonly max: number;
  readonly axis?: FluidAxis;
  readonly minVp?: number;
  readonly maxVp?: number;
  readonly unit?: FluidUnit;
}

/** Non-stringified numeric range — useful for tests, snapshots, docs. */
export interface FluidRange {
  readonly min: number;
  readonly max: number;
  readonly minVp: number;
  readonly maxVp: number;
  readonly axis: FluidAxis;
  readonly unit: FluidUnit;
  readonly slope: number;
  readonly intercept: number;
}

/** Emitted CSS custom property + `clamp()` value. */
export interface FluidToken {
  readonly name: string;
  readonly value: string;
}

/** Measured container box, returned by `useFluidBox`. */
export interface FluidBox {
  readonly width: number;
  readonly height: number;
  /** 0..1 progress across the X window. */
  readonly xt: number;
  /** 0..1 progress across the Y window. */
  readonly yt: number;
}
