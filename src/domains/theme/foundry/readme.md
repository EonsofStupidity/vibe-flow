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
