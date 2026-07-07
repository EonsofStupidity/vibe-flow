import type { Deck } from "@/domains/deck/types/deck.types";
import { registerDeck } from "@/domains/deck/services/deck-registry.service";
import { bulletsSlide } from "./slides/01-bullets.slide";
import { statsSlide } from "./slides/02-stats.slide";
import { calloutSlide } from "./slides/03-callout.slide";
import { codeSlide } from "./slides/04-code.slide";
import { mediaSlide } from "./slides/05-media.slide";
import { quoteSlide } from "./slides/06-quote.slide";
import { timelineSlide } from "./slides/07-timeline.slide";
import { splitSlide } from "./slides/08-split.slide";
import { fullBleedSlide } from "./slides/09-full-bleed.slide";
import { sequenceSlide } from "./slides/10-sequence.slide";
import { agendaSlide } from "./slides/11-agenda.slide";
import { kvGridSlide } from "./slides/12-kv-grid.slide";
import { terminalSlide } from "./slides/13-terminal.slide";

export const catalogShowcaseDeck: Deck = {
  id: "ep-001-catalog-showcase",
  title: "Episode 001 · Catalog Showcase",
  eyebrow: "Reference deck",
  summary: "One slide per tone-driven content primitive. Use this as the living style guide for the entire catalog.",
  slides: [
    bulletsSlide,
    statsSlide,
    calloutSlide,
    codeSlide,
    mediaSlide,
    quoteSlide,
    timelineSlide,
    splitSlide,
    fullBleedSlide,
    sequenceSlide,
    agendaSlide,
    kvGridSlide,
    terminalSlide,
  ],
};

registerDeck(catalogShowcaseDeck);
