# Fluid XY Clamp

Two pure utilities that emit CSS `clamp()` strings. Used to build a
no-breakpoint sizing system for the entire DevPULSE Labs shell and the EoS
touchscreen runtime.

## Contract

- `fluid(minPx, maxPx, minVw?, maxVw?)` — X-axis; interpolates against `vw`.
- `fluidY(minPx, maxPx, minSvh?, maxSvh?)` — Y-axis; interpolates against `svh`
  (small viewport height, immune to mobile chrome jumps).

Both return a CSS string suitable for:
- Inline `style={{ fontSize: fluid(14, 20) }}`
- CSS custom property declarations (via `--var: <string>`)
- Design tokens registered under Tailwind v4 `@theme`

## Rules

- No breakpoint variants (`sm:`, `md:`, `lg:`) anywhere in app code.
- No `useMobile` / matchMedia hooks. The layout is one continuous curve.
- When a *panel* — not the viewport — should drive size, use container
  queries with the same clamp math; a hook-driven variant is intentionally
  not shipped until a real use case forces it.

## Defaults

`fluid` uses `24vw → 120vw` (384px → 1920px). `fluidY` uses `40svh → 100svh`.
Override per token when the intended range differs.
