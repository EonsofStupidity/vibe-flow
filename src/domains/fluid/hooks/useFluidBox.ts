/**
 * useFluidBox — observe a container and report its size + 0..1 progress
 * across the site-wide fluid X/Y windows.
 *
 * @remarks
 * Container-driven, SSR-safe (`null` until first observation). Uses the
 * SAME windows as the token generator, so `xt`/`yt` line up with any
 * `--sp-*`, `--fs-*`, `--rail-*` clamp on the page.
 *
 * The rem-to-px conversion reads `document.documentElement.fontSize` once
 * per observation; if the root font-size changes at runtime, re-mount
 * the component or force a resize event.
 *
 * @public
 */
import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { FLUID_X, FLUID_Y } from "../config/fluid-window.const";
import type { FluidBox } from "../types/fluid.types";

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

export function useFluidBox<T extends HTMLElement>(): {
  readonly ref: RefObject<T | null>;
  readonly box: FluidBox | null;
} {
  const ref = useRef<T>(null);
  const [box, setBox] = useState<FluidBox | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const observer = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      const h = entry.contentRect.height;
      const wRem = w / rootFontSize;
      const hRem = h / rootFontSize;
      setBox({
        width: w,
        height: h,
        xt: clamp01((wRem - FLUID_X.minVp) / (FLUID_X.maxVp - FLUID_X.minVp)),
        yt: clamp01((hRem - FLUID_Y.minVp) / (FLUID_Y.maxVp - FLUID_Y.minVp)),
      });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, box };
}
