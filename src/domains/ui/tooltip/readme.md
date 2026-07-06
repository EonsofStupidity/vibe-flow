# Tooltip

Owned RAC tooltip. WAI-ARIA APG compliant via
`react-aria-components`' `TooltipTrigger` + `Tooltip`. No shadcn, no Radix,
no CVA.

## API

```tsx
import { Tooltip, TooltipTrigger } from "@/domains/ui/tooltip/tooltip";

<TooltipTrigger delay={200} closeDelay={80}>
  <Link to="/">Home</Link>
  <Tooltip tone="cyan" size="md" placement="right">Home</Tooltip>
</TooltipTrigger>
```

## Props

- `tone` — `neutral | brand | info | warning | danger | lime | cyan | magenta | violet | coral`. Defaults to `neutral`.
- `size` — `sm | md | lg`. Defaults to `md`.
- `showArrow` — render the `OverlayArrow` pointer. Defaults to `true`.
- `offsetRem` — trigger→tooltip gap, in `rem`. Defaults to `0.5` (converted to px at the RAC boundary).
- All other RAC `Tooltip` props are forwarded (`placement`, `crossOffset`, `containerPadding`, `shouldFlip`, `isOpen`, `id`).

## Motion

- Enter: `tooltip-in` keyframe (`opacity + scale + placement-directional slide`) at `--motion-duration-fast` / `--motion-ease-emphasized`.
- Exit: `tooltip-out` keyframe at `--motion-duration-fast` / `--motion-ease-standard`.
- Driven by RAC `data-entering` / `data-exiting` attrs — the browser owns the timeline; no JS animation controller.
- Fully suppressed under `prefers-reduced-motion`.
- Placement-aware: arrow rotates from `data-placement=*` on `OverlayArrow`; slide direction matches `data-placement=*` on the tooltip.

## Tone tokens

Every tone is resolved through the **effects matrix**
(`src/domains/theme/foundry/source/effects/effects.matrix.ts` →
`src/domains/theme/tokens/effects.css`). The variant recipe sets one row of
`[--tooltip-*:var(--fx-*-<tone>)]` local vars and the surface reads them —
the tooltip primitive itself declares no color logic. Adding a new tone is
one entry in `TONES` (matrix) plus one line in `tooltipVariants.variants.tone`.

| tone     | glass source           | edge source           | ink source              |
| -------- | ---------------------- | --------------------- | ----------------------- |
| neutral  | `--fx-glass-neutral`   | `--fx-edge-neutral`   | `--fx-ink-neutral`      |
| brand    | `--fx-glass-brand`     | `--fx-edge-brand`     | `--fx-ink-brand`        |
| info / warning / danger | `--fx-glass-<tone>`  | `--fx-edge-<tone>` | `--fx-ink-<tone>` |
| lime / cyan / magenta / violet / coral | `--fx-glass-<tone>` | `--fx-edge-<tone>` | `--fx-ink-<tone>` |

A `data-brand` swap on any ancestor re-tints `brand` tooltips automatically
because the matrix cell resolves to `var(--brand)` at paint time.

## Accessibility

- RAC wires `aria-describedby` from the trigger to the tooltip; no manual ARIA.
- Non-interactive by design — pointer hover and keyboard focus both trigger; Escape / blur close.
- Never wrap a `<TooltipTrigger>` around a non-focusable element — use a `<Button>`, `<Link>`, or focusable interactive.
