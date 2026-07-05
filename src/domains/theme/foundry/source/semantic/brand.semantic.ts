/**
 * Brand bindings — one entry per registered `data-brand`. Determines which
 * palette drives `--brand`, `--brand-strong`, `--brand-soft`, `--brand-ink`
 * and `--focus-ring` when that brand is active.
 */
import type { BrandBinding } from "../../foundry.types";

export const brandBindings: readonly BrandBinding[] = [
  {
    id: "eos",
    palette: "amber",
    ink: "ink",
    inkStep: 900,
  },
  {
    id: "news",
    palette: "cyan",
    ink: "ink",
    inkStep: 900,
  },
  {
    id: "vibes",
    palette: "magenta",
    ink: "ink",
    inkStep: 50,
  },
];

/** The brand that ships as the default (`:root` values in semantics.css). */
export const defaultBrandId = "eos";
