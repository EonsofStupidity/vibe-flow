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

Each tone reads `--tooltip-bg-<tone>` and `--tooltip-ink-<tone>` from
`src/domains/theme/tokens/semantics.css`. Accent tones share
`--tooltip-ink-on-accent` (defaulted to `--ink-inverse`). Because tokens are
resolved at paint, a `data-brand` swap re-tints `brand` tooltips automatically.

Contrast — verified against OKLCH anchors:

| tone     | bg source           | ink source              |
| -------- | ------------------- | ----------------------- |
| neutral  | `--surface-overlay` + 8% `--ink-950` mix | `--ink-strong` |
| brand    | `--brand`           | `--brand-ink`           |
| info     | `--info`            | `--info-ink`            |
| warning  | `--warning`         | `--warning-ink`         |
| danger   | `--danger`          | `--danger-ink`          |
| lime/cyan/magenta/violet/coral | `--accent-<name>` | `--ink-inverse` |

## Accessibility

- RAC wires `aria-describedby` from the trigger to the tooltip; no manual ARIA.
- Non-interactive by design — pointer hover and keyboard focus both trigger; Escape / blur close.
- Never wrap a `<TooltipTrigger>` around a non-focusable element — use a `<Button>`, `<Link>`, or focusable interactive.
