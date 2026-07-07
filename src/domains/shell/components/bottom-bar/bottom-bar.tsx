/**
 * BottomBar — persistent status bar. Shows measured viewport + shortcuts.
 */
import { useShellSize } from "../../context/useShellSize";
import { useShellStore } from "../../state/shell.store";

export function BottomBar() {
  const size = useShellSize();
  const brand = useShellStore((s) => s.brand);
  return (
    <footer
      role="contentinfo"
      className="flex flex-wrap items-center justify-between gap-f3 border-t border-hairline bg-surface-raised/80 px-f4 font-mono text-eyebrow uppercase tracking-[0.2em] text-ink-muted backdrop-blur-md"
      style={{ minHeight: "var(--bottombar-height)" }}
    >
      <div className="flex min-w-0 items-center gap-f3">
        <span className="text-brand">●</span>
        <span className="truncate">brand: {brand}</span>
      </div>
      <div className="tabular-nums">
        {Math.round(size.width)} × {Math.round(size.height)} · dpr {size.dpr}
      </div>
      <div className="flex flex-wrap items-center gap-f2">
        <kbd className="rounded-f-sm bg-surface px-f2">[</kbd>
        <kbd className="rounded-f-sm bg-surface px-f2">]</kbd>
        <kbd className="rounded-f-sm bg-surface px-f2">\</kbd>
        <span>rail / panel / full-bleed</span>
      </div>
    </footer>
  );
}
