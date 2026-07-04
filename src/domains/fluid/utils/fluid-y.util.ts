/**
 * fluidY — emit a CSS `clamp()` string for viewport-fluid Y-axis sizing.
 *
 * @remarks
 * Uses `svh` (small viewport height) so mobile browser chrome shrinking
 * does not cause the value to jump. Same shape as {@link fluid}.
 *
 * @param min - Size at (or below) `minSvh`.
 * @param max - Size at (or above) `maxSvh`.
 * @param opts - `minSvh` / `maxSvh` interpolation bounds and `unit`.
 *
 * @public
 */
export function fluidY(
  min: number,
  max: number,
  opts: { minSvh?: number; maxSvh?: number; unit?: "rem" | "px" } = {},
): string {
  const { minSvh = 40, maxSvh = 100, unit = "rem" } = opts;
  const slope = (max - min) / (maxSvh - minSvh);
  const intercept = min - slope * minSvh;
  const svh = (slope * 100).toFixed(4);
  const base = intercept.toFixed(4);
  return `clamp(${min}${unit}, calc(${base}${unit} + ${svh}svh), ${max}${unit})`;
}
