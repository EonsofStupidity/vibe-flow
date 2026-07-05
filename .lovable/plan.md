## Goal

One canonical Fluid XY foundation, generated at build time from a single math core, consumed everywhere (tokens, components, inline styles). No breakpoints. No hand-tuned `clamp()` strings scattered across files. No duplication between the foundry, `fluid.css`, and the runtime helpers.

## Current mess (why hours felt wasted)

- `src/domains/fluid/utils/fluid.util.ts` + `fluid-y.util.ts` compute clamps at runtime call sites — fine, but nothing wires them into the token pipeline.
- `src/domains/theme/tokens/fluid.css` is **hand-authored** clamps for `--fs-*`, `--sp-*`, `--r-*`, `--slide-pad-y` — parallel scale, out of sync with the foundry.
- The foundry emits **static rem** `--size-*`, `--radius-*`, `--rail-*`, `--type-*` (some clamps from `typeRamp`, but spacing/radius/rail are flat). Same categories, three different generators, three different sources of truth.
- Result: to change the fluid curve or the min/max viewport window, you have to hunt through the foundry, `fluid.css`, and every runtime call.

## Fix — build the foundation once, drive everything through it

### 1. Single math core: `src/domains/fluid/utils/fluid-axis.util.ts` (new)

Pure, tree-shakable. Both runtime and the foundry build script import this — no duplicated math anywhere.

```ts
// axis: "x" uses vw, "y" uses svh; window bounds are configurable and default to project constants.
export interface FluidAxisInput {
  readonly min: number;   // value at minVp
  readonly max: number;   // value at maxVp
  readonly minVp?: number;
  readonly maxVp?: number;
  readonly axis?: "x" | "y";
  readonly unit?: "rem" | "px";
}
export function fluidAxis(input: FluidAxisInput): string; // returns clamp(...)
export function fluidRange(input: FluidAxisInput): FluidRange; // typed, non-stringified
```

`fluid()` and `fluidY()` become thin wrappers over `fluidAxis({ axis: "x" })` / `{ axis: "y" }` — same output, no behavior change for existing call sites.

### 2. Single window constants: `src/domains/fluid/config/fluid-window.const.ts` (new)

```ts
export const FLUID_X = { minVp: 24, maxVp: 120 } as const; // 384px → 1920px
export const FLUID_Y = { minSvh: 40, maxSvh: 100 } as const;
```

Imported by the runtime util AND by the foundry transforms so type/space/radius scales are computed from the same window.

### 3. Single scale source: `src/domains/theme/foundry/source/fluid/*.source.ts` (new)

Typed scale declarations, one file per category — no CSS strings, just min/max pairs:

- `type.fluid.ts` — `eyebrow, body-sm, body, body-lg, h3, h2, h1, display, display-xl` with min/max rem
- `space.fluid.ts` — `f0..f10` with min/max rem
- `radius.fluid.ts` — `sm, md, lg, xl, blob` with min/max rem
- `shell.fluid.ts` — `rail-collapsed (3.5→4.25rem)`, `rail-expanded (8.5→10.3125rem = 165px cap)`, `panel-width`, `topbar-height`, `bottombar-height`
- `slide.fluid.ts` — `slide-pad-y` on the Y axis, `slide-pad-x` on the X axis

Every entry declares its axis (`"x"` default, `"y"` opt-in). This replaces the current `spaceRamp` / `radiusRamp` / hand-authored `fluid.css` values in one place.

### 4. New foundry transform: `build/transforms/fluid.transform.ts` (new)

```ts
// Reads all *.fluid.ts sources, calls fluidAxis(...) for each entry,
// returns [{ name, value }, ...] ready to write to primitives.css.
export function fluidTokens(): readonly FluidToken[];
```

Emitted into `primitives.css` under a `/* Fluid scale (generated) */` block by `build-tokens.ts`, replacing the currently-inline Shell layout / space / radius sections. Names stay identical (`--rail-collapsed`, `--sp-3`, `--r-md`, `--fs-body`, etc.) so no downstream file breaks.

### 5. Retire `src/domains/theme/tokens/fluid.css`

Delete it. Every clamp that lives there is now emitted by the foundry from the single source. `tokens.css` drops the import of `fluid.css`. `styles.css` `@theme inline` block continues to reference `--fs-*` / `--sp-*` / `--r-*` — unchanged from Tailwind's POV.

### 6. Runtime hook: `src/domains/fluid/hooks/useFluid.ts` (new, optional consumer surface)

For rare cases where a component needs a clamp string at render time (SVG attributes, canvas, inline style props that can't take a CSS var):

```ts
export function useFluid(min: number, max: number, opts?: FluidAxisOptions): string;
```

Memoized, returns the same string `fluidAxis` would produce. Not used by default — token vars are always preferred.

### 7. Runtime hook: `src/domains/fluid/hooks/useFluidBox.ts` (new)

Reads `ResizeObserver` on a ref and returns `{ width, height, xt, yt }` where `xt`/`yt` are 0..1 progress across the fluid window — for components that want to *drive* their own interpolations (particle density, mesh stops) off the same window the tokens use. Container-driven, no `window` reads, SSR-safe (returns `null` until first observation).

### 8. Types + readme

- `src/domains/fluid/types/fluid.types.ts` extended with `FluidAxisInput`, `FluidToken`, `FluidBox`.
- `src/domains/fluid/readme.md` rewritten as the canonical explainer: math core → window constants → scale sources → build transform → hooks. Names the exact file every kind of change goes in.
- Update `mem://design/token-architecture.md` note that fluid scale is now foundry-generated from `src/domains/fluid/`.

## What this fixes concretely

- The Fluid XY foundation exists as one system: math core + window + typed scales + foundry emitter + hooks.
- Every clamp on the site — type, spacing, radius, rail width, slide padding — comes from the same generator with the same window. Change `FLUID_X.maxVp` once and the entire site rescales.
- Left rail becomes fluid clamp capped at 165px via `shell.fluid.ts` (`{ min: 8.5, max: 10.3125 }` rem) instead of a flat `8.4375rem`.
- No breakpoints. Existing breakpoint offenders (`comparator-panel`, `top-bar`, `bottom-bar`) get container-driven equivalents in the same pass so the foundation stops being contradicted by component code.
- `fluid.css` — the parallel hand-authored file — is gone.

## Not touched

- Palettes, brand bindings, gradients, effects, motion, ink colors — no changes.
- Zustand shell store, routing, deck, slide-catalog primitives beyond the three breakpoint-removal edits already scoped.
- No new deps. No shadcn. No JS at runtime for CSS values (hooks are opt-in).

## Verify

- `bun run tokens` regenerates `primitives.css`; diff shows the previously hand-written `--sp-*`, `--fs-*`, `--r-*`, `--rail-*` blocks now come from the foundry with byte-identical `clamp()` output (matches the current `fluid.css` values within rounding).
- `rg -n "clamp\(" src/ --glob '!*.gen.ts' --glob '!primitives.css' --glob '!fluid-axis.util.ts'` → empty.
- `rg -n "sm:|md:|lg:|xl:|@media" src/ --glob '!*.gen.ts' --glob '!*.css'` → empty.
- Rail width interpolates smoothly 320px → 1920px, hard-capped at 165px, no jumps.