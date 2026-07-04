/**
 * Keyboard shortcuts for the deck runtime.
 */
import { useEffect } from "react";

interface Options {
  onPrev: () => void;
  onNext: () => void;
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
