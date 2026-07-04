/**
 * StillZoomable — pinch-zoom, pan, and double-tap-reset for a still image.
 *
 * @remarks
 * data-no-swipe on the touch surface so gestures don't trigger deck nav.
 */
import { usePinchZoom } from "@/domains/input/hooks/usePinchZoom.hook";
import { cn } from "@/lib/utils";

interface StillZoomableProps {
  readonly src: string;
  readonly alt: string;
  readonly caption?: string;
  readonly className?: string;
}

export function StillZoomable({ src, alt, caption, className }: StillZoomableProps) {
  const { ref, style, transform, reset } = usePinchZoom();
  return (
    <figure className={cn("relative flex h-full w-full flex-col items-center justify-center gap-6", className)}>
      <div
        ref={ref}
        data-no-swipe
        className="relative flex h-full max-h-[70vh] w-full items-center justify-center overflow-hidden rounded-xl bg-panel/60 hairline-b"
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
            className="tap-target absolute bottom-4 right-4 rounded-full bg-primary px-6 font-mono text-sm uppercase tracking-widest text-primary-foreground"
          >
            Reset {transform.scale.toFixed(1)}×
          </button>
        ) : null}
      </div>
      {caption ? (
        <figcaption className="max-w-3xl text-center text-lg text-muted-foreground">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
