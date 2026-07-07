# Token Foundry

Typed source-of-truth token pipeline. OKLCH-native, rem-based, multi-brand.

## Pipeline

```
source/palettes/*.palette.ts        typed PaletteSource
source/semantic/brand.semantic.ts   brand → palette bindings
              │
              ▼
build/build-tokens.ts               reads sources, applies transforms
              │
              ▼
tokens/primitives.css               ladders + gradients + sizes  (generated)
tokens/brands.css                   :root defaults + [data-brand] blocks  (generated)
foundry.tokens.ts                   typed runtime lookup  (generated)
```

`tokens/semantics.css` is **authored by hand** — role bindings, motion, fonts,
radii live there. The foundry never overwrites it.

## Adding a palette

1. Create `source/palettes/<name>.palette.ts` exporting a `PaletteSource`.
2. Register it in `source/palettes/index.ts`.
3. `bun run tokens`.

## Adding a brand

1. Append a `BrandBinding` in `source/semantic/brand.semantic.ts`.
2. `bun run tokens`.
3. `<html data-brand="<id>">` swaps to it.

## Design rules baked in

- **Never pure black.** Any generated step with `L < 0.10` fails the build.
- **OKLCH throughout.** Hex is forbidden in sources; culori runs the math.
- **REM only.** Every size token emits in rem — respects user root font-size.
- **11-step Radix/Tailwind cadence.** 50, 100, 200 … 900, 950.

## Why not Style Dictionary

Style Dictionary is the industry standard for multi-target token pipelines
(iOS + Android + web + Figma). This project has one target (web CSS + TS) so
a bespoke ~200-line builder is simpler and keeps types end-to-end without a
DTCG round trip. The `source → transform → format → emit` architecture
mirrors SD's model, so migrating later is straightforward.

<!-- effects-matrix:start -->
## Effects matrix

Auto-generated from `source/effects/effects.matrix.ts` (10 tones × 18 categories = 180 cells). Do not edit by hand — run `bun run tokens`.

| tone | surface | ink | glass | glass-strong | wash | edge | ring | ring-strong | glow | glow-strong | sheen | sheen-diag | text-shadow | halo | halo-focus | halo-active | shadow-pop | background-bloom |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| neutral | `--fx-surface-neutral` | `--fx-ink-neutral` | `--fx-glass-neutral` | `--fx-glass-strong-neutral` | `--fx-wash-neutral` | `--fx-edge-neutral` | `--fx-ring-neutral` | `--fx-ring-strong-neutral` | `--fx-glow-neutral` | `--fx-glow-strong-neutral` | `--fx-sheen-neutral` | `--fx-sheen-diag-neutral` | `--fx-text-shadow-neutral` | `--fx-halo-neutral` | `--fx-halo-focus-neutral` | `--fx-halo-active-neutral` | `--fx-shadow-pop-neutral` | `--fx-background-bloom-neutral` |
| brand | `--fx-surface-brand` | `--fx-ink-brand` | `--fx-glass-brand` | `--fx-glass-strong-brand` | `--fx-wash-brand` | `--fx-edge-brand` | `--fx-ring-brand` | `--fx-ring-strong-brand` | `--fx-glow-brand` | `--fx-glow-strong-brand` | `--fx-sheen-brand` | `--fx-sheen-diag-brand` | `--fx-text-shadow-brand` | `--fx-halo-brand` | `--fx-halo-focus-brand` | `--fx-halo-active-brand` | `--fx-shadow-pop-brand` | `--fx-background-bloom-brand` |
| info | `--fx-surface-info` | `--fx-ink-info` | `--fx-glass-info` | `--fx-glass-strong-info` | `--fx-wash-info` | `--fx-edge-info` | `--fx-ring-info` | `--fx-ring-strong-info` | `--fx-glow-info` | `--fx-glow-strong-info` | `--fx-sheen-info` | `--fx-sheen-diag-info` | `--fx-text-shadow-info` | `--fx-halo-info` | `--fx-halo-focus-info` | `--fx-halo-active-info` | `--fx-shadow-pop-info` | `--fx-background-bloom-info` |
| warning | `--fx-surface-warning` | `--fx-ink-warning` | `--fx-glass-warning` | `--fx-glass-strong-warning` | `--fx-wash-warning` | `--fx-edge-warning` | `--fx-ring-warning` | `--fx-ring-strong-warning` | `--fx-glow-warning` | `--fx-glow-strong-warning` | `--fx-sheen-warning` | `--fx-sheen-diag-warning` | `--fx-text-shadow-warning` | `--fx-halo-warning` | `--fx-halo-focus-warning` | `--fx-halo-active-warning` | `--fx-shadow-pop-warning` | `--fx-background-bloom-warning` |
| danger | `--fx-surface-danger` | `--fx-ink-danger` | `--fx-glass-danger` | `--fx-glass-strong-danger` | `--fx-wash-danger` | `--fx-edge-danger` | `--fx-ring-danger` | `--fx-ring-strong-danger` | `--fx-glow-danger` | `--fx-glow-strong-danger` | `--fx-sheen-danger` | `--fx-sheen-diag-danger` | `--fx-text-shadow-danger` | `--fx-halo-danger` | `--fx-halo-focus-danger` | `--fx-halo-active-danger` | `--fx-shadow-pop-danger` | `--fx-background-bloom-danger` |
| lime | `--fx-surface-lime` | `--fx-ink-lime` | `--fx-glass-lime` | `--fx-glass-strong-lime` | `--fx-wash-lime` | `--fx-edge-lime` | `--fx-ring-lime` | `--fx-ring-strong-lime` | `--fx-glow-lime` | `--fx-glow-strong-lime` | `--fx-sheen-lime` | `--fx-sheen-diag-lime` | `--fx-text-shadow-lime` | `--fx-halo-lime` | `--fx-halo-focus-lime` | `--fx-halo-active-lime` | `--fx-shadow-pop-lime` | `--fx-background-bloom-lime` |
| cyan | `--fx-surface-cyan` | `--fx-ink-cyan` | `--fx-glass-cyan` | `--fx-glass-strong-cyan` | `--fx-wash-cyan` | `--fx-edge-cyan` | `--fx-ring-cyan` | `--fx-ring-strong-cyan` | `--fx-glow-cyan` | `--fx-glow-strong-cyan` | `--fx-sheen-cyan` | `--fx-sheen-diag-cyan` | `--fx-text-shadow-cyan` | `--fx-halo-cyan` | `--fx-halo-focus-cyan` | `--fx-halo-active-cyan` | `--fx-shadow-pop-cyan` | `--fx-background-bloom-cyan` |
| magenta | `--fx-surface-magenta` | `--fx-ink-magenta` | `--fx-glass-magenta` | `--fx-glass-strong-magenta` | `--fx-wash-magenta` | `--fx-edge-magenta` | `--fx-ring-magenta` | `--fx-ring-strong-magenta` | `--fx-glow-magenta` | `--fx-glow-strong-magenta` | `--fx-sheen-magenta` | `--fx-sheen-diag-magenta` | `--fx-text-shadow-magenta` | `--fx-halo-magenta` | `--fx-halo-focus-magenta` | `--fx-halo-active-magenta` | `--fx-shadow-pop-magenta` | `--fx-background-bloom-magenta` |
| violet | `--fx-surface-violet` | `--fx-ink-violet` | `--fx-glass-violet` | `--fx-glass-strong-violet` | `--fx-wash-violet` | `--fx-edge-violet` | `--fx-ring-violet` | `--fx-ring-strong-violet` | `--fx-glow-violet` | `--fx-glow-strong-violet` | `--fx-sheen-violet` | `--fx-sheen-diag-violet` | `--fx-text-shadow-violet` | `--fx-halo-violet` | `--fx-halo-focus-violet` | `--fx-halo-active-violet` | `--fx-shadow-pop-violet` | `--fx-background-bloom-violet` |
| coral | `--fx-surface-coral` | `--fx-ink-coral` | `--fx-glass-coral` | `--fx-glass-strong-coral` | `--fx-wash-coral` | `--fx-edge-coral` | `--fx-ring-coral` | `--fx-ring-strong-coral` | `--fx-glow-coral` | `--fx-glow-strong-coral` | `--fx-sheen-coral` | `--fx-sheen-diag-coral` | `--fx-text-shadow-coral` | `--fx-halo-coral` | `--fx-halo-focus-coral` | `--fx-halo-active-coral` | `--fx-shadow-pop-coral` | `--fx-background-bloom-coral` |
<!-- effects-matrix:end -->
