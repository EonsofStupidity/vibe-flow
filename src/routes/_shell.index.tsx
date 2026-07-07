/**
 * Deck picker — landing screen listing every registered deck.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { listDecks } from "@/domains/deck/services/deck-registry.service";

export const Route = createFileRoute("/_shell/")({
  component: DeckPicker,
});

function DeckPicker() {
  const decks = listDecks();
  return (
    <main className="min-h-dvh bg-surface px-f7 py-f8 text-ink">
      <header className="mx-auto mb-f8 max-w-6xl">
        <div className="font-mono text-eyebrow uppercase tracking-[0.3em] text-brand">
          Show runtime · local only
        </div>
        <h1 className="mt-f4 font-display text-display font-semibold leading-tight">
          DevPULSE Labs
        </h1>
        <p className="mt-f5 max-w-2xl text-h3 text-ink-muted">
          Pick a deck. Then use your fingers. Prev/next lives on the edges. Pinch
          to zoom stills. Tap the pen to draw. Tap the grid to jump.
        </p>
      </header>

      <ul className="mx-auto grid max-w-6xl gap-f5 [grid-template-columns:repeat(auto-fill,minmax(20rem,1fr))]">
        {decks.map((deck) => (
          <li key={deck.id}>
            <Link
              to="/deck/$deckId/$slideIndex/$stepIndex"
              params={{ deckId: deck.id, slideIndex: "0", stepIndex: "0" }}
              className="group flex h-full flex-col justify-between rounded-f-lg bg-surface-raised p-f6 transition hairline-b hover:bg-surface-overlay"
            >
              <div>
                {deck.eyebrow ? (
                  <div className="mb-f4 font-mono text-eyebrow uppercase tracking-[0.25em] text-brand">
                    {deck.eyebrow}
                  </div>
                ) : null}
                <h2 className="font-display text-h2 font-semibold text-ink-strong">
                  {deck.title}
                </h2>
                {deck.summary ? (
                  <p className="mt-f3 text-body text-ink-muted">{deck.summary}</p>
                ) : null}
              </div>
              <div className="mt-f7 flex items-center justify-between font-mono text-eyebrow uppercase tracking-[0.25em] text-ink-muted">
                <span>{deck.slides.length} slides</span>
                <span className="text-brand transition group-hover:translate-x-1">→ open</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
