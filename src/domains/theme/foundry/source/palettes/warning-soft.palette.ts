/** Warning-soft — low-chroma sibling of warning for tinted fills. */
import type { PaletteSource } from "../../foundry.types";
export const warningSoftPalette: PaletteSource = {
  name: "warning-soft", kind: "utility",
  anchor: { l: 0.78, c: 0.08, h: 65 },
  curve: "muted", chroma: "soft",
};
