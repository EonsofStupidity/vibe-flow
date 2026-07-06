/**
 * useContentSize — content-region size + fluid-window progress, exposed
 * to any component under `<AppShell>`.
 *
 * @remarks
 * Thin adapter over `useShellSize()` so content-layer domains never
 * import shell internals directly. Adds the 0..1 progress (`xt`/`yt`)
 * across the site-wide fluid windows so animations, SVG viewBoxes, and
 * canvas draws line up with the CSS clamps in `primitives.css`.
 *
 * @returns `{ width, height, dpr, xt, yt }` — `xt`/`yt` clamped 0..1.
 * @public
 */
import { useMemo } from "react";
import { FLUID_X, FLUID_Y } from "../config/fluid-window.const";
import { useShellSize } from "@/domains/shell/context/useShellSize";

export interface ContentSize {
  readonly width: number;
  readonly height: number;
  readonly dpr: number;
  readonly xt: number;
  readonly yt: number;
}

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

export function useContentSize(): ContentSize {
  const { width, height, dpr } = useShellSize();
  return useMemo(() => {
    const root = typeof document !== "undefined"
      ? parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
      : 16;
    const wRem = width / root;
    const hRem = height / root;
    return {
      width,
      height,
      dpr,
      xt: clamp01((wRem - FLUID_X.minVp) / (FLUID_X.maxVp - FLUID_X.minVp)),
      yt: clamp01((hRem - FLUID_Y.minVp) / (FLUID_Y.maxVp - FLUID_Y.minVp)),
    };
  }, [width, height, dpr]);
}
