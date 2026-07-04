/**
 * StillZoomable — pinch-zoom, pan, and double-tap-reset for a still image.
 *
 * @remarks
 * `data-no-swipe` on the touch surface so gestures don't trigger deck nav.
 */
import { usePinchZoom } from "@/domains/input/hooks/usePinchZoom";
import { cn } from "@/domains/ui/utils/cn.util";

interface StillZoomableProps {
  readonly src: string;
  readonly alt: string;
  readonly caption?: string;
  readonly className?: string;
}

export function StillZoomable({ src, alt, caption, className }: StillZoomableProps) {
  const { ref, style, transform, reset } = usePinchZoom();
  return (
    <figure className={cn("relative flex h-full w-full flex-col items-center justify-center gap-f5", className)}>
      <div
        ref={ref}
        data-no-swipe
        className="relative flex h-full max-h-[70svh] w-full items-center justify-center overflow-hidden rounded-f-md bg-surface-raised/60 hairline-b"
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          style={style}
          className="pointer-events-none max-h-full max-w-full select-none object-contain"
        />
        {transform.scale > 1 ? (
          <button
            type="button"
            onClick={reset}
            className="tap-target absolute bottom-f3 right-f3 rounded-full bg-brand px-f5 font-mono text-eyebrow uppercase tracking-widest text-brand-ink"
          >
            Reset {transform.scale.toFixed(1)}×
          </button>
        ) : null}
      </div>
      {caption ? (
        <figcaption className="max-w-3xl text-center text-h3 text-ink-muted">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
