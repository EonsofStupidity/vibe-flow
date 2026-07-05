/**
 * Slate — cool blue-leaning surface family. Broadcast/News chrome.
 */
import type { PaletteSource } from "../../foundry.types";

export const slatePalette: PaletteSource = {
  name: "slate",
  kind: "surface",
  anchor: { l: 0.44, c: 0.018, h: 245 },
  curve: "neutral",
  chroma: "flat",
  overrides: {
    950: { l: 0.13, c: 0.014, h: 245 },
    975: { l: 0.11, c: 0.012, h: 245 },
  },
};
