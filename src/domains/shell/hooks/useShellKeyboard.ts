/**
 * useShellKeyboard — global keyboard shortcuts for the shell chrome.
 *
 * @remarks
 * Bindings:
 *   - `Esc`  → exit full-bleed
 *   - `[`    → toggle left rail
 *   - `]`    → toggle right panel
 *   - `\\`   → toggle full-bleed
 *
 * Skips when focus is inside an editable element so typing `[` in a
 * textarea doesn't collapse the rail.
 */
import { useEffect } from "react";
import { useShellStore } from "../state/shell.store";

function isEditableTarget(t: EventTarget | null): boolean {
  if (!(t instanceof HTMLElement)) return false;
  const tag = t.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (t.isContentEditable) return true;
  return false;
}

export function useShellKeyboard(): void {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isEditableTarget(e.target)) return;
      const store = useShellStore.getState();
      if (e.key === "Escape" && store.fullBleed) {
        store.setFullBleed(false);
        e.preventDefault();
        return;
      }
      if (e.key === "[") {
        store.toggleLeft();
        e.preventDefault();
        return;
      }
      if (e.key === "]") {
        store.toggleRight();
        e.preventDefault();
        return;
      }
      if (e.key === "\\") {
        store.toggleFullBleed();
        e.preventDefault();
        return;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}
