/**
 * RuntimeToolbar — edge-anchored controls: home, navigator, annotate, chrome.
 */
import { Link } from "@tanstack/react-router";
import { Home, LayoutGrid, PenLine, Eye, EyeOff } from "lucide-react";
import { Toolbar, ToolbarGroup } from "@/domains/ui/toolbar/toolbar";
import { Button } from "@/domains/ui/button/button";
import { ToggleButton } from "@/domains/ui/toggle-button/toggle-button";

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
      className={`absolute inset-x-0 bottom-0 z-40 bg-surface/70 px-f6 py-f4 backdrop-blur-md hairline-t transition-opacity duration-200 ${chromeHidden ? "pointer-events-none opacity-0" : "opacity-100"}`}
    >
      <Toolbar
        aria-label="Runtime controls"
        className="flex items-center justify-between gap-f4"
      >
        <ToolbarGroup aria-label="Navigation" className="flex items-center gap-f3">
          <Link
            to="/"
            aria-label="Back to deck picker"
            className="tap-target inline-flex aspect-square items-center justify-center rounded-full bg-surface-raised text-ink outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            <Home className="h-6 w-6" />
          </Link>
          <Button shape="icon" onPress={onNavigator} aria-label="Open slide navigator">
            <LayoutGrid className="h-6 w-6" />
          </Button>
        </ToolbarGroup>

        <div className="flex min-w-0 flex-col items-center text-center">
          <span className="truncate font-mono text-eyebrow uppercase tracking-[0.25em] text-ink-muted">
            {deckTitle}
          </span>
          <span className="truncate font-display text-h3 text-ink">{slideTitle}</span>
        </div>

        <ToolbarGroup aria-label="Slide tools" className="flex items-center gap-f3">
          <span className="font-mono text-body tabular-nums text-ink-muted">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <ToggleButton
            shape="icon"
            isSelected={annotateOn}
            onChange={onAnnotate}
            aria-label="Toggle annotate"
          >
            <PenLine className="h-6 w-6" />
          </ToggleButton>
          <ToggleButton
            shape="icon"
            isSelected={chromeHidden}
            onChange={onChrome}
            aria-label="Toggle chrome"
          >
            {chromeHidden ? <Eye className="h-6 w-6" /> : <EyeOff className="h-6 w-6" />}
          </ToggleButton>
        </ToolbarGroup>
      </Toolbar>
    </div>
  );
}
