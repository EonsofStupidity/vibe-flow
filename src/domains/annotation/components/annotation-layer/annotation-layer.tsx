/**
 * AnnotationLayer — pointer-driven canvas overlay for on-camera markup.
 *
 * @remarks
 * Sits above the slide, below the runtime chrome. Only captures pointer
 * events while enabled. Strokes are ephemeral — cleared per slide, not
 * persisted (v1 scope). Stroke color reads from the annotate ink token.
 */
import { useEffect, useRef } from "react";

interface AnnotationLayerProps {
  readonly enabled: boolean;
  readonly slideKey: string;
}

export function AnnotationLayer({ enabled, slideKey }: AnnotationLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Clear when slide changes.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, [slideKey]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !enabled) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resolve annotate stroke color from CSS custom property so brand swaps apply.
    const strokeColor =
      getComputedStyle(canvas).getPropertyValue("--ink-annotate").trim() ||
      "oklch(0.96 0.02 80)";

    const pos = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const down = (e: PointerEvent) => {
      drawing.current = true;
      last.current = pos(e);
      canvas.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!drawing.current || !last.current) return;
      const p = pos(e);
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 3 + (e.pressure || 0.5) * 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(last.current.x, last.current.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      last.current = p;
    };
    const up = () => {
      drawing.current = false;
      last.current = null;
    };
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    return () => {
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
    };
  }, [enabled]);

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className={enabled ? "pointer-events-auto" : "pointer-events-none"}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {enabled ? (
        <button
          type="button"
          onClick={clear}
          className="tap-target absolute bottom-24 right-f5 rounded-full bg-surface-raised px-f5 font-mono text-eyebrow uppercase tracking-[0.2em] text-ink hairline-b"
        >
          Clear ink
        </button>
      ) : null}
    </div>
  );
}
