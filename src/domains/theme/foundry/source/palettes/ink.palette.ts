/**
 * Ink — near-black surface family. Bottom step is soft blue-black, never #000.
 * Used for `--surface-*`, `--ink-inverse`, and the neutral backbone.
 */
import type { PaletteSource } from "../../foundry.types";

export const inkPalette: PaletteSource = {
  name: "ink",
  kind: "surface",
  anchor: { l: 0.44, c: 0.014, h: 260 },
  curve: "neutral",
  chroma: "flat",
  overrides: {
    950: { l: 0.14, c: 0.012, h: 260 }, // deepest — soft blue-black, never pure black
  },
};
