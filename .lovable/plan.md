# Content Auto-Fit + Palette Expansion

Two independent tracks. Both build on the fluid XY foundation already shipped — no new math, no breakpoints, no shortcuts.

---

## Track 1 — Content auto-resize primitives

The shell already publishes the inner content rect via `ShellSizeContext`, and `useFluidBox` exposes `{ width, height, xt, yt }` for any element. What is missing is a **canonical set of container primitives** so every future slide/panel/widget inherits fluid behavior without hand-rolling `ResizeObserver` or clamp strings.

### New domain: `src/domains/fluid/`

#### 1. `hooks/useContentSize.ts`
Thin, typed re-export of `useShellSize()` for consumption outside the shell domain — keeps content components from importing shell internals. Returns `{ width, height, dpr, xt, yt }` (adds the 0..1 progress the raw context doesn't compute).

#### 2. `hooks/useFluidScale.ts`
`useFluidScale({ minPx, maxPx, axis? }) → number` — returns the current interpolated numeric value (not a clamp string) using the SAME `FLUID_X/Y` windows. For SVG viewBox math, canvas draws, framer-motion values.

#### 3. `components/fluid-frame/fluid-frame.tsx`
```tsx
<FluidFrame ratio="16/9" min="20rem" max="80rem">…</FluidFrame>
```
- Self-observing container that clamps its own width via `--fluid-frame-w: clamp(min, 100cqi, max)` using container queries (`container-type: inline-size`).
- Publishes `--frame-w` / `--frame-h` custom properties on itself so children can read local size without a hook.
- Sets `aspect-ratio` from `ratio` prop.
- Zero JS at steady state — pure CSS containment.

#### 4. `components/fluid-stack.tsx` and `fluid-grid.tsx`
- `FluidStack`: vertical stack whose gap uses `--sp-*` tokens by "density" prop (`compact | comfortable | spacious`).
- `FluidGrid`: container-driven auto-fit grid — `grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--col-min)), 1fr))` where `--col-min` is a fluid token. This is what replaces every `sm:/md:/lg:grid-cols-*` in the codebase.

#### 5. `utils/fluid-container.util.ts`
Emits the CSS var payload for a container: `containerType`, `containerName`, and the `--frame-*` publishing rules. Used by `FluidFrame` and any custom container that needs the same contract.

#### 6. `styles.css` additions (in `src/styles.css`)
- `@utility container-q { container-type: inline-size; }`
- `@utility container-qy { container-type: size; }`
- Container-query variants aren't Tailwind-native in v4 without config; register `--breakpoint-*` alternatives as **container-query tokens only** (no viewport media queries).

### Content components use one of three surfaces
1. `<FluidFrame>` — bounded region with intrinsic aspect ratio.
2. `<FluidGrid>` — auto-fit grid, no breakpoints.
3. `<FluidStack>` — vertical rhythm from token gaps.

That's the contract. Any future slide primitive that doesn't compose these gets rejected in review.

### Small shell touch-up
`app-shell.tsx` currently only publishes size via context — add `container-type: inline-size` and `container-name: shell-content` on the `<main>` so descendants can use `@container shell-content` queries directly.

---

## Track 2 — Primary color expansion (OKLCH, foundry-driven)

Current registry has amber/cyan/magenta as brand primaries plus ~30 accents. Add a **second tier of true primaries** — hues currently missing from the ramp, all following the existing `PaletteSource` contract (OKLCH anchor + curve + chroma). No overrides, no hand-tuned hex.

### New palettes to add (14, evenly distributed around the OKLCH hue wheel)

| Name | Kind | Anchor OKLCH | Curve | Chroma | Gap filled |
|---|---|---|---|---|---|
| `viridian` | brand | `{ l: 0.62, c: 0.16, h: 155 }` | brand | linear-to-500 | true green primary |
| `cerulean` | brand | `{ l: 0.66, c: 0.17, h: 230 }` | brand | linear-to-500 | between sky and azure |
| `vermilion` | brand | `{ l: 0.65, c: 0.20, h: 30 }` | brand | peak-at-500 | red-orange primary |
| `saffron` | brand | `{ l: 0.80, c: 0.17, h: 65 }` | brand | linear-to-500 | warm yellow between gold and amber |
| `electric` | brand | `{ l: 0.70, c: 0.22, h: 275 }` | luminous | bloom | high-energy neon |
| `botanical` | accent | `{ l: 0.55, c: 0.13, h: 140 }` | brand | soft | earthy green |
| `oxblood` | accent | `{ l: 0.42, c: 0.15, h: 20 }` | low-key | peak-at-600 | dark red |
| `midnight` | surface | `{ l: 0.20, c: 0.04, h: 260 }` | low-key | flat | deep blue surface |
| `porcelain` | surface | `{ l: 0.96, c: 0.008, h: 90 }` | neutral | flat | warm light surface |
| `sage` | accent | `{ l: 0.72, c: 0.06, h: 150 }` | muted | soft | desaturated green |
| `terracotta` | accent | `{ l: 0.62, c: 0.13, h: 40 }` | brand | soft | earthy warm |
| `lavender` | accent | `{ l: 0.75, c: 0.10, h: 295 }` | luminous | soft | soft purple |
| `mint` | accent | `{ l: 0.82, c: 0.11, h: 165 }` | luminous | bloom | fresh light green |
| `aubergine` | accent | `{ l: 0.35, c: 0.10, h: 320 }` | low-key | peak-at-600 | deep magenta-purple |

Each is a single `*.palette.ts` file appended to `source/palettes/index.ts`. The existing `writeBrandsCss` pass (from the last round) already emits every registered palette globally as `--color-<name>-<step>`, `--surface-<name>`, `--gradient-<name>-*` regardless of active brand — so these become instantly available to every domain without brand switching.

### Optional new gradient pairings
Add ~6 pairings to `source/semantic/gradients.semantic.ts`:
- `viridian × cerulean`, `vermilion × saffron`, `electric × lavender`, `midnight × cerulean`, `sage × porcelain`, `oxblood × terracotta`.

---

## Verify
- `bun run tokens` regenerates `primitives.css` + `brands.css` — grep confirms every new palette emits a full 13-step ramp.
- New `FluidFrame` / `FluidGrid` / `FluidStack` demo at `/deck/ep-000-template/…` — content resizes smoothly 320px → 1920px, no breakpoints, no jumps.
- `rg -n "sm:|md:|lg:|@media" src/` stays empty.
- Rail still capped at 165px, `useContentSize`/`useFluidBox` progress values match.

## Not touched
- Existing palettes, brand bindings, ink surface bindings, motion tokens, Zustand/Jotai stores, routing, MCP, RAC primitives.
