import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, LayoutGrid } from "lucide-react";
import { listDecks } from "@/domains/deck/services/deck-registry.service";
import type { Deck } from "@/domains/deck/types/deck.types";
import { cn } from "@/domains/ui/utils/cn.util";

export const Route = createFileRoute("/_shell/")({
  component: EpisodePicker,
});

type PropertyFilter = "all" | "eos" | "news" | "vibes";

const FILTER_TABS: readonly { id: PropertyFilter; label: string }[] = [
  { id: "all",   label: "All" },
  { id: "eos",   label: "EoS" },
  { id: "news",  label: "News" },
  { id: "vibes", label: "Vibes" },
];

const PROPERTY_STYLES: Record<string, { badge: string; dot: string; glow: string }> = {
  eos:   { badge: "bg-accent-lime/20 text-accent-lime border-accent-lime/30",         dot: "bg-accent-lime",    glow: "hover:shadow-[0_0_2rem_-0.5rem_var(--color-accent-lime)] hover:border-accent-lime/40" },
  news:  { badge: "bg-accent-magenta/20 text-accent-magenta border-accent-magenta/30", dot: "bg-accent-magenta", glow: "hover:shadow-[0_0_2rem_-0.5rem_var(--color-accent-magenta)] hover:border-accent-magenta/40" },
  vibes: { badge: "bg-accent-coral/20 text-accent-coral border-accent-coral/30",       dot: "bg-accent-coral",   glow: "hover:shadow-[0_0_2rem_-0.5rem_var(--color-accent-coral)] hover:border-accent-coral/40" },
};

const DEFAULT_STYLE = {
  badge: "bg-brand/20 text-brand border-brand/30",
  dot: "bg-brand",
  glow: "hover:shadow-[0_0_2rem_-0.5rem_var(--color-brand)] hover:border-brand/40",
};

function DeckCard({ deck }: { deck: Deck }) {
  const propertyKey = (deck.eyebrow ?? "").toLowerCase();
  const style = PROPERTY_STYLES[propertyKey] ?? DEFAULT_STYLE;

  return (
    <article className={cn(
      "group relative flex flex-col overflow-hidden rounded-f-lg border border-hairline bg-surface-raised transition-[border-color,box-shadow]",
      style.glow,
    )}>
      {/* Cover art */}
      <div className="relative h-40 overflow-hidden bg-surface-overlay">
        {deck.cover ? (
          <img
            src={deck.cover}
            alt=""
            aria-hidden
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            draggable={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span
              className={cn("h-10 w-10 rounded-full shadow-[0_0_2rem_currentColor]", style.dot)}
              aria-hidden
            />
          </div>
        )}
        {deck.eyebrow ? (
          <span className={cn(
            "absolute left-f3 top-f3 rounded-full border px-f3 py-f1 font-mono text-eyebrow uppercase tracking-[0.2em]",
            style.badge,
          )}>
            {deck.eyebrow}
          </span>
        ) : null}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-f2 p-f5">
        <h2 className="font-display text-h2 font-semibold leading-tight text-ink-strong">
          {deck.title}
        </h2>
        {deck.summary ? (
          <p className="line-clamp-2 text-body text-ink-muted">{deck.summary}</p>
        ) : null}
        <div className="mt-auto flex items-center justify-between pt-f4 font-mono text-eyebrow uppercase tracking-[0.2em] text-ink-muted">
          <span className="flex items-center gap-f2">
            <LayoutGrid className="h-3 w-3" aria-hidden />
            {deck.slides.length} slides
          </span>
          <Link
            to="/deck/$deckId/$slideIndex/$stepIndex"
            params={{ deckId: deck.id, slideIndex: "0", stepIndex: "0" }}
            className="flex items-center gap-f2 text-brand transition-[letter-spacing] group-hover:tracking-[0.28em]"
            aria-label={`Open ${deck.title}`}
          >
            Open →
          </Link>
        </div>
      </div>

      {/* Presenter link */}
      <div className="border-t border-hairline px-f5 py-f3">
        <Link
          to="/present/$deckId/$slideIndex/$stepIndex"
          params={{ deckId: deck.id, slideIndex: "0", stepIndex: "0" }}
          className="flex items-center gap-f2 font-mono text-eyebrow uppercase tracking-[0.2em] text-ink-muted hover:text-ink"
          aria-label={`Open presenter view for ${deck.title}`}
        >
          <BookOpen className="h-3 w-3" aria-hidden />
          Presenter view
        </Link>
      </div>
    </article>
  );
}

function EpisodePicker() {
  const allDecks = listDecks();
  const [filter, setFilter] = useState<PropertyFilter>("all");

  const decks = filter === "all"
    ? allDecks
    : allDecks.filter((d) => (d.eyebrow ?? "").toLowerCase() === filter);

  return (
    <main className="min-h-dvh bg-surface px-f7 py-f8 text-ink">
      {/* Header */}
      <header className="mx-auto mb-f7 max-w-6xl">
        <div className="font-mono text-eyebrow uppercase tracking-[0.3em] text-brand">
          DevPULSE Labs · Show Runtime
        </div>
        <h1 className="mt-f4 font-display text-display font-bold leading-tight">
          Episode <span className="text-brand">Library</span>
        </h1>
        <p className="mt-f4 max-w-2xl text-h3 text-ink-muted">
          Pick a deck to open the slide viewer, or jump straight into presenter mode with full teleprompter and timer.
        </p>
      </header>

      {/* Property filter tabs */}
      <div className="mx-auto mb-f6 max-w-6xl">
        <div
          role="tablist"
          aria-label="Filter by property"
          className="inline-flex items-center gap-f1 rounded-f-md bg-surface-raised p-f1"
        >
          {FILTER_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={filter === t.id}
              onClick={() => setFilter(t.id)}
              className={cn(
                "rounded-f-sm px-f4 py-f2 font-mono text-eyebrow uppercase tracking-[0.2em] transition",
                filter === t.id
                  ? "bg-brand text-brand-ink"
                  : "text-ink-muted hover:text-ink",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-f3 font-mono text-eyebrow uppercase tracking-[0.2em] text-ink-muted">
          <span className="text-ink">{decks.length}</span> deck{decks.length !== 1 ? "s" : ""}
          {filter !== "all" ? ` · ${filter}` : null}
          {" · "}
          <span className="text-ink">{allDecks.reduce((n, d) => n + d.slides.length, 0)}</span> slides total
        </div>
      </div>

      {/* Grid */}
      {decks.length === 0 ? (
        <div className="mx-auto max-w-6xl rounded-f-lg border border-dashed border-hairline p-f8 text-center">
          <p className="text-h3 text-ink-muted">
            No {filter !== "all" ? filter.toUpperCase() : ""} decks registered yet.
          </p>
          <p className="mt-f3 text-body text-ink-muted">
            Create an episode folder under{" "}
            <code className="rounded-f-sm bg-surface-raised px-f2 font-mono">src/episodes/</code>{" "}
            and call{" "}
            <code className="rounded-f-sm bg-surface-raised px-f2 font-mono">registerDeck()</code>.
          </p>
        </div>
      ) : (
        <ul
          className="mx-auto grid max-w-6xl gap-f5 [grid-template-columns:repeat(auto-fill,minmax(22rem,1fr))]"
          role="list"
        >
          {decks.map((deck) => (
            <li key={deck.id}>
              <DeckCard deck={deck} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
