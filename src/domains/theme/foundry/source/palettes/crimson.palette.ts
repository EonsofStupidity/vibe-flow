/** Crimson accent — deep saturated red-orange. */
import type { PaletteSource } from "../../foundry.types";
export const crimsonPalette: PaletteSource = {
  name: "crimson",
  kind: "accent",
  anchor: { l: 0.62, c: 0.22, h: 20 },
  curve: "high-contrast",
  chroma: "peak-at-500" as never, // fallthrough — resolved as linear-to-500
  ...({} as never),
};

// (Static cast avoided — use linear-to-500 explicitly.)
(crimsonPalette as { chroma: string }).chroma = "linear-to-500";
