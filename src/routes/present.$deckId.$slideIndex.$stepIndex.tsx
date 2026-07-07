/**
 * Presenter/teleprompter route — /present/$deckId/$slideIndex/$stepIndex.
 */
import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import "../episodes";
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
    return { deckId: params.deckId, index, step };
  },
  component: PresentPage,
  errorComponent: PresentRouteError,
  notFoundComponent: PresentRouteNotFound,
});

function PresentPage() {
  const { deckId, index, step } = Route.useRouteContext();
  if (!getDeck(deckId)) throw notFound();
  return <PresenterHost deckId={deckId} slideIndex={index} stepIndex={step} />;
}

function PresentRouteError() {
  return (
    <main className="flex h-dvh w-dvw items-center justify-center bg-surface p-f6 text-ink">
      <div className="max-w-lg text-center">
        <h1 className="font-display text-h2 text-ink-strong">Presenter runtime failed.</h1>
        <p className="mt-f3 text-body text-ink-muted">Reload the presenter surface from the deck.</p>
      </div>
    </main>
  );
}

function PresentRouteNotFound() {
  return (
    <main className="flex h-dvh w-dvw items-center justify-center bg-surface p-f6 text-ink">
      <div className="max-w-lg text-center">
        <h1 className="font-display text-h2 text-ink-strong">Presenter deck not found.</h1>
        <p className="mt-f3 text-body text-ink-muted">That slide is not in the registered rundown.</p>
      </div>
    </main>
  );
}
