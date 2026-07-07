/**
 * ep-001-catalog-showcase — reference deck for the tone-driven content
 * primitives (`BulletsList`, `StatsGrid`, `CalloutCard`, `CodeBlock`,
 * `MediaHotspots`). One slide per primitive so tone / focus / press
 * regressions are visible immediately.
 */
import type { Deck } from "@/domains/deck/types/deck.types";
import { registerDeck } from "@/domains/deck/services/deck-registry.service";
import { bulletsSlide } from "./slides/01-bullets.slide";
import { statsSlide } from "./slides/02-stats.slide";
import { calloutSlide } from "./slides/03-callout.slide";
import { codeSlide } from "./slides/04-code.slide";
import { mediaSlide } from "./slides/05-media.slide";

export const catalogShowcaseDeck: Deck = {
  id: "ep-001-catalog-showcase",
  title: "Episode 001 · Catalog showcase",
  eyebrow: "Reference deck",
  summary: "One slide per tone-driven content primitive in the slide catalog.",
  slides: [bulletsSlide, statsSlide, calloutSlide, codeSlide, mediaSlide],
};

registerDeck(catalogShowcaseDeck);
