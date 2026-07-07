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
    return { deck, index, step };
  },
  component: RuntimePage,
});

function RuntimePage() {
  const { deck, index, step } = Route.useRouteContext();
  return <DeckHost deck={deck} slideIndex={index} stepIndex={step} />;
}
