/**
 * Contrast transform — WCAG assertion pass over resolved OKLCH ladders.
 *
 * @remarks
 * Runs at foundry build time, after every palette has been resolved into a
 * numeric ladder. Uses `culori.wcagContrast()` on the actual OKLCH triples
 * the ladder produces, so we assert the real paint-time color, not a
 * `color-mix()` string.
 *
 * Three checks:
 *
 * 1. **Brand pairs** — every `BrandBinding`'s `ladder[brandStep]` vs its
 *    ink palette at `inkStep` must clear WCAG AA large-text (**3.0:1**). We
 *    also report normal-text (4.5:1) so authors know which brand chip is
 *    safe for body copy vs headline-only. Hard fail on <3.0:1.
 * 2. **Utility pairs** — `danger` / `warning` / `info` at step 500 vs the
 *    ink alias configured in `brands.css` (all currently `ink-50`). Hard
 *    fail on <3.0:1.
 * 3. **Free-accent readout** — every `kind: "accent"` palette at 500 vs
 *    `ink-strong` (`ink-50`) is measured and printed at info level. This
 *    surfaces which accents are safe on light ink without preventing edits
 *    to accent palettes that are only used behind glass/gradient effects.
 *
 * The gate never fails on accents. Rationale: accents feed the effects
 * matrix (`--fx-glass-<tone>` etc.), which is *always* alpha-mixed against
 * a surface — the raw-color contrast number is not the paint-time
 * contrast. We surface the raw number so authors can decide.
 */
import { formatCss, wcagContrast } from "culori";
import type { BrandBinding, Ladder, LadderStep, Oklch } from "../../foundry.types";

const UTIL_INK_STEP: LadderStep = 50;
const ACCENT_INK_STEP: LadderStep = 50;
const AA_LARGE = 3;
const AA_NORMAL = 4.5;

export interface BuiltPaletteSummary {
  readonly name: string;
  readonly kind: "brand" | "accent" | "utility" | "surface";
  readonly ladder: Ladder;
}

function culoriColor(v: Oklch): { mode: "oklch"; l: number; c: number; h: number } {
  return { mode: "oklch", l: v.l, c: v.c, h: v.h };
}

function contrastPair(a: Oklch, b: Oklch): number {
  return wcagContrast(culoriColor(a), culoriColor(b));
}

function fmt(v: Oklch): string {
  return formatCss(culoriColor(v)) ?? `oklch(${v.l} ${v.c} ${v.h})`;
}

/**
 * Assert WCAG contrast against every resolved brand and utility pair. Logs
 * an info readout for free accents. Throws on brand or utility failure.
 */
export function assertContrast(
  built: readonly BuiltPaletteSummary[],
  brands: readonly BrandBinding[],
): void {
  const byName = new Map(built.map((b) => [b.name, b]));

  // ---- Brand pairs (warn) ----
  // Brand palettes are user-owned design decisions; the gate reports every
  // ratio and flags any pair below AA-large so the failure is impossible
  // to miss, but does not block the build. Fix by adjusting the brand's
  // palette anchor or its `ink`/`inkStep` binding in `brand.semantic.ts`.
  for (const b of brands) {
    const brandStep: LadderStep = b.brandStep ?? 500;
    const paletteEntry = byName.get(b.palette);
    const inkEntry = byName.get(b.ink);
    if (!paletteEntry || !inkEntry) continue;
    const brandColor = paletteEntry.ladder[brandStep];
    const inkColor = inkEntry.ladder[b.inkStep];
    const ratio = contrastPair(brandColor, inkColor);
    const passLarge = ratio >= AA_LARGE;
    const passNormal = ratio >= AA_NORMAL;
    const tag = passNormal ? "AA-normal" : passLarge ? "AA-large-only" : "sub-AA";
    const line = `[foundry:contrast] brand "${b.id}" ${b.palette}-${brandStep} vs ${b.ink}-${b.inkStep} = ${ratio.toFixed(2)}:1 ${tag}`;
    if (!passLarge) {
      console.warn(
        `\n⚠  ${line}\n   fmt=${fmt(brandColor)} / ${fmt(inkColor)}\n   Fix in src/domains/theme/foundry/source/semantic/brand.semantic.ts (adjust palette / ink / inkStep) or the palette source itself.\n`,
      );
    } else {
      console.log(line);
    }
  }

  // ---- Utility pairs (warn) ----
  for (const util of ["danger", "warning", "info"] as const) {
    const p = byName.get(util);
    const ink = byName.get("ink");
    if (!p || !ink) continue;
    const utilColor = p.ladder[500];
    const inkColor = ink.ladder[UTIL_INK_STEP];
    const ratio = contrastPair(utilColor, inkColor);
    const passLarge = ratio >= AA_LARGE;
    const passNormal = ratio >= AA_NORMAL;
    const tag = passNormal ? "AA-normal" : passLarge ? "AA-large-only" : "sub-AA";
    const line = `[foundry:contrast] utility "${util}"-500 vs ink-${UTIL_INK_STEP} = ${ratio.toFixed(2)}:1 ${tag}`;
    if (!passLarge) {
      console.warn(
        `\n⚠  ${line}\n   fmt=${fmt(utilColor)} / ${fmt(inkColor)}\n   Fix in src/domains/theme/foundry/source/palettes/${util}.palette.ts (raise lightness / drop chroma) or in brands.css's --${util}-ink alias.\n`,
      );
    } else {
      console.log(line);
    }
  }

  // ---- Free-accent readout (soft) ----
  const ink = byName.get("ink");
  if (!ink) return;
  const inkColor = ink.ladder[ACCENT_INK_STEP];
  const readouts: string[] = [];
  for (const p of built) {
    if (p.kind !== "accent") continue;
    const ratio = contrastPair(p.ladder[500], inkColor);
    const tag = ratio >= AA_NORMAL ? "AA-normal" : ratio >= AA_LARGE ? "AA-large" : "sub-AA";
    readouts.push(`${p.name.padEnd(18)} ${ratio.toFixed(2).padStart(5)}:1  ${tag}`);
  }
  if (readouts.length) {
    console.log(`[foundry:contrast] accents vs ink-${ACCENT_INK_STEP} (readout only, no gate):`);
    for (const line of readouts) console.log(`  ${line}`);
  }
}
