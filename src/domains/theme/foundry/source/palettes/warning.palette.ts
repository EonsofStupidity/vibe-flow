/**
 * Warning — utility. Warm amber, distinct from brand amber (lower chroma,
 * shifted hue) so warnings don't blend into EoS brand chrome.
 */
import type { PaletteSource } from "../../foundry.types";

export const warningPalette: PaletteSource = {
  name: "warning",
  kind: "utility",
  anchor: { l: 0.74, c: 0.15, h: 65 },
  curve: "brand",
  chroma: "linear-to-500",
};
