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
 * The 11 canonical ladder steps. Matches Tailwind/Radix cadence so tooling
 * and muscle memory carry over.
 */
export type LadderStep =
  | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

export const LADDER_STEPS: readonly LadderStep[] = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const;

/**
 * Target lightness per step for each curve. Curves are perceptual —
 * lower steps are lighter, 500 is the anchor, higher steps are darker.
 */
export type LadderCurve = "perceptual" | "brand" | "neutral" | "muted";

/**
 * Chroma modulation across the ladder. `linear-to-500` peaks chroma near
 * the mid-tone and decays at the extremes (Radix-style). `flat` keeps the
 * anchor chroma; `soft` halves it at ends.
 */
export type ChromaCurve = "linear-to-500" | "flat" | "soft";

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

/** Brand semantic slot bindings — one per registered brand. */
export interface BrandBinding {
  readonly id: string;               // "eos" | "news" | "vibes"
  readonly palette: string;          // palette name to bind
  readonly ink: string;              // palette name to source ink from
  readonly inkStep: LadderStep;      // step to use for ink
  readonly brandStep?: LadderStep;   // default 500
  readonly strongStep?: LadderStep;  // default 400
  readonly softStep?: LadderStep;    // default 200
}
