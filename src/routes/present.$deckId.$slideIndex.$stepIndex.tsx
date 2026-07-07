/**
 * Presenter/teleprompter route — /present/$deckId/$slideIndex/$stepIndex.
 */
import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { PresenterHost } from "@/domains/deck/components/presenter-host/presenter-host";
import { getDeck } from "@/domains/deck/services/deck-registry.service";
import { clampIndex, clampStep } from "@/domains/deck/services/deck-nav.service";

export const Route = createFileRoute("/present/$deckId/$slideIndex/$stepIndex")({
  beforeLoad: ({ params }) => {
    const deck = getDeck(params.deckId);
    if (!deck) throw notFound();
    const rawIndex = Number.parseInt(params.slideIndex, 10);
    const rawStep = Number.parseInt(params.stepIndex, 10);
    const index = clampIndex(Number.isFinite(rawIndex) ? rawIndex : 0, deck.slides.length);
    const step = clampStep(Number.isFinite(rawStep) ? rawStep : 0, deck.slides[index]);
    if (String(index) !== params.slideIndex || String(step) !== params.stepIndex) {
      throw redirect({
        to: "/present/$deckId/$slideIndex/$stepIndex",
        params: { deckId: params.deckId, slideIndex: String(index), stepIndex: String(step) },
        replace: true,
      });
    }
    return { deck, index, step };
  },
  component: PresentPage,
});

function PresentPage() {
  const { deck, index, step } = Route.useRouteContext();
  return <PresenterHost deck={deck} slideIndex={index} stepIndex={step} />;
}
