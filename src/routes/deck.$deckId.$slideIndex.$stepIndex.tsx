/**
 * Runtime audience route — /deck/$deckId/$slideIndex/$stepIndex.
 *
 * @remarks
 * URL is the source of truth for both slide and reveal step. Invalid ids
 * throw notFound; out-of-range indices are clamped via a redirect so the
 * URL stays canonical.
 */
import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { DeckHost } from "@/domains/deck/components/deck-host/deck-host";
import { getDeck } from "@/domains/deck/services/deck-registry.service";
import { clampIndex, clampStep } from "@/domains/deck/services/deck-nav.service";

export const Route = createFileRoute("/deck/$deckId/$slideIndex/$stepIndex")({
  beforeLoad: ({ params }) => {
    const deck = getDeck(params.deckId);
    if (!deck) throw notFound();
    const rawIndex = Number.parseInt(params.slideIndex, 10);
    const rawStep = Number.parseInt(params.stepIndex, 10);
    const index = clampIndex(Number.isFinite(rawIndex) ? rawIndex : 0, deck.slides.length);
    const step = clampStep(Number.isFinite(rawStep) ? rawStep : 0, deck.slides[index]);
    if (String(index) !== params.slideIndex || String(step) !== params.stepIndex) {
      throw redirect({
        to: "/deck/$deckId/$slideIndex/$stepIndex",
        params: { deckId: params.deckId, slideIndex: String(index), stepIndex: String(step) },
        replace: true,
      });
    }
    return { deckId: params.deckId, index, step };
  },
  component: RuntimePage,
  errorComponent: DeckRouteError,
  notFoundComponent: DeckRouteNotFound,
});

function RuntimePage() {
  const { deckId, index, step } = Route.useRouteContext();
  const deck = getDeck(deckId);
  if (!deck) throw notFound();
  return <DeckHost deck={deck} slideIndex={index} stepIndex={step} />;
}

function DeckRouteError() {
  return (
    <main className="flex h-dvh w-dvw items-center justify-center bg-surface p-f6 text-ink">
      <div className="max-w-lg text-center">
        <h1 className="font-display text-h2 text-ink-strong">Deck runtime failed.</h1>
        <p className="mt-f3 text-body text-ink-muted">Reload the deck from the picker.</p>
      </div>
    </main>
  );
}

function DeckRouteNotFound() {
  return (
    <main className="flex h-dvh w-dvw items-center justify-center bg-surface p-f6 text-ink">
      <div className="max-w-lg text-center">
        <h1 className="font-display text-h2 text-ink-strong">Deck not found.</h1>
        <p className="mt-f3 text-body text-ink-muted">That slide is not in the registered rundown.</p>
      </div>
    </main>
  );
}
