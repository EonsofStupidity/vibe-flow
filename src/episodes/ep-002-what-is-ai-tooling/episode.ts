import type { Deck } from "@/domains/deck/types/deck.types";
import { registerDeck } from "@/domains/deck/services/deck-registry.service";
import { coverSlide } from "./slides/01-cover.slide";
import { agendaSlide } from "./slides/02-agenda.slide";
import { definitionSlide } from "./slides/03-definition.slide";
import { layersSlide } from "./slides/04-layers.slide";
import { promptIsCodeSlide } from "./slides/05-prompt-is-code.slide";
import { trapSlide } from "./slides/06-trap.slide";
import { yourMoveSlide } from "./slides/07-your-move.slide";

export const whatIsAiToolingDeck: Deck = {
  id: "ep-002-what-is-ai-tooling",
  title: "Episode 002 · What is AI Tooling?",
  eyebrow: "EoS",
  summary: "From autocomplete to agents — what AI tools actually do under the hood, and how to use them without getting played.",
  slides: [
    coverSlide,
    agendaSlide,
    definitionSlide,
    layersSlide,
    promptIsCodeSlide,
    trapSlide,
    yourMoveSlide,
  ],
};

registerDeck(whatIsAiToolingDeck);
