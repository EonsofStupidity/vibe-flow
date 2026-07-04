/**
 * fluid — emit a CSS `clamp()` string for viewport-fluid X-axis sizing.
 *
 * @remarks
 * Pure function. Emits a string suitable for CSS values (inline styles,
 * `@theme` tokens, `--var` declarations). No JS at runtime, no observers.
 *
 * Values are expressed in rem by default so they respect user root font-size.
 * Set `unit: "px"` when a rem-scaled value would be inappropriate (icon
 * sizes, hairline strokes).
 *
 * The interpolation range defaults to 24vw → 120vw (~384px → ~1920px on a
 * 16px root), matching the token scale in `domains/theme/tokens/fluid.css`.
 *
 * @param min - Size at (or below) `minVw` viewport width.
 * @param max - Size at (or above) `maxVw` viewport width.
 * @param opts - `minVw` / `maxVw` interpolation bounds and `unit`.
 *
 * @example
 * // Font size 0.875rem on a narrow viewport, 1.25rem on a wide one.
 * const fs = fluid(0.875, 1.25);
 *
 * @example
 * // Pixel-scaled icon stroke.
 * const stroke = fluid(1, 2, { unit: "px" });
 *
 * @public
 */
export function fluid(
  min: number,
  max: number,
  opts: { minVw?: number; maxVw?: number; unit?: "rem" | "px" } = {},
): string {
  const { minVw = 24, maxVw = 120, unit = "rem" } = opts;
  const slope = (max - min) / (maxVw - minVw);
  const intercept = min - slope * minVw;
  const vw = (slope * 100).toFixed(4);
  const base = intercept.toFixed(4);
  return `clamp(${min}${unit}, calc(${base}${unit} + ${vw}vw), ${max}${unit})`;
}
