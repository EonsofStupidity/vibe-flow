/**
 * fluidY — emit a CSS `clamp()` string for viewport-fluid Y-axis sizing.
 *
 * @remarks
 * Uses `svh` (small viewport height) rather than `vh` so mobile browser
 * chrome shrinking does not cause the value to jump. Same shape as
 * {@link fluid} but scoped to vertical interpolation.
 *
 * @param minPx - Size at (or below) `minSvh`.
 * @param maxPx - Size at (or above) `maxSvh`.
 * @param minSvh - Lower bound of the interpolation range, in svh. Default 40.
 * @param maxSvh - Upper bound of the interpolation range, in svh. Default 100.
 *
 * @public
 */
export function fluidY(
  minPx: number,
  maxPx: number,
  minSvh: number = 40,
  maxSvh: number = 100,
): string {
  const slope = (maxPx - minPx) / (maxSvh - minSvh);
  const intercept = minPx - slope * minSvh;
  const svh = (slope * 100).toFixed(4);
  const px = intercept.toFixed(4);
  return `clamp(${minPx}px, calc(${px}px + ${svh}svh), ${maxPx}px)`;
}
