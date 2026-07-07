/**
 * EpisodePicker — landing screen showing all registered decks with
 * visual cards, property badges, slide counts, and quick-open links.
 */
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, BookOpen, LayoutGrid } from "lucide-react";
import { listDecks } from "@/domains/deck/services/deck-registry.service";
import type { Deck } from "@/domains/deck/types/deck.types";
import { cn } from "@/domains/ui/utils/cn.util";
import { CatalogPicker } from "@/domains/slide-catalog/components/catalog-picker/catalog-picker";

export const Route = createFileRoute("/_shell/")({
  component: EpisodePicker,
});

const PROPERTY_STYLES: Record<string, { badge: string; dot: string }> = {
  eos:   { badge: "bg-accent-lime/20 text-accent-lime border-accent-lime/30",     dot: "bg-accent-lime shadow-[0_0_0.5rem_var(--color-accent-lime)]" },
  news:  { badge: "bg-accent-magenta/20 text-accent-magenta border-accent-magenta/30", dot: "bg-accent-magenta shadow-[0_0_0.5rem_var(--color-accent-magenta)]" },
  vibes: { badge: "bg-accent-coral/20 text-accent-coral border-accent-coral/30",   dot: "bg-accent-coral shadow-[0_0_0.5rem_var(--color-accent-coral)]" },
};

function DeckCard({ deck }: { deck: Deck }) {
  const propertyKey = (deck.eyebrow ?? "").toLowerCase();
  const style = PROPERTY_STYLES[propertyKey] ?? {
    badge: "bg-brand/20 text-brand border-brand/30",
    dot: "bg-brand shadow-[0_0_0.5rem_var(--color-brand)]",
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-f-lg border border-hairline bg-surface-raised transition-[border-color,box-shadow] hover:border-brand/40 hover:shadow-[0_0_2rem_-0.5rem_var(--color-brand)]">
      {/* Cover / tone band */}
      <div className="relative h-36 overflow-hidden bg-surface-overlay">
        {deck.cover ? (
          <img
            src={deck.cover}
            alt={deck.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            draggable={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className={cn("h-10 w-10 rounded-full", style.dot)} aria-hidden />
          </div>
        )}
        {/* Property badge overlay */}
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
          <p className="text-body text-ink-muted">{deck.summary}</p>
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
  const decks = listDecks();
  const [catalogOpen, setCatalogOpen] = useState(false);

  return (
    <>
      <main className="min-h-dvh bg-surface px-f7 py-f8 text-ink">
        {/* Header */}
        <header className="mx-auto mb-f8 max-w-6xl">
          <div className="font-mono text-eyebrow uppercase tracking-[0.3em] text-brand">
            Show runtime · local only
          </div>
          <div className="mt-f4 flex items-end justify-between gap-f4">
            <h1 className="font-display text-display font-semibold leading-tight">
              DevPULSE <span className="text-brand">Labs</span>
            </h1>
            <button
              type="button"
              onClick={() => setCatalogOpen(true)}
              className="tap-target flex items-center gap-f3 rounded-full bg-brand px-f5 font-mono text-eyebrow uppercase tracking-[0.2em] text-brand-ink hover:brightness-110"
            >
              <Plus className="h-4 w-4" aria-hidden />
              Catalog
            </button>
          </div>
          <p className="mt-f5 max-w-2xl text-h3 text-ink-muted">
            Pick a deck. Then use your fingers. Prev/next lives on the edges.
            Pinch to zoom stills. Tap the pen to draw. Tap the grid to jump.
          </p>
        </header>

        {/* Stats bar */}
        <div className="mx-auto mb-f6 max-w-6xl flex items-center gap-f6 font-mono text-eyebrow uppercase tracking-[0.2em] text-ink-muted">
          <span>
            <span className="text-ink-strong">{decks.length}</span> decks registered
          </span>
          <span>
            <span className="text-ink-strong">
              {decks.reduce((n, d) => n + d.slides.length, 0)}
            </span>{" "}
            slides total
          </span>
        </div>

        {/* Grid */}
        {decks.length === 0 ? (
          <div className="mx-auto max-w-6xl rounded-f-lg border border-dashed border-hairline p-f8 text-center">
            <p className="text-h3 text-ink-muted">No decks registered yet.</p>
            <p className="mt-f3 text-body text-ink-muted">
              Create an episode folder under{" "}
              <code className="rounded-f-sm bg-surface-raised px-f2 font-mono">src/episodes/</code>{" "}
              and call <code className="rounded-f-sm bg-surface-raised px-f2 font-mono">registerDeck()</code>.
            </p>
          </div>
        ) : (
          <ul className="mx-auto grid max-w-6xl gap-f5 [grid-template-columns:repeat(auto-fill,minmax(22rem,1fr))]" role="list">
            {decks.map((deck) => (
              <li key={deck.id}>
                <DeckCard deck={deck} />
              </li>
            ))}
          </ul>
        )}
      </main>

      {catalogOpen ? (
        <CatalogPicker
          onClose={() => setCatalogOpen(false)}
          onConfirm={(primitiveId, effectName) => {
            console.info("[catalog-picker] selected:", primitiveId, effectName);
            setCatalogOpen(false);
          }}
        />
      ) : null}
    </>
  );
}
