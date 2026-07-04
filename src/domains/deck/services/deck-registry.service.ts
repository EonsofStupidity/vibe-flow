/**
 * Deck registry — a process-local map of registered decks.
 *
 * @remarks
 * Episodes self-register at import time via registerDeck(). The runtime
 * looks decks up by id. This is not persisted; the app is local-only.
 */
import type { Deck } from "../types/deck.types";

const decks = new Map<string, Deck>();

export function registerDeck(deck: Deck): void {
  if (decks.has(deck.id)) {
    console.warn(`[deck-registry] duplicate deck id: ${deck.id}`);
  }
  decks.set(deck.id, deck);
}

export function getDeck(id: string): Deck | undefined {
  return decks.get(id);
}

export function listDecks(): ReadonlyArray<Deck> {
  return Array.from(decks.values());
}
