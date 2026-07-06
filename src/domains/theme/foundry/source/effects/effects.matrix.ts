/**
 * Effects matrix — cross-product builder.
 *
 * @remarks
 * Each tone × category cell is a CSS custom property `--fx-<cat>-<tone>`
 * whose value is a `color-mix()` / `linear-gradient()` / `box-shadow`
 * recipe over the tone's semantic base var. Categories can be added by
 * appending to `CATEGORIES`; tones by appending to `TONES`. Nothing in
 * consuming components changes.
 *
 * @public
 */
import type {
  EffectCategory,
  MatrixColumn,
  ToneBinding,
} from "./effects.types";
import { TONE_NAMES } from "./effects.types";

/**
 * Tone → underlying semantic var. `neutral` is anchored to the app surface
 * layer so a neutral glass reads as "elevated surface", not "colored chip".
 */
export const TONES: readonly ToneBinding[] = [
  { name: "neutral", base: "var(--surface-overlay)", ink: "var(--ink-strong)" },
  { name: "brand",   base: "var(--brand)",           ink: "var(--brand-ink)" },
  { name: "info",    base: "var(--info)",            ink: "var(--ink-on-info)" },
  { name: "warning", base: "var(--warning)",         ink: "var(--ink-on-warning)" },
  { name: "danger",  base: "var(--danger)",          ink: "var(--ink-on-danger)" },
  { name: "lime",    base: "var(--accent-lime)",     ink: "var(--ink-strong)" },
  { name: "cyan",    base: "var(--accent-cyan)",     ink: "var(--ink-strong)" },
  { name: "magenta", base: "var(--accent-magenta)",  ink: "var(--ink-strong)" },
  { name: "violet",  base: "var(--accent-violet)",   ink: "var(--ink-strong)" },
  { name: "coral",   base: "var(--accent-coral)",    ink: "var(--ink-strong)" },
];

/**
 * Category recipes. Each one takes a tone binding and returns the CSS
 * value. The category `name` is the middle segment of the emitted var:
 * `glass` → `--fx-glass-<tone>`.
 */
export const CATEGORIES: readonly EffectCategory[] = [
  {
    name: "surface",
    recipe: (t) => t.base,
  },
  {
    name: "ink",
    recipe: (t) => t.ink,
  },
  {
    name: "glass",
    recipe: (t) =>
      t.name === "neutral"
        ? `color-mix(in oklch, ${t.base} 68%, transparent)`
        : `color-mix(in oklch, ${t.base} 34%, transparent)`,
  },
  {
    name: "glass-strong",
    recipe: (t) =>
      t.name === "neutral"
        ? `color-mix(in oklch, ${t.base} 82%, transparent)`
        : `color-mix(in oklch, ${t.base} 52%, transparent)`,
  },
  {
    name: "wash",
    recipe: (t) => `color-mix(in oklch, ${t.base} 16%, transparent)`,
  },
  {
    name: "edge",
    recipe: (t) =>
      t.name === "neutral"
        ? "color-mix(in oklch, var(--ink-strong) 18%, transparent)"
        : `color-mix(in oklch, ${t.base} 58%, var(--ink-strong) 12%)`,
  },
  {
    name: "ring",
    recipe: (t) => `color-mix(in oklch, ${t.base} 70%, transparent)`,
  },
  {
    name: "ring-strong",
    recipe: (t) => `color-mix(in oklch, ${t.base} 92%, transparent)`,
  },
  {
    name: "glow",
    recipe: (t) => `color-mix(in oklch, ${t.base} 42%, transparent)`,
  },
  {
    name: "glow-strong",
    recipe: (t) => `color-mix(in oklch, ${t.base} 64%, transparent)`,
  },
  {
    name: "sheen",
    recipe: (t) =>
      `linear-gradient(115deg in oklch, color-mix(in oklch, ${t.base} 28%, transparent) 0%, transparent 48%, color-mix(in oklch, var(--ink-strong) 10%, transparent) 100%)`,
  },
  {
    name: "sheen-diag",
    recipe: (t) =>
      `linear-gradient(135deg in oklch, color-mix(in oklch, var(--ink-strong) 24%, transparent) 0%, transparent 44%, color-mix(in oklch, ${t.base} 20%, transparent) 100%)`,
  },
  {
    name: "text-shadow",
    recipe: (t) =>
      `0 0 0.875rem color-mix(in oklch, ${t.base} 44%, transparent)`,
  },
  {
    name: "halo",
    recipe: (t) =>
      `0 0 0 0.0625rem color-mix(in oklch, ${t.base} 42%, transparent), 0 0.625rem 1.625rem -1rem color-mix(in oklch, ${t.base} 70%, transparent), inset 0 0.0625rem 0 color-mix(in oklch, var(--ink-strong) 14%, transparent)`,
  },
  {
    name: "halo-focus",
    recipe: (t) =>
      `0 0 0 0.125rem color-mix(in oklch, ${t.base} 62%, transparent), 0 0.875rem 2rem -1rem color-mix(in oklch, ${t.base} 78%, transparent), inset 0 0.0625rem 0 color-mix(in oklch, var(--ink-strong) 18%, transparent)`,
  },
  {
    name: "halo-active",
    recipe: (t) =>
      `inset 0 0 0 0.0625rem color-mix(in oklch, ${t.base} 34%, transparent), 0 0.5rem 1.25rem -1rem color-mix(in oklch, ${t.base} 60%, transparent)`,
  },
  {
    name: "shadow-pop",
    recipe: (t) =>
      `0 0.875rem 2.75rem -1.125rem color-mix(in oklch, ${t.base} 42%, transparent), 0 0.125rem 0.625rem -0.25rem color-mix(in oklch, var(--surface-deep) 70%, transparent), inset 0 0.0625rem 0 color-mix(in oklch, var(--ink-strong) 24%, transparent), inset 0 -0.0625rem 0 color-mix(in oklch, var(--surface-deep) 42%, transparent)`,
  },
  {
    name: "background-bloom",
    recipe: (t) =>
      `radial-gradient(60rem 40rem at 82% -10%, color-mix(in oklch, ${t.base} 22%, transparent) 0%, transparent 60%), radial-gradient(48rem 32rem at -10% 110%, color-mix(in oklch, ${t.base} 14%, transparent) 0%, transparent 55%)`,
  },
];

/**
 * Build the full matrix as a list of columns (one per category). Each
 * column carries every tone's cell in stable order, so the emitted CSS
 * groups by category for readability.
 */
export function buildEffectsMatrix(): readonly MatrixColumn[] {
  return CATEGORIES.map((cat): MatrixColumn => ({
    category: cat.name,
    cells: TONES.map((tone) => ({
      name: `fx-${cat.name}-${tone.name}`,
      value: cat.recipe(tone),
    })),
  }));
}

/**
 * Type-side re-export so consumers importing the matrix don't need to also
 * import from `effects.types.ts`.
 */
export { TONE_NAMES };
export type { ToneName } from "./effects.types";
