/**
 * ep-000-template — the reference deck. Copy this folder to author real episodes.
 */
import type { Deck } from "@/domains/deck/types/deck.types";
import { registerDeck } from "@/domains/deck/services/deck-registry.service";
import { titleSlide } from "./slides/01-title.slide";
import { stillSlide } from "./slides/02-still.slide";
import { comparatorSlide } from "./slides/03-comparator.slide";

export const templateDeck: Deck = {
  id: "ep-000-template",
  title: "Episode 000 · Template",
  eyebrow: "Reference deck",
  summary: "Three canonical slide types wired to the runtime. Copy me.",
  slides: [titleSlide, stillSlide, comparatorSlide],
};

registerDeck(templateDeck);
