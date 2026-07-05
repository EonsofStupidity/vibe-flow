/**
 * Token foundry build entry.
 *
 * @remarks
 * Reads typed palette sources + brand bindings and emits:
 *   - src/domains/theme/tokens/primitives.css  (raw ladders, gradients, sizes)
 *   - src/domains/theme/tokens/brands.css       (per-brand semantic overrides + accents)
 *   - src/domains/theme/foundry/foundry.tokens.ts (typed runtime lookup)
 *
 * `semantics.css` is authored by hand (role bindings, motion, fonts, radii)
 * and is NOT overwritten. Palette-derived defaults for the default brand
 * still land in `:root` inside `brands.css`.
 *
 * Run with: `bun run tokens`
 */
import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { palettes } from "../source/palettes";
import { brandBindings, defaultBrandId } from "../source/semantic/brand.semantic";
import { LADDER_STEPS, type Ladder, type LadderStep } from "../foundry.types";
import { buildLadder, oklchString } from "./transforms/oklch-ladder.transform";
import { buildGradients, type GradientToken } from "./transforms/gradient.transform";

const HERE = dirname(fileURLToPath(import.meta.url));
const TOKENS_DIR = resolve(HERE, "../../tokens");
const FOUNDRY_DIR = resolve(HERE, "..");

const HEADER = `/**
 * GENERATED FILE — do not edit by hand.
 * Source: src/domains/theme/foundry/source/**  →  bun run tokens
 */\n\n`;

interface BuiltPalette {
  readonly name: string;
  readonly kind: "brand" | "accent" | "utility" | "surface";
  readonly ladder: Ladder;
  readonly gradients: readonly GradientToken[];
}

function build(): void {
  const built: BuiltPalette[] = palettes.map((p) => ({
    name: p.name,
    kind: p.kind,
    ladder: buildLadder(p),
    gradients: p.kind === "brand" || p.kind === "accent"
      ? buildGradients(p.name, buildLadder(p))
      : [],
  }));

  writePrimitivesCss(built);
  writeBrandsCss(built);
  writeFoundryTokensTs(built);

  const paletteCount = built.length;
  const gradientCount = built.reduce((n, p) => n + p.gradients.length, 0);
  const stepCount = paletteCount * LADDER_STEPS.length;
  console.log(
    `[foundry] wrote ${paletteCount} palettes, ${stepCount} steps, ${gradientCount} gradients`,
  );
}

function writePrimitivesCss(built: readonly BuiltPalette[]): void {
  const lines: string[] = [
    "/**",
    " * Layer 1 — primitive tokens. Raw material only, no semantic meaning.",
    " * Components must NEVER read from this layer directly — go through semantics.css.",
    " */",
    "",
    ":root {",
  ];

  for (const p of built) {
    lines.push(`  /* ---- ${p.name} (${p.kind}) ---- */`);
    for (const step of LADDER_STEPS) {
      lines.push(`  --${p.name}-${step}: ${oklchString(p.ladder[step])};`);
    }
    for (const g of p.gradients) {
      lines.push(`  --gradient-${g.name}: ${g.value};`);
    }
    lines.push("");
  }

  lines.push("  /* ---- Raw sizes (rem) ---- */");
  const sizes: Array<[string, string]> = [
    ["size-1", "0.25rem"], ["size-2", "0.5rem"], ["size-3", "0.75rem"],
    ["size-4", "1rem"], ["size-5", "1.25rem"], ["size-6", "1.5rem"],
    ["size-7", "2rem"], ["size-8", "3rem"], ["size-9", "4rem"],
    ["size-10", "5rem"], ["size-12", "6rem"], ["size-16", "8rem"],
  ];
  for (const [name, val] of sizes) lines.push(`  --${name}: ${val};`);
  lines.push("");
  lines.push("  /* Touchscreen minimum tap target — 4rem = 64px @ 16px root. */");
  lines.push("  --tap-min: 4rem;");
  lines.push("");
  lines.push("  /* Shell layout — rail widths (rem) */");
  lines.push("  --rail-collapsed: 4rem;");
  lines.push("  --rail-expanded: 8.4375rem;"); // 135px @ 16px root
  lines.push("  --panel-width: 24rem;");
  lines.push("}\n");

  writeFileSync(resolve(TOKENS_DIR, "primitives.css"), HEADER + lines.join("\n"));
}

function writeBrandsCss(built: readonly BuiltPalette[]): void {
  const byName = new Map(built.map((b) => [b.name, b]));
  const lines: string[] = [
    "/**",
    "",
    "/**",
    " * Layer 3 — brand overrides + free accent tones.",
    " * Set data-brand=\"<id>\" on <html> (or any ancestor) to swap active brand.",
    " */",
    "",
  ];

  for (const b of brandBindings) {
    const brandStep = b.brandStep ?? 500;
    const strongStep = b.strongStep ?? 400;
    const softStep = b.softStep ?? 200;
    const selector = b.id === defaultBrandId
      ? `:root, [data-brand="${b.id}"]`
      : `[data-brand="${b.id}"]`;
    lines.push(`${selector} {`);
    lines.push(`  --brand:        var(--${b.palette}-${brandStep});`);
    lines.push(`  --brand-strong: var(--${b.palette}-${strongStep});`);
    lines.push(`  --brand-soft:   var(--${b.palette}-${softStep});`);
    lines.push(`  --brand-ink:    var(--${b.ink}-${b.inkStep});`);
    lines.push(`  --focus-ring:   var(--${b.palette}-${brandStep});`);
    lines.push("}\n");
  }

  // Free accent slots — every accent palette exposed at :root
  lines.push("/* Free accents — always available regardless of active brand. */");
  lines.push(":root {");
  for (const b of built) {
    if (b.kind === "accent" || b.kind === "brand") {
      lines.push(`  --accent-${b.name}: var(--${b.name}-500);`);
    }
  }
  lines.push("}\n");

  // Utility semantic aliases
  lines.push("/* Utility semantic aliases (danger/warning/info). */");
  lines.push(":root {");
  if (byName.has("danger")) {
    lines.push("  --danger:     var(--danger-500);");
    lines.push("  --danger-ink: var(--ink-50);");
  }
  if (byName.has("warning")) {
    lines.push("  --warning:     var(--warning-500);");
    lines.push("  --warning-ink: var(--ink-900);");
  }
  if (byName.has("info")) {
    lines.push("  --info:     var(--info-500);");
    lines.push("  --info-ink: var(--ink-50);");
  }
  lines.push("}\n");

  writeFileSync(resolve(TOKENS_DIR, "brands.css"), HEADER + lines.join("\n"));
}

function writeFoundryTokensTs(built: readonly BuiltPalette[]): void {
  const lines: string[] = [
    "/**",
    "",
    "/**",
    " * Typed token lookup for runtime code. Every entry resolves to a",
    " * `var(...)` reference, not a literal color — so brand switching still",
    " * works when consumed inline (e.g. as an SVG stroke or canvas fill).",
    " */",
    "",
  ];

  const palObj: string[] = [];
  for (const p of built) {
    palObj.push(`  ${p.name}: {`);
    for (const step of LADDER_STEPS) {
      palObj.push(`    ${step}: "var(--${p.name}-${step})",`);
    }
    palObj.push("  },");
  }

  const gradObj: string[] = [];
  for (const p of built) {
    for (const g of p.gradients) {
      gradObj.push(`  "${g.name}": "var(--gradient-${g.name})",`);
    }
  }

  const brandObj: string[] = [];
  for (const b of brandBindings) {
    brandObj.push(`  ${b.id}: "${b.id}",`);
  }

  lines.push("export const palette = {");
  lines.push(palObj.join("\n"));
  lines.push("} as const;\n");

  lines.push("export const gradient = {");
  lines.push(gradObj.join("\n"));
  lines.push("} as const;\n");

  lines.push("export const brands = {");
  lines.push(brandObj.join("\n"));
  lines.push("} as const;\n");

  lines.push("export type BrandId = keyof typeof brands;");
  lines.push("export type PaletteName = keyof typeof palette;");

  writeFileSync(resolve(FOUNDRY_DIR, "foundry.tokens.ts"), HEADER + lines.join("\n"));
}

build();
