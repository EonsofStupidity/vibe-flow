/**
 * Runtime route — /deck/$deckId/$slideIndex renders one slide of one deck.
 */
import { createFileRoute, notFound } from "@tanstack/react-router";
import { DeckHost } from "@/domains/deck/components/deck-host/deck-host";
import { getDeck } from "@/domains/deck/services/deck-registry.service";

export const Route = createFileRoute("/deck/$deckId/$slideIndex")({
  component: RuntimePage,
});

function RuntimePage() {
  const { deckId, slideIndex } = Route.useParams();
  const deck = getDeck(deckId);
  if (!deck) throw notFound();
  const parsed = Number.parseInt(slideIndex, 10);
  const index = Number.isFinite(parsed) ? parsed : 0;
  return <DeckHost deck={deck} slideIndex={index} />;
}
