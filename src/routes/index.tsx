/**
 * Deck picker — landing screen listing every registered deck.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { listDecks } from "@/domains/deck/services/deck-registry.service";

export const Route = createFileRoute("/")({
  component: DeckPicker,
});

function DeckPicker() {
  const decks = listDecks();
  return (
    <main className="min-h-dvh bg-background px-8 py-16 text-foreground">
      <header className="mx-auto mb-16 max-w-6xl">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          Show runtime · local only
        </div>
        <h1 className="mt-4 font-display text-6xl font-semibold leading-tight md:text-7xl">
          Eons of Stupidity
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Pick a deck. Then use your fingers. Prev/next lives on the edges. Pinch
          to zoom stills. Tap the pen to draw. Tap the grid to jump.
        </p>
      </header>

      <ul className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {decks.map((deck) => (
          <li key={deck.id}>
            <Link
              to="/deck/$deckId/$slideIndex"
              params={{ deckId: deck.id, slideIndex: "0" }}
              className="group flex h-full flex-col justify-between rounded-2xl bg-panel p-8 transition hairline-b hover:bg-secondary"
            >
              <div>
                {deck.eyebrow ? (
                  <div className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-primary">
                    {deck.eyebrow}
                  </div>
                ) : null}
                <h2 className="font-display text-3xl font-semibold text-foreground">
                  {deck.title}
                </h2>
                {deck.summary ? (
                  <p className="mt-3 text-base text-muted-foreground">{deck.summary}</p>
                ) : null}
              </div>
              <div className="mt-10 flex items-center justify-between font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
                <span>{deck.slides.length} slides</span>
                <span className="text-primary group-hover:translate-x-1 transition">→ open</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
