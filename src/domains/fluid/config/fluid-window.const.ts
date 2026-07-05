/**
 * Fluid interpolation windows — single source of truth for the site-wide
 * fluid XY curve.
 *
 * @remarks
 * `FLUID_X` bounds are in `vw` (root-relative width). `FLUID_Y` bounds are
 * in `svh` (small-viewport height) so mobile browser-chrome swaps don't
 * cause the value to jump.
 *
 * These constants are imported by both the runtime helpers in
 * `src/domains/fluid/utils/*` AND the build-time foundry transform in
 * `src/domains/theme/foundry/build/transforms/fluid.transform.ts`, so the
 * scales you see in CSS and the strings you get from the runtime `fluid()`
 * helper always share the same window.
 *
 * @public
 */
export const FLUID_X = {
  /** ~384px @ 16px root — narrowest viewport the curve considers. */
  minVp: 24,
  /** ~1920px @ 16px root — widest viewport the curve considers. */
  maxVp: 120,
} as const;

export const FLUID_Y = {
  /** Small viewports (phones with visible chrome). */
  minVp: 40,
  /** Full-height desktop / kiosk. */
  maxVp: 100,
} as const;
