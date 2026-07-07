/**
 * Keyboard shortcuts for the deck runtime.
 *
 * @remarks
 * `onPrev`/`onNext` are step-aware (bound to ←/→/PageUp/PageDown/Space by
 * the caller). `onSlidePrev`/`onSlideNext` skip the whole slide regardless
 * of reveal steps and are bound to ↑/↓.
 */
import { useEffect } from "react";

interface Options {
  onPrev: () => void;
  onNext: () => void;
  onSlidePrev: () => void;
  onSlideNext: () => void;
  onNavigator: () => void;
  onAnnotate: () => void;
  onChrome: () => void;
}

export function useKeyboardNav(o: Options): void {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement | null)?.closest("input,textarea")) return;
      switch (e.key) {
        case "ArrowLeft":
        case "PageUp":
          o.onPrev();
          break;
        case "ArrowRight":
        case "PageDown":
        case " ":
          o.onNext();
          break;
        case "ArrowUp":
          o.onSlidePrev();
          break;
        case "ArrowDown":
          o.onSlideNext();
          break;
        case "g":
        case "G":
          o.onNavigator();
          break;
        case "a":
        case "A":
          o.onAnnotate();
          break;
        case "h":
        case "H":
          o.onChrome();
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [o]);
}
