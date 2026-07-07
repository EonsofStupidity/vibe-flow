/**
 * Deck contract — a deck is an ordered, immutable list of slides.
 */
import type { SlideDefinition } from "./slide.types";
import type { SlideEffect } from "./effect.types";

export interface DeckMeta {
  readonly id: string;
  readonly title: string;
  readonly eyebrow?: string;
  readonly summary?: string;
  /** Cover image path (relative to episode assets/) — used by the picker UI. */
  readonly cover?: string;
  /** Deck-wide default slide transition. Slides may override with their own `effect`. */
  readonly defaultEffect?: SlideEffect;
}

export interface Deck extends DeckMeta {
  readonly slides: ReadonlyArray<SlideDefinition>;
}
