/**
 * RuntimeToolbar — edge-anchored controls: home, navigator, annotate, chrome.
 */
import { Link } from "@tanstack/react-router";
import { Home, LayoutGrid, PenLine, Eye, EyeOff } from "lucide-react";

interface RuntimeToolbarProps {
  readonly onNavigator: () => void;
  readonly onAnnotate: () => void;
  readonly onChrome: () => void;
  readonly annotateOn: boolean;
  readonly chromeHidden: boolean;
  readonly index: number;
  readonly total: number;
  readonly deckTitle: string;
  readonly slideTitle: string;
}

export function RuntimeToolbar({
  onNavigator,
  onAnnotate,
  onChrome,
  annotateOn,
  chromeHidden,
  index,
  total,
  deckTitle,
  slideTitle,
}: RuntimeToolbarProps) {
  return (
    <div
      data-no-swipe
      className={`absolute inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 bg-background/70 px-6 py-4 backdrop-blur-md hairline-t transition-opacity duration-200 ${chromeHidden ? "pointer-events-none opacity-0" : "opacity-100"}`}
    >
      <div className="flex items-center gap-3">
        <Link
          to="/"
          aria-label="Back to deck picker"
          className="tap-target flex items-center justify-center rounded-full bg-secondary text-secondary-foreground"
        >
          <Home className="h-6 w-6" />
        </Link>
        <button
          type="button"
          onClick={onNavigator}
          aria-label="Open slide navigator"
          className="tap-target flex items-center justify-center rounded-full bg-secondary text-secondary-foreground"
        >
          <LayoutGrid className="h-6 w-6" />
        </button>
      </div>

      <div className="flex min-w-0 flex-col items-center text-center">
        <span className="truncate font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
          {deckTitle}
        </span>
        <span className="truncate font-display text-lg text-foreground">{slideTitle}</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden font-mono text-sm tabular-nums text-muted-foreground sm:inline">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={onAnnotate}
          aria-pressed={annotateOn}
          aria-label="Toggle annotate"
          className={`tap-target flex items-center justify-center rounded-full ${annotateOn ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
        >
          <PenLine className="h-6 w-6" />
        </button>
        <button
          type="button"
          onClick={onChrome}
          aria-pressed={chromeHidden}
          aria-label="Toggle chrome"
          className="tap-target flex items-center justify-center rounded-full bg-secondary text-secondary-foreground"
        >
          {chromeHidden ? <Eye className="h-6 w-6" /> : <EyeOff className="h-6 w-6" />}
        </button>
      </div>
    </div>
  );
}
