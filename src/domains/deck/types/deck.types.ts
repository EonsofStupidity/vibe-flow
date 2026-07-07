/**
 * Deck contract — a deck is an ordered, immutable list of slides.
 */
import type { SlideDefinition } from "./slide.types";

export interface DeckMeta {
  readonly id: string;
  readonly title: string;
  readonly eyebrow?: string;
  readonly summary?: string;
}

export interface Deck extends DeckMeta {
  readonly slides: ReadonlyArray<SlideDefinition>;
}
