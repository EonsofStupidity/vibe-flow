/**
 * fluid — emit a CSS `clamp()` string for viewport-fluid X-axis sizing.
 *
 * @remarks
 * Pure function. Emits a string suitable for CSS values (inline styles,
 * `@theme` tokens, `--var` declarations). No JS at runtime, no observers.
 *
 * Given a min and max size in pixels and the viewport range in vw across
 * which the size should interpolate linearly, produces the standard
 * `clamp(min, calc(a + b*vw), max)` form the browser evaluates natively.
 *
 * @param minPx - Size at (or below) `minVw` viewport width.
 * @param maxPx - Size at (or above) `maxVw` viewport width.
 * @param minVw - Lower bound of the interpolation range, in vw. Default 24.
 * @param maxVw - Upper bound of the interpolation range, in vw. Default 120.
 *
 * @example
 * // Font size 14px on a 384px viewport, 20px on a 1920px viewport.
 * const fs = fluid(14, 20);
 *
 * @public
 */
export function fluid(
  minPx: number,
  maxPx: number,
  minVw: number = 24,
  maxVw: number = 120,
): string {
  const slope = (maxPx - minPx) / (maxVw - minVw);
  const intercept = minPx - slope * minVw;
  const vw = (slope * 100).toFixed(4);
  const px = intercept.toFixed(4);
  return `clamp(${minPx}px, calc(${px}px + ${vw}vw), ${maxPx}px)`;
}
