/**
 * EdgeNav — full-height tap zones on the left/right edges for prev/next.
 *
 * @remarks
 * Sits above the slide (below annotate/chrome). 15% edge width, generous
 * tap area, subtle chevron that fades in on hover/press.
 */
import { ChevronLeft, ChevronRight } from "lucide-react";

interface EdgeNavProps {
  readonly onPrev: () => void;
  readonly onNext: () => void;
  readonly canPrev: boolean;
  readonly canNext: boolean;
  readonly hidden: boolean;
}

export function EdgeNav({ onPrev, onNext, canPrev, canNext, hidden }: EdgeNavProps) {
  return (
    <>
      <button
        type="button"
        aria-label="Previous slide"
        onClick={onPrev}
        disabled={!canPrev}
        className={`absolute left-0 top-0 z-30 flex h-full w-[12vw] items-center justify-start pl-4 transition-opacity duration-200 disabled:opacity-30 ${hidden ? "opacity-0" : "opacity-100"} focus:outline-none`}
      >
        <span className="tap-target flex items-center justify-center rounded-full bg-panel/70 text-foreground/70 backdrop-blur-sm hairline-b">
          <ChevronLeft className="h-8 w-8" />
        </span>
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={onNext}
        disabled={!canNext}
        className={`absolute right-0 top-0 z-30 flex h-full w-[12vw] items-center justify-end pr-4 transition-opacity duration-200 disabled:opacity-30 ${hidden ? "opacity-0" : "opacity-100"} focus:outline-none`}
      >
        <span className="tap-target flex items-center justify-center rounded-full bg-panel/70 text-foreground/70 backdrop-blur-sm hairline-b">
          <ChevronRight className="h-8 w-8" />
        </span>
      </button>
    </>
  );
}
