/**
 * Brand bindings — one entry per registered `data-brand`. Determines which
 * palette drives `--brand`, `--brand-*`, `--brand-alt*`, `--surface-*`,
 * `--brand-ink` and `--focus-ring` when that brand is active.
 */
import type { BrandBinding } from "../../foundry.types";

export const brandBindings: readonly BrandBinding[] = [
  {
    id: "eos",
    palette: "amber",
    paletteAlt: "amber-ember",
    surface: "mocha",
    surfaceInverse: "amber",
    ink: "ink",
    inkStep: 900,
    gradientHero: "amber-aurora",
  },
  {
    id: "news",
    palette: "cyan",
    paletteAlt: "cyan-ice",
    surface: "slate",
    surfaceInverse: "cyan",
    ink: "ink",
    inkStep: 900,
    gradientHero: "cyan-aurora",
  },
  {
    id: "vibes",
    palette: "magenta",
    paletteAlt: "magenta-orchid",
    surface: "ink",
    surfaceInverse: "magenta",
    ink: "ink",
    inkStep: 50,
    gradientHero: "magenta-aurora",
  },
];

/** The brand that ships as the default (`:root` values in brands.css). */
export const defaultBrandId = "eos";
