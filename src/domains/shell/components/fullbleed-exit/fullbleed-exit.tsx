/**
 * FullbleedExit — tiny corner affordance shown only while full-bleed is
 * on. Announces the Esc shortcut for screen-reader users.
 */
import { Minimize2 } from "lucide-react";
import { useShellStore } from "../../state/shell.store";

export function FullbleedExit() {
  const fullBleed = useShellStore((s) => s.fullBleed);
  const setFullBleed = useShellStore((s) => s.setFullBleed);
  if (!fullBleed) return null;
  return (
    <button
      type="button"
      onClick={() => setFullBleed(false)}
      aria-label="Exit full-bleed (Esc)"
      aria-keyshortcuts="Escape"
      className="fixed right-f3 top-f3 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-surface-raised/70 text-ink-muted backdrop-blur-md hover:text-ink"
    >
      <Minimize2 className="h-4 w-4" />
    </button>
  );
}
