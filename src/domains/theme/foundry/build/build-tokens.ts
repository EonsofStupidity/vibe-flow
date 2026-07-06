/**
 * Token foundry build entry.
 *
 * @remarks
 * Reads typed palette + effect + semantic sources and emits:
 *   - src/domains/theme/tokens/primitives.css  (ladders, gradients, meshes, shadows, blurs, rings, glass, noise, sizes, radii, ratios, type ramp, motion)
 *   - src/domains/theme/tokens/brands.css       (per-brand semantic overrides + accents)
 *   - src/domains/theme/foundry/foundry.tokens.ts (typed runtime lookup)
 *
 * `semantics.css` is authored by hand (role bindings, font stacks) and is
 * NOT overwritten. Palette-derived defaults for the default brand still
 * land in `:root` inside `brands.css`.
 *
 * Run with: `bun run tokens`
 */
import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { palettes } from "../source/palettes";
import { brandBindings, defaultBrandId } from "../source/semantic/brand.semantic";
import { gradientPairings } from "../source/semantic/gradients.semantic";
import { spaceRamp, radiusRamp, ratioRamp } from "../source/semantic/space.semantic";
import { durations, easings, transitions } from "../source/semantic/motion.semantic";
import {
  shadowLadder, shadowBrandLadder, blurLadder, ringLadder,
  glassPresets, noisePresets,
} from "../source/effects/effects.source";
import { buildEffectsMatrix } from "../source/effects/effects.matrix";
import { LADDER_STEPS, type Ladder, type LadderStep } from "../foundry.types";
import { buildLadder, oklchString } from "./transforms/oklch-ladder.transform";
import { buildGradients, buildMeshes, type GradientToken } from "./transforms/gradient.transform";
import { fluidGroups } from "./transforms/fluid.transform";
import { assertContrast, type BuiltPaletteSummary } from "./transforms/contrast.transform";
import { TONES, CATEGORIES } from "../source/effects/effects.matrix";

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

function validate(built: readonly BuiltPalette[]): void {
  const names = new Set<string>();
  for (const p of built) {
    if (names.has(p.name)) throw new Error(`[foundry] duplicate palette name: ${p.name}`);
    names.add(p.name);
  }
  for (const b of brandBindings) {
    for (const n of [b.palette, b.paletteAlt, b.surface, b.surfaceInverse, b.ink].filter(Boolean) as string[]) {
      if (!names.has(n)) throw new Error(`[foundry] brand "${b.id}" references unknown palette: ${n}`);
    }
  }
  for (const g of gradientPairings) {
    for (const n of [g.a, g.b, g.c].filter(Boolean) as string[]) {
      if (!names.has(n)) throw new Error(`[foundry] gradient pairing references unknown palette: ${n}`);
    }
  }
}

function build(): void {
  const built: BuiltPalette[] = palettes.map((p) => {
    const ladder = buildLadder(p);
    return {
      name: p.name,
      kind: p.kind,
      ladder,
      gradients: p.kind === "brand" || p.kind === "accent"
        ? buildGradients(p.name, ladder)
        : [],
    };
  });

  validate(built);

  const summaries: BuiltPaletteSummary[] = built.map((b) => ({
    name: b.name,
    kind: b.kind,
    ladder: b.ladder,
  }));
  assertContrast(summaries, brandBindings);

  const ladderMap = new Map(built.map((b) => [b.name, b.ladder]));
  const meshes = buildMeshes(gradientPairings, ladderMap);

  writePrimitivesCss(built, meshes);
  writeEffectsCss();
  writeBrandsCss(built);
  writeFoundryTokensTs(built, meshes);
  writeFoundryReadme();

  const gradientCount = built.reduce((n, p) => n + p.gradients.length, 0) + meshes.length;
  const stepCount = built.length * LADDER_STEPS.length;
  console.log(
    `[foundry] wrote ${built.length} palettes, ${stepCount} steps, ${gradientCount} gradients, ${brandBindings.length} brands`,
  );
}

/**
 * Rewrite the "Effects matrix" section of `foundry/readme.md` in place, so
 * the tone × category grid always matches the compiled matrix. The section
 * is delimited by fenced markers and no other prose is touched.
 */
function writeFoundryReadme(): void {
  const readmePath = resolve(FOUNDRY_DIR, "readme.md");
  const startMark = "<!-- effects-matrix:start -->";
  const endMark = "<!-- effects-matrix:end -->";
  const header = ["tone", ...CATEGORIES.map((c) => c.name)];
  const rows: string[][] = TONES.map((t) => [
    t.name,
    ...CATEGORIES.map((c) => `\`--fx-${c.name}-${t.name}\``),
  ]);
  const table = [
    `| ${header.join(" | ")} |`,
    `| ${header.map(() => "---").join(" | ")} |`,
    ...rows.map((r) => `| ${r.join(" | ")} |`),
  ].join("\n");

  const body = [
    "",
    "## Effects matrix",
    "",
    `Auto-generated from \`source/effects/effects.matrix.ts\` (${TONES.length} tones × ${CATEGORIES.length} categories = ${TONES.length * CATEGORIES.length} cells). Do not edit by hand — run \`bun run tokens\`.`,
    "",
    table,
    "",
  ].join("\n");

  let readme = "";
  try {
    readme = require("node:fs").readFileSync(readmePath, "utf8") as string;
  } catch {
    readme = "";
  }
  const startIdx = readme.indexOf(startMark);
  const endIdx = readme.indexOf(endMark);
  const block = `${startMark}${body}${endMark}`;
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    readme = `${readme.slice(0, startIdx)}${block}${readme.slice(endIdx + endMark.length)}`;
  } else {
    readme = `${readme.trimEnd()}\n\n${block}\n`;
  }
  writeFileSync(readmePath, readme);
}

/**
 * Emit `src/domains/theme/tokens/effects.css` — the tone × category matrix.
 * One `:root` block per category so a diff shows exactly which column
 * changed when a recipe is edited.
 */
function writeEffectsCss(): void {
  const matrix = buildEffectsMatrix();
  const lines: string[] = [
    "/**",
    " * Layer 2a — effects matrix (tone × category).",
    " *",
    " * Every cell is `--fx-<category>-<tone>`. Components read from here",
    " * directly — never re-declare per-domain shadow / glass / edge vars.",
    " * See src/domains/theme/foundry/source/effects/effects.matrix.ts for",
    " * the recipes; add a category or tone there, then re-run `bun run tokens`.",
    " */",
    "",
  ];
  for (const col of matrix) {
    lines.push(`:root {`);
    lines.push(`  /* ---- ${col.category} ---- */`);
    for (const cell of col.cells) {
      lines.push(`  --${cell.name}: ${cell.value};`);
    }
    lines.push(`}`);
    lines.push("");
  }
  writeFileSync(resolve(TOKENS_DIR, "effects.css"), HEADER + lines.join("\n"));
}

function writePrimitivesCss(built: readonly BuiltPalette[], meshes: readonly GradientToken[]): void {
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
    for (const g of p.gradients) lines.push(`  --gradient-${g.name}: ${g.value};`);
    lines.push("");
  }

  lines.push("  /* ---- Multi-palette meshes ---- */");
  for (const m of meshes) lines.push(`  --gradient-${m.name}: ${m.value};`);
  lines.push("");

  lines.push("  /* ---- Space / radius / ratio ramps ---- */");
  for (const s of spaceRamp)  lines.push(`  --${s.name}: ${s.value};`);
  for (const r of radiusRamp) lines.push(`  --${r.name}: ${r.value};`);
  for (const r of ratioRamp)  lines.push(`  --${r.name}: ${r.value};`);
  lines.push("");

  lines.push("  /* ---- Shadows / blurs / rings / glass / noise ---- */");
  for (const e of shadowLadder)      lines.push(`  --${e.name}: ${e.value};`);
  for (const e of shadowBrandLadder) lines.push(`  --${e.name}: ${e.value};`);
  for (const e of blurLadder)        lines.push(`  --${e.name}: ${e.value};`);
  for (const e of ringLadder)        lines.push(`  --${e.name}: ${e.value};`);
  for (const e of glassPresets)      lines.push(`  --${e.name}: ${e.value};`);
  for (const e of noisePresets)      lines.push(`  --${e.name}: ${e.value};`);
  lines.push("");

  lines.push("  /* ---- Motion (durations, easings, named transitions) ---- */");
  for (const m of durations)   lines.push(`  --${m.name}: ${m.value};`);
  for (const m of easings)     lines.push(`  --${m.name}: ${m.value};`);
  for (const m of transitions) lines.push(`  --${m.name}: ${m.value};`);
  lines.push("");

  lines.push("  /* ---- Fluid XY scale (foundry/source/fluid/*.fluid.ts) ---- */");
  for (const group of fluidGroups()) {
    lines.push(`  /* -- ${group.label} -- */`);
    for (const t of group.tokens) lines.push(`  --${t.name}: ${t.value};`);
  }
  lines.push("}\n");

  writeFileSync(resolve(TOKENS_DIR, "primitives.css"), HEADER + lines.join("\n"));
}

function writeBrandsCss(built: readonly BuiltPalette[]): void {
  const byName = new Map(built.map((b) => [b.name, b]));
  const lines: string[] = [
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
    lines.push(`  --brand:            var(--${b.palette}-${brandStep});`);
    lines.push(`  --brand-strong:     var(--${b.palette}-${strongStep});`);
    lines.push(`  --brand-soft:       var(--${b.palette}-${softStep});`);
    lines.push(`  --brand-ink:        var(--${b.ink}-${b.inkStep});`);
    lines.push(`  --focus-ring:       var(--${b.palette}-${brandStep});`);
    if (b.paletteAlt) {
      lines.push(`  --brand-alt:        var(--${b.paletteAlt}-${brandStep});`);
      lines.push(`  --brand-alt-strong: var(--${b.paletteAlt}-${strongStep});`);
      lines.push(`  --brand-alt-soft:   var(--${b.paletteAlt}-${softStep});`);
    }
    // Surface bindings — per brand
    lines.push(`  --surface-base:     var(--${b.surface}-900);`);
    lines.push(`  --surface-raised:   var(--${b.surface}-800);`);
    lines.push(`  --surface-overlay:  var(--${b.surface}-700);`);
    lines.push(`  --surface-sunken:   var(--${b.surface}-950);`);
    lines.push(`  --surface-deep:     var(--${b.surface}-975);`);
    lines.push(`  --surface-input:    var(--${b.surface}-700);`);
    lines.push(`  --surface-inverse:  var(--${b.surfaceInverse}-500);`);
    lines.push(`  --hairline:         var(--${b.surface}-600);`);
    if (b.gradientHero) {
      lines.push(`  --gradient-hero:    var(--gradient-${b.gradientHero});`);
    }
    if (b.fontDisplay) {
      lines.push(`  --font-display:     ${b.fontDisplay};`);
    }
    lines.push("}\n");
  }

  lines.push("/* Free accents — always available regardless of active brand. */");
  lines.push(":root {");
  for (const b of built) {
    if (b.kind === "accent" || b.kind === "brand") {
      lines.push(`  --accent-${b.name}: var(--${b.name}-500);`);
      lines.push(`  --accent-${b.name}-strong: var(--${b.name}-400);`);
      lines.push(`  --accent-${b.name}-soft: var(--${b.name}-200);`);
    }
  }
  lines.push("}\n");

  lines.push("/* Utility semantic aliases. */");
  lines.push(":root {");
  for (const util of ["danger", "warning", "info"] as const) {
    if (byName.has(util)) {
      lines.push(`  --${util}:      var(--${util}-500);`);
      lines.push(`  --${util}-soft: var(--${util}-soft-200);`);
      lines.push(`  --${util}-ink:  var(--ink-50);`);
    }
  }
  lines.push("}\n");

  writeFileSync(resolve(TOKENS_DIR, "brands.css"), HEADER + lines.join("\n"));
}

function writeFoundryTokensTs(built: readonly BuiltPalette[], meshes: readonly GradientToken[]): void {
  const lines: string[] = [
    "/**",
    " * Typed token lookup for runtime code. Every entry resolves to a",
    " * `var(...)` reference, not a literal color — so brand switching still",
    " * works when consumed inline (e.g. as an SVG stroke or canvas fill).",
    " */",
    "",
  ];

  const palObj: string[] = [];
  for (const p of built) {
    const safeKey = /[^a-zA-Z0-9_$]/.test(p.name) ? `"${p.name}"` : p.name;
    palObj.push(`  ${safeKey}: {`);
    for (const step of LADDER_STEPS) palObj.push(`    ${step}: "var(--${p.name}-${step})",`);
    palObj.push("  },");
  }

  const gradObj: string[] = [];
  for (const p of built) for (const g of p.gradients) gradObj.push(`  "${g.name}": "var(--gradient-${g.name})",`);
  for (const m of meshes) gradObj.push(`  "${m.name}": "var(--gradient-${m.name})",`);

  const brandObj = brandBindings.map((b) => `  ${b.id}: "${b.id}",`);

  const emit = (name: string, entries: readonly { name: string; value?: string }[]): string => {
    const rows = entries.map((e) => `  "${e.name}": "var(--${e.name})",`).join("\n");
    return `export const ${name} = {\n${rows}\n} as const;\n`;
  };

  lines.push("export const palette = {");
  lines.push(palObj.join("\n"));
  lines.push("} as const;\n");

  lines.push("export const gradient = {");
  lines.push(gradObj.join("\n"));
  lines.push("} as const;\n");

  lines.push(emit("shadow", [...shadowLadder, ...shadowBrandLadder]));
  lines.push(emit("blur", blurLadder));
  lines.push(emit("ring", ringLadder));
  lines.push(emit("glass", glassPresets));
  lines.push(emit("noise", noisePresets));
  lines.push(emit("space", spaceRamp));
  lines.push(emit("radius", radiusRamp));
  lines.push(emit("ratio", ratioRamp));
  lines.push(emit("duration", durations));
  lines.push(emit("easing", easings));
  lines.push(emit("transition", transitions));
  lines.push(emit("fluid", fluidGroups().flatMap((g) => g.tokens)));

  lines.push("export const brands = {");
  lines.push(brandObj.join("\n"));
  lines.push("} as const;\n");

  lines.push("export type BrandId = keyof typeof brands;");
  lines.push("export type PaletteName = keyof typeof palette;");

  writeFileSync(resolve(FOUNDRY_DIR, "foundry.tokens.ts"), HEADER + lines.join("\n"));
}

build();
