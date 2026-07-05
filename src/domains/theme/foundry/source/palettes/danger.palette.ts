/**
 * Danger — utility. Destructive actions, critical errors.
 */
import type { PaletteSource } from "../../foundry.types";

export const dangerPalette: PaletteSource = {
  name: "danger",
  kind: "utility",
  anchor: { l: 0.62, c: 0.22, h: 25 },
  curve: "brand",
  chroma: "linear-to-500",
};
