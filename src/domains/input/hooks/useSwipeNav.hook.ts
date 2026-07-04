/**
 * Horizontal swipe detector for slide navigation.
 *
 * @remarks
 * Uses Pointer Events. Ignores swipes that begin on an element with
 * data-no-swipe (interactive widgets) to keep boring behavior predictable.
 */
import { useEffect, type RefObject } from "react";

interface Options {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  threshold?: number;
}

export function useSwipeNav(
  ref: RefObject<HTMLElement | null>,
  { onSwipeLeft, onSwipeRight, threshold = 60 }: Options,
): void {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let startX = 0;
    let startY = 0;
    let active = false;

    const down = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("[data-no-swipe]")) return;
      startX = e.clientX;
      startY = e.clientY;
      active = true;
    };
    const up = (e: PointerEvent) => {
      if (!active) return;
      active = false;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.abs(dx) < threshold) return;
      if (Math.abs(dy) > Math.abs(dx)) return;
      if (dx < 0) onSwipeLeft();
      else onSwipeRight();
    };

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", () => (active = false));
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointerup", up);
    };
  }, [ref, onSwipeLeft, onSwipeRight, threshold]);
}
