/**
 * Token foundry — typed source-of-truth shapes.
 *
 * @remarks
 * The foundry generates CSS + TS token files at build time from these
 * typed sources. Never edit generated files by hand — edit the palette
 * source, run `bun run tokens`. See `src/domains/theme/foundry/readme.md`
 * for the pipeline architecture.
 */

/** OKLCH triple. `l` in [0..1], `c` in [0..0.4], `h` in [0..360]. */
export interface Oklch {
  readonly l: number;
  readonly c: number;
  readonly h: number;
}

/**
 * The 13 canonical ladder steps. `25` and `975` extend the standard
 * Tailwind cadence to give room for glassy highlights and deep shadows
 * without ever landing on pure white / pure black.
 */
export type LadderStep =
  | 25 | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 | 975;

export const LADDER_STEPS: readonly LadderStep[] = [
  25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 975,
] as const;

/**
 * Target lightness per step for each curve.
 *
 * - `perceptual` / `brand`  — standard OKLCH ramp for saturated hues.
 * - `neutral`               — high-range ramp used by surface palettes.
 * - `muted`                 — compressed for low-key backgrounds.
 * - `high-contrast`         — steeper delta at extremes for maximum pop.
 * - `low-key`               — dim/moody, holds low L for cinema surfaces.
 * - `luminous`              — holds L high through 600 for neon vibes.
 */
export type LadderCurve =
  | "perceptual"
  | "brand"
  | "neutral"
  | "muted"
  | "high-contrast"
  | "low-key"
  | "luminous";

/**
 * Chroma modulation across the ladder.
 *
 * - `linear-to-500` — peaks near the mid-tone, decays at extremes (Radix-style).
 * - `flat`          — anchor chroma held across the ramp.
 * - `soft`          — halves chroma at the ends.
 * - `peak-at-400`   — peak moved lighter, drops at 600+.
 * - `peak-at-600`   — peak moved darker, rises through 700.
 * - `bloom`         — chroma rises with lightness (aurora/glass looks).
 */
export type ChromaCurve =
  | "linear-to-500"
  | "flat"
  | "soft"
  | "peak-at-400"
  | "peak-at-600"
  | "bloom";

/** A single named palette. Anchor lives at step 500. */
export interface PaletteSource {
  readonly name: string;
  readonly kind: "brand" | "accent" | "utility" | "surface";
  readonly anchor: Oklch;
  readonly curve: LadderCurve;
  readonly chroma: ChromaCurve;
  /**
   * Optional per-step overrides if the generated ramp needs surgical
   * adjustment. Rarely used — prefer curve/anchor changes first.
   */
  readonly overrides?: Partial<Record<LadderStep, Partial<Oklch>>>;
}

/** A resolved ramp: every step mapped to a concrete OKLCH color. */
export type Ladder = Record<LadderStep, Oklch>;

/**
 * Brand semantic slot bindings — one per registered brand.
 *
 * @remarks
 * `surface`/`surfaceInverse` let each brand sit on a different surface
 * neutral (ink/graphite/slate/mocha) so properties look distinct without
 * any component code caring. `paletteAlt` exposes a sibling brand palette
 * for variant slots (`--brand-alt`, `--brand-alt-strong`).
 */
export interface BrandBinding {
  readonly id: string;
  readonly palette: string;
  readonly paletteAlt?: string;
  readonly surface: string;
  readonly surfaceInverse: string;
  readonly ink: string;
  readonly inkStep: LadderStep;
  readonly brandStep?: LadderStep;
  readonly strongStep?: LadderStep;
  readonly softStep?: LadderStep;
  readonly fontDisplay?: string;
  readonly gradientHero?: string;
}

/** Legal two-palette gradient pairing — emits `--gradient-<a>-<b>-mesh`. */
export interface GradientPairing {
  readonly a: string;
  readonly b: string;
  readonly c?: string;
}
