/**
 * Catalog primitive registry — the authoritative list of available slide
 * primitives for the CatalogPicker UI.
 *
 * @remarks
 * Add an entry here when you ship a new primitive. Tags drive the search
 * filter. `preview` is a short descriptor shown in the card. Thumbnails
 * are generated at runtime from the preview render (future); for now
 * they use a solid-tone placeholder.
 */
import type { ToneName } from "@/domains/slide-catalog/primitives/types";
import type { SlideEffectName } from "@/domains/deck/types/effect.types";

export interface PrimitiveCatalogEntry {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly tags: readonly string[];
  /** Suggested default tone for picker preview. */
  readonly defaultTone: ToneName;
}

export interface EffectCatalogEntry {
  readonly name: SlideEffectName;
  readonly label: string;
  readonly description: string;
}

export const PRIMITIVE_CATALOG: readonly PrimitiveCatalogEntry[] = [
  {
    id: "title-card",
    label: "Title Card",
    description: "Episode or segment opener with eyebrow + headline",
    tags: ["layout", "opener"],
    defaultTone: "neutral",
  },
  {
    id: "bullets-list",
    label: "Bullets List",
    description: "Focusable bullet reveal with multi-select support",
    tags: ["text", "reveal", "interactive"],
    defaultTone: "cyan",
  },
  {
    id: "stats-grid",
    label: "Stats Grid",
    description: "Grid of large numeric stats with labels",
    tags: ["data", "numbers"],
    defaultTone: "lime",
  },
  {
    id: "callout-card",
    label: "Callout Card",
    description: "Emphasis card with icon, headline, and body",
    tags: ["text", "highlight"],
    defaultTone: "coral",
  },
  {
    id: "code-block",
    label: "Code Block",
    description: "Syntax-highlighted code with tone-driven UI",
    tags: ["code", "text"],
    defaultTone: "cyan",
  },
  {
    id: "media-hotspots",
    label: "Media Hotspots",
    description: "Image with interactive tap hotspots",
    tags: ["media", "interactive"],
    defaultTone: "magenta",
  },
  {
    id: "still-zoomable",
    label: "Still Zoomable",
    description: "Pinch-to-zoom static image",
    tags: ["media"],
    defaultTone: "neutral",
  },
  {
    id: "comparator-panel",
    label: "Comparator Panel",
    description: "Side-by-side A/B comparison",
    tags: ["layout", "media"],
    defaultTone: "neutral",
  },
  {
    id: "quote-block",
    label: "Quote Block",
    description: "Large pull-quote with attribution",
    tags: ["text", "highlight"],
    defaultTone: "violet",
  },
  {
    id: "timeline-rail",
    label: "Timeline Rail",
    description: "Ordered sequence with reveal-per-step",
    tags: ["layout", "reveal", "data"],
    defaultTone: "cyan",
  },
  {
    id: "split-layout",
    label: "Split Layout",
    description: "Two-column arbitrary content wrapper",
    tags: ["layout"],
    defaultTone: "neutral",
  },
  {
    id: "full-bleed-media",
    label: "Full Bleed Media",
    description: "Edge-to-edge image with gradient overlay",
    tags: ["media", "layout"],
    defaultTone: "neutral",
  },
  {
    id: "numbered-sequence",
    label: "Numbered Sequence",
    description: "Step-by-step process cards with reveal",
    tags: ["text", "reveal", "data"],
    defaultTone: "lime",
  },
  {
    id: "agenda-list",
    label: "Agenda List",
    description: "Chapter opener with dot-marker items, active highlight",
    tags: ["text", "layout", "reveal"],
    defaultTone: "brand",
  },
  {
    id: "key-value-grid",
    label: "Key Value Grid",
    description: "Two-column term/definition pairs, tone-driven",
    tags: ["data", "text"],
    defaultTone: "info",
  },
  {
    id: "terminal-output",
    label: "Terminal Output",
    description: "Styled prompt/stdout/stderr terminal block",
    tags: ["code", "text", "reveal"],
    defaultTone: "neutral",
  },
];

export const ALL_TAGS = Array.from(
  new Set(PRIMITIVE_CATALOG.flatMap((p) => p.tags)),
).sort();
