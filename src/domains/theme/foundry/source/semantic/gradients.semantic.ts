/**
 * Legal multi-palette gradient pairings. The generator only emits meshes
 * for pairs listed here — prevents N² explosion.
 */
import type { GradientPairing } from "../../foundry.types";

export const gradientPairings: readonly GradientPairing[] = [
  { a: "amber", b: "magenta" },
  { a: "amber", b: "crimson" },
  { a: "cyan", b: "violet" },
  { a: "cyan", b: "indigo" },
  { a: "magenta", b: "violet" },
  { a: "magenta", b: "fuchsia" },
  { a: "emerald", b: "cyan" },
  { a: "orange", b: "crimson" },
  { a: "amber", b: "magenta", c: "cyan" },
  { a: "cyan", b: "violet", c: "magenta" },
  { a: "emerald", b: "cyan", c: "azure" },
  // Expanded primaries
  { a: "viridian", b: "cerulean" },
  { a: "vermilion", b: "saffron" },
  { a: "electric", b: "lavender" },
  { a: "midnight", b: "cerulean" },
  { a: "sage", b: "porcelain" },
  { a: "oxblood", b: "terracotta" },
  { a: "mint", b: "cerulean", c: "electric" },
];
