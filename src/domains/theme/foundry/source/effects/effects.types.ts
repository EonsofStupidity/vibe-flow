/**
 * Effects matrix — types.
 *
 * @remarks
 * The effects matrix is a 2-D grid of CSS custom properties:
 *   - rows = tones (`neutral`, `brand`, semantic status, free accents)
 *   - cols = effect categories (`glass`, `edge`, `ring`, `glow`, `sheen`,
 *     `halo`, `text-shadow`, `background-bloom`, ...)
 *
 * Every emitted variable is `--fx-<category>-<tone>`. Components read the
 * matrix directly — they never re-declare per-domain shadow / glass / edge
 * variables. Adding a category = new file that appends a column across
 * every tone. Adding a tone = one line in `TONES` + palette entry.
 *
 * @public
 */

/** Canonical tone list. Order = emission order in CSS. */
export const TONE_NAMES = [
  "neutral",
  "brand",
  "info",
  "warning",
  "danger",
  "lime",
  "cyan",
  "magenta",
  "violet",
  "coral",
] as const;

export type ToneName = (typeof TONE_NAMES)[number];

/**
 * Tone binding — how a tone resolves to underlying semantic vars. `base`
 * feeds every category recipe; `ink` is the readable text/ink on the tone's
 * surface (WCAG contrast target enforced elsewhere).
 */
export interface ToneBinding {
  readonly name: ToneName;
  readonly base: string;
  readonly ink: string;
}

/**
 * Category recipe — given a tone binding, produce the CSS value for
 * `--fx-<name>-<tone>`. Recipes are pure — no reads outside the binding
 * plus the fixed semantic surface tokens they document below.
 */
export interface EffectCategory {
  readonly name: string;
  readonly recipe: (tone: ToneBinding) => string;
}

export interface MatrixCell {
  readonly name: string;
  readonly value: string;
}

export interface MatrixColumn {
  readonly category: string;
  readonly cells: readonly MatrixCell[];
}
