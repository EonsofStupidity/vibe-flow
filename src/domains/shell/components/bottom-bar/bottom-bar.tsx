import { useShellStore } from "../../state/shell.store";
import { useShellSize } from "../../context/useShellSize";
import { listDecks } from "@/domains/deck/services/deck-registry.service";

export function BottomBar() {
  const brand = useShellStore((s) => s.brand);
  const size = useShellSize();
  const decks = listDecks();
  const totalSlides = decks.reduce((n, d) => n + d.slides.length, 0);

  return (
    <footer
      role="contentinfo"
      className="flex flex-wrap items-center justify-between gap-f3 border-t border-hairline bg-surface-raised/80 px-f4 font-mono text-eyebrow uppercase tracking-[0.2em] text-ink-muted backdrop-blur-md"
      style={{ minHeight: "var(--bottombar-height)" }}
    >
      <div className="flex items-center gap-f4">
        <span className="flex items-center gap-f2">
          <span className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_0.5rem_var(--color-brand)]" aria-hidden />
          <span className="text-brand">DevPULSE Labs</span>
        </span>
        <span className="text-ink-muted/50">·</span>
        <span>Brand: <span className="text-ink">{brand}</span></span>
        <span className="text-ink-muted/50">·</span>
        <span><span className="text-ink">{decks.length}</span> decks · <span className="text-ink">{totalSlides}</span> slides</span>
      </div>

      <div className="hidden items-center gap-f4 sm:flex">
        <span className="tabular-nums">
          {Math.round(size.width)} × {Math.round(size.height)}
        </span>
        <span className="text-ink-muted/50">·</span>
        <span className="flex items-center gap-f2">
          <kbd className="rounded-f-sm bg-surface px-f2">[</kbd>
          <kbd className="rounded-f-sm bg-surface px-f2">]</kbd>
          <kbd className="rounded-f-sm bg-surface px-f2">\</kbd>
          <span>rail · panel · full-bleed</span>
        </span>
      </div>
    </footer>
  );
}
