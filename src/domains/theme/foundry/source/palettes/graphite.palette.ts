/**
 * Graphite — warm neutral surface family. Alternative to `ink` for
 * properties that want a warmer dark ground (paper-lit, editorial).
 */
import type { PaletteSource } from "../../foundry.types";

export const graphitePalette: PaletteSource = {
  name: "graphite",
  kind: "surface",
  anchor: { l: 0.44, c: 0.012, h: 60 },
  curve: "neutral",
  chroma: "flat",
  overrides: {
    950: { l: 0.14, c: 0.010, h: 60 },
    975: { l: 0.11, c: 0.008, h: 60 },
  },
};
