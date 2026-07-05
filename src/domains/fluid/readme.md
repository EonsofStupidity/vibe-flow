# Fluid XY foundation

One system. Every clamp on the site — type, spacing, radius, shell rail,
slide padding — is generated from the same math core against the same
viewport window. No breakpoints anywhere.

## Layers

```
config/fluid-window.const.ts        ← FLUID_X, FLUID_Y (single source of truth)
utils/fluid-axis.util.ts            ← fluidAxis(), fluidRange() (math core)
utils/fluid.util.ts, fluid-y.util.ts ← thin wrappers over fluidAxis()
hooks/useFluid.ts, useFluidBox.ts    ← optional runtime consumers

src/domains/theme/foundry/source/fluid/*.fluid.ts   ← typed scale sources
src/domains/theme/foundry/build/transforms/fluid.transform.ts ← emits tokens
```

## Where to change what

| I want to…                              | Edit                                                        |
| --------------------------------------- | ----------------------------------------------------------- |
| Rescale the entire site's fluid curve   | `config/fluid-window.const.ts`                              |
| Change the type ramp min/max            | `theme/foundry/source/fluid/type.fluid.ts`                  |
| Change spacing steps (`--sp-1..8`)      | `theme/foundry/source/fluid/space.fluid.ts`                 |
| Change fluid radii (`--r-sm/md/lg`)     | `theme/foundry/source/fluid/radius.fluid.ts`                |
| Change rail/panel/topbar widths         | `theme/foundry/source/fluid/shell.fluid.ts`                 |
| Change slide padding                    | `theme/foundry/source/fluid/slide.fluid.ts`                 |
| Consume a clamp in JS (SVG, canvas)     | `useFluid(min, max)` — otherwise use the CSS token var      |
| Drive a component off container size    | `useFluidBox()` — SSR-safe, `null` until observed           |

## Contract

- Values default to **rem** so they respect the user's root font-size.
- X-axis uses `vw`; Y-axis uses `svh` (mobile chrome swap safe).
- Runtime hooks return the SAME string the build transform would emit —
  they call `fluidAxis` too, no duplicated math.
- Do NOT hand-author `clamp()` strings elsewhere. Add an entry to a
  `*.fluid.ts` source or call `fluidAxis(...)` directly.
