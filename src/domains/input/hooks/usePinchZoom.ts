/**
 * Pinch-to-zoom + pan for a stills element.
 *
 * @remarks
 * Two-pointer pinch computes scale from distance ratio. Single-pointer
 * drag pans when scale > 1. Double-tap resets. Values applied via
 * CSS transform on the returned ref target.
 */
import { useCallback, useEffect, useRef, useState } from "react";

interface Transform {
  scale: number;
  x: number;
  y: number;
}

const IDENTITY: Transform = { scale: 1, x: 0, y: 0 };

export function usePinchZoom() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [t, setT] = useState<Transform>(IDENTITY);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const startDist = useRef(0);
  const startScale = useRef(1);
  const lastTap = useRef(0);
  const dragOrigin = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);

  const reset = useCallback(() => setT(IDENTITY), []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const dist = () => {
      const [a, b] = Array.from(pointers.current.values());
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      return Math.hypot(dx, dy);
    };

    const down = (e: PointerEvent) => {
      el.setPointerCapture(e.pointerId);
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.current.size === 2) {
        startDist.current = dist();
        startScale.current = t.scale;
        dragOrigin.current = null;
      } else if (pointers.current.size === 1) {
        const now = Date.now();
        if (now - lastTap.current < 300) {
          reset();
          lastTap.current = 0;
          return;
        }
        lastTap.current = now;
        dragOrigin.current = { x: e.clientX, y: e.clientY, tx: t.x, ty: t.y };
      }
    };
    const move = (e: PointerEvent) => {
      if (!pointers.current.has(e.pointerId)) return;
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.current.size === 2 && startDist.current > 0) {
        const scale = Math.max(1, Math.min(6, startScale.current * (dist() / startDist.current)));
        setT((prev) => ({ ...prev, scale }));
      } else if (pointers.current.size === 1 && dragOrigin.current && t.scale > 1) {
        const o = dragOrigin.current;
        setT((prev) => ({ ...prev, x: o.tx + (e.clientX - o.x), y: o.ty + (e.clientY - o.y) }));
      }
    };
    const up = (e: PointerEvent) => {
      pointers.current.delete(e.pointerId);
      if (pointers.current.size < 2) startDist.current = 0;
      if (pointers.current.size === 0) dragOrigin.current = null;
    };

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, [t.scale, t.x, t.y, reset]);

  const style = {
    transform: `translate3d(${t.x}px, ${t.y}px, 0) scale(${t.scale})`,
    transformOrigin: "center center",
    transition: pointers.current.size === 0 ? "transform 200ms ease" : "none",
    touchAction: "none" as const,
  };

  return { ref, style, transform: t, reset };
}
