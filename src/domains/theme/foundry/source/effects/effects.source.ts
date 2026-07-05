/**
 * Shadow effects. Emit a base ladder (neutral OKLCH-tinted) and brand
 * variants that recolor via `color-mix` on `--brand` — so brand switching
 * automatically re-tints depth.
 */
export interface EffectToken { readonly name: string; readonly value: string; }

export const shadowLadder: readonly EffectToken[] = [
  { name: "shadow-1", value: "0 0.0625rem 0.125rem 0 oklch(0.10 0.01 260 / 0.28)" },
  { name: "shadow-2", value: "0 0.125rem 0.375rem -0.0625rem oklch(0.10 0.01 260 / 0.34)" },
  { name: "shadow-3", value: "0 0.375rem 0.75rem -0.125rem oklch(0.10 0.01 260 / 0.40)" },
  { name: "shadow-4", value: "0 0.625rem 1.25rem -0.25rem oklch(0.10 0.01 260 / 0.46)" },
  { name: "shadow-5", value: "0 1rem 2rem -0.375rem oklch(0.10 0.01 260 / 0.52)" },
  { name: "shadow-6", value: "0 1.5rem 3rem -0.5rem oklch(0.10 0.01 260 / 0.58)" },
  { name: "shadow-7", value: "0 2rem 4rem -0.75rem oklch(0.10 0.01 260 / 0.64)" },
  { name: "shadow-8", value: "0 2.5rem 5rem -1rem oklch(0.10 0.01 260 / 0.70)" },
];

export const shadowBrandLadder: readonly EffectToken[] = [
  { name: "shadow-brand-1", value: "0 0.25rem 1rem -0.25rem color-mix(in oklch, var(--brand) 25%, transparent)" },
  { name: "shadow-brand-2", value: "0 0.5rem 1.5rem -0.375rem color-mix(in oklch, var(--brand) 35%, transparent)" },
  { name: "shadow-brand-3", value: "0 0.75rem 2rem -0.5rem color-mix(in oklch, var(--brand) 45%, transparent)" },
  { name: "shadow-brand-4", value: "0 1rem 3rem -0.625rem color-mix(in oklch, var(--brand) 55%, transparent)" },
];

export const blurLadder: readonly EffectToken[] = [
  { name: "blur-1", value: "0.125rem" },
  { name: "blur-2", value: "0.375rem" },
  { name: "blur-3", value: "0.75rem" },
  { name: "blur-4", value: "1.25rem" },
  { name: "blur-5", value: "2rem" },
  { name: "blur-6", value: "3rem" },
];

export const ringLadder: readonly EffectToken[] = [
  { name: "ring-1", value: "0.0625rem" },
  { name: "ring-2", value: "0.125rem" },
  { name: "ring-3", value: "0.1875rem" },
  { name: "ring-4", value: "0.25rem" },
];

export const glassPresets: readonly EffectToken[] = [
  { name: "glass-thin",   value: "blur(0.5rem) saturate(140%)" },
  { name: "glass-medium", value: "blur(1rem) saturate(160%)" },
  { name: "glass-thick",  value: "blur(1.75rem) saturate(180%)" },
];

/**
 * Noise textures — inline SVG turbulence baked into data-URLs.
 * `fine` is subtle grain for surfaces; `coarse` is heavier for hero panels.
 */
export const noisePresets: readonly EffectToken[] = [
  {
    name: "noise-fine",
    value: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0.15 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
  },
  {
    name: "noise-coarse",
    value: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.55' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0.28 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
  },
];
