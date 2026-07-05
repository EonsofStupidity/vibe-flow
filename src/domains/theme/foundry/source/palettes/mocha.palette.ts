/**
 * Mocha — warm dark surface family. Cinema/lounge feel for AngryVibes.
 */
import type { PaletteSource } from "../../foundry.types";

export const mochaPalette: PaletteSource = {
  name: "mocha",
  kind: "surface",
  anchor: { l: 0.44, c: 0.020, h: 40 },
  curve: "neutral",
  chroma: "flat",
  overrides: {
    950: { l: 0.14, c: 0.016, h: 40 },
    975: { l: 0.11, c: 0.014, h: 40 },
  },
};
