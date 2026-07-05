## Goal
Blow out the token foundry from a 12-palette MVP into a scale/variety substrate — enough raw material for each property (EoS, News, Vibes) and every downstream slide/shell/effect to look genuinely distinct without ever hardcoding a hex.

The rule stays: components read semantics only; the foundry does the volume, in TS source → generated CSS/TS, validated at build.

## Expansion tracks

### 1. Palette breadth (12 → ~34)
Add whole hue families and multiple anchors per hue so we have room for variety without collisions.

- **Surfaces (1 → 4):** `ink` (cool neutral, current), `graphite` (warm neutral), `slate` (blue-cool), `mocha` (warm dark). Each is a `kind: "surface"` full 11-step ladder. Enables per-brand or per-episode surface swaps without touching semantics.
- **Brand hues stay 3** but each grows a `-alt` sibling anchor (amber/amber-ember, cyan/cyan-ice, magenta/magenta-orchid) → 6 brand palettes total. Lets a single property express variants (title vs comparator vs still) via brand-level bindings, not ad-hoc color.
- **Accent expansion (5 → ~18):** add `crimson, orange, gold, chartreuse, emerald, jade, sky, azure, indigo, purple, plum, fuchsia, pink` alongside existing `lime, teal, violet, coral, rose`. Every accent is a full ladder and exposed as `--accent-<name>`.
- **Utility stays 3** (`danger`, `warning`, `info`) but each gets a `-soft` variant palette for badge/toast fills.

Naming rule enforced in the palette-name validator: no color-family duplicates unless suffixed with a meaningful variant token (`-alt`, `-soft`, `-ember`, etc.).

### 2. Ladder + curve variety
Right now every palette uses one curve × one chroma modulation. Add:

- **New curves:** `high-contrast` (steeper L delta at extremes), `low-key` (compressed range for muted surfaces), `luminous` (holds L high through 600 for neon vibes).
- **New chroma modulations:** `peak-at-400`, `peak-at-600`, `bloom` (chroma rises with L for glass/aurora looks).
- **Ladder extension:** add step `25` (near-white tint) and step `975` (near-black shadow) → 13 steps. Keeps Tailwind cadence but gives room for glassmorphism highlights and deep shadows without hitting pure black (validator still enforces L ≥ 0.10 on 975 and L ≤ 0.99 on 25).
- Curves live in `build/transforms/curves.transform.ts` (already exists) — extend, don't fork.

### 3. Gradient recipes (4 → 12 per eligible palette)
Extend `gradient.transform.ts` with recipes so each brand/accent auto-emits:

`linear`, `linear-soft`, `linear-vivid`, `radial`, `radial-spot`, `conic`, `conic-sweep`, `mesh-2` (two-palette blend), `mesh-3`, `duotone` (paired with ink surface), `sheen` (angled highlight), `aurora` (multi-stop OKLCH interpolation).

Two-palette recipes are configured in `source/semantic/gradients.semantic.ts` (new file) listing legal pairings — e.g. `amber × magenta`, `cyan × violet` — so the generator doesn't emit N² combinations.

### 4. Effects tokens (new primitive category)
Add `source/effects/` producing new sections in `primitives.css`:

- **Shadow ladder:** `--shadow-1..8`, plus branded variants `--shadow-brand-1..4` colored via `color-mix(in oklch, var(--brand) 30%, transparent)`. Generated so brand switch recolors shadows.
- **Blur ladder:** `--blur-1..6` (2px → 48px).
- **Glass presets:** `--glass-thin/medium/thick` (backdrop-filter compositions).
- **Noise/grain:** `--noise-fine/coarse` (data-URL SVG turbulence baked at build).
- **Ring ladder:** `--ring-1..4` widths.

Components still consume via semantic aliases (`--shadow-card`, `--shadow-popover`, `--overlay-scrim`).

### 5. Motion library (1 → tiered)
Extend `semantics.css` (or split to `motion.semantic.css`):

- Durations: `instant, fast, base, slow, slower, glacial` (75/120/200/320/480/720ms).
- Easings: `standard, emphasized, decelerate, accelerate, bounce, spring-soft, spring-crisp`.
- Named recipes: `--transition-hover`, `--transition-panel`, `--transition-modal`, `--transition-page`.

### 6. Type scale + font stacks
- Keep `Space Grotesk / Inter Tight / JetBrains Mono` as the default trio but register **font role slots**: `--font-display`, `--font-body`, `--font-mono`, `--font-editorial`, `--font-numeric`. Per-brand overrides live in `brands.css` (e.g. Vibes gets a display swap).
- Fluid type ramp: `--type-eyebrow, body-sm, body, body-lg, h4, h3, h2, h1, display, display-xl` generated with `fluid()` clamps, plus paired `--leading-*` and `--tracking-*` ladders.

### 7. Size / space / radius scale
- Space ramp `size-0..24` (currently 1..16) + `size-px` (1px hairline) + fractional `size-1_5/2_5/3_5`.
- Radius ramp: `sm, md, lg, xl, 2xl, pill, blob-1, blob-2` — blobs are asymmetric radii strings for organic shapes.
- Aspect ratio tokens: `--ratio-square/video/cinema/portrait/golden`.

### 8. Semantic surface roles (multi-brand aware)
`semantics.css` gains role slots that resolve through the active brand's chosen surface palette:

- `--surface-base/raised/overlay/sunken/input/inverse/glass/scrim`
- `--ink-strong/default/muted/subtle/inverse/annotate/onBrand/onDanger`
- `--border-hairline/strong/brand/focus`

Brand bindings gain `surface: string` and `surfaceInverse: string` so EoS can sit on `mocha`, News on `slate`, Vibes on `ink`, without any component knowing.

### 9. Runtime typing + validation
- `foundry.tokens.ts` grows typed exports: `palette`, `gradient`, `shadow`, `blur`, `ring`, `motion`, `type`, `space`, `radius`, `ratio`, `brands`. Each is a `Record<name, "var(...)">` so runtime code (canvas, SVG, framer-motion) can bind by name.
- Build validator (in `build-tokens.ts`) enforces: no L < 0.10 (except explicit `-975` step), no duplicate palette names, every brand binding references an existing palette, every gradient pairing references two existing palettes, every semantic alias resolves.
- Build fails loudly on any breach — no silent drift.

### 10. Docs + governance
- Update `src/domains/theme/foundry/readme.md` with: palette taxonomy, when to add vs bind, how to add a curve/gradient recipe, the "never bypass semantics" rule.
- Update `mem://design/token-architecture.md` and `mem://design/broadcast-console.md` to reflect the expanded ladder and multi-surface model.

## What does NOT change
- The three-layer contract (primitives → semantics → brands) is untouched.
- No component code is edited; existing semantic class names keep working. New ones become available.
- No new runtime dependencies. Still `culori` + valibot at build only.
- No shadcn, no CVA, no re-exports, no shims.
- No responsive breakpoints — everything scales via `fluid()` / rem.
- Deck runtime routes remain chromeless; shell unaffected.

## Technical details

**File additions**
```
src/domains/theme/foundry/source/
  palettes/               (+ ~22 new palette files, one per hue)
  effects/
    shadows.effect.ts
    blurs.effect.ts
    rings.effect.ts
    glass.effect.ts
    noise.effect.ts
  semantic/
    gradients.semantic.ts   (legal palette pairings)
    surfaces.semantic.ts    (per-brand surface bindings)
    type.semantic.ts        (fluid type ramp definitions)
    motion.semantic.ts
    space.semantic.ts
  build/transforms/
    curves.transform.ts     (extend with new curves)
    gradient.transform.ts   (extend with 8 new recipes)
    shadow.transform.ts     (new)
    type.transform.ts       (new — emits fluid() clamp CSS)
    validate.transform.ts   (new — build-time invariants)
```

**Generated outputs (regenerated by `bun run tokens`)**
```
src/domains/theme/tokens/
  primitives.css   (much larger — ladders, gradients, shadows, blurs, noise, sizes, ratios)
  semantics.css    (kept authored, but split into logical sections; no hand color literals)
  brands.css       (per-brand surface/font/gradient/shadow overrides)
src/domains/theme/foundry/foundry.tokens.ts   (expanded typed exports)
```

**Ladder change**
Update `LadderStep` to include `25` and `975`, update `LADDER_STEPS`, extend `oklch-ladder.transform.ts` L targets per curve. Existing palettes get the two new steps automatically. `foundry.tokens.ts` consumers using numeric keys keep working; only additive change.

**Brand binding shape**
```ts
interface BrandBinding {
  id: string;
  palette: string;         // primary brand palette
  paletteAlt?: string;     // optional sibling for variants
  surface: string;         // surface palette name (ink/graphite/slate/mocha)
  surfaceInverse: string;
  ink: string;
  inkStep: LadderStep;
  brandStep?: LadderStep;
  strongStep?: LadderStep;
  softStep?: LadderStep;
  fontDisplay?: string;    // optional per-brand display font var
  gradientHero?: string;   // named gradient token to bind as --gradient-hero
}
```

**Validation examples (fail build)**
- Palette `foo` has anchor `l: 0.05` → "must be ≥ 0.10, use ink surface for dark".
- Brand binding references palette `nonesuch` → "unknown palette".
- Gradient pairing lists palette not in registry → hard fail.

## Rollout order (single build-mode pass)
1. Extend types, curves, ladder steps, validator.
2. Add new palette source files (surfaces, brand alts, accents, utility softs).
3. Add effects sources + transforms.
4. Add semantic source files (gradients, surfaces, type, motion, space).
5. Extend `build-tokens.ts` to emit new sections + updated `foundry.tokens.ts`.
6. Refresh `semantics.css` bindings (add new roles, keep old ones stable).
7. Regenerate; verify `bun run tokens` clean; typecheck.
8. Update foundry readme + memory files.

No component edits, no route edits, no shell edits in this pass.