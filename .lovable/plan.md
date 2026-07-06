# Fix LeftRail Tooltips + Add Interaction FX

Two problems to fix, scoped to LeftRail + Tooltip primitive only.

## Problem 1 — Tooltips don't render

RAC `TooltipTrigger` binds hover/focus handlers to its child via `useFocusable`. A raw TanStack `<Link>` (renders an `<a>`) doesn't accept those props, so the trigger silently no-ops. RAC's documented fix is wrapping the non-RAC child in `<Focusable>` from `react-aria-components`, which forwards `ref` + event handlers to the underlying DOM node.

Fix: wrap the `<Link>` (and the collapse `<button>`) in `<Focusable>` inside every `TooltipTrigger` in `left-rail.tsx`. No API change to the `Tooltip` primitive itself.

## Problem 2 — No interaction FX on rail items

Current rail items only change `bg`/`text` on `:hover`. Need a real interaction signature that:
- works in both collapsed (icon-only) and expanded (icon+label) modes,
- uses the same per-item tone as the tooltip (cyan/magenta/coral/lime) so the whole item feels unified,
- animates in with motion tokens and respects `prefers-reduced-motion`,
- keeps `.tap-target` and active-state semantics intact,
- uses only OKLCH semantic tokens (no `#hex`, no `bg-*-500`).

### Per-item tone plumbing
Publish the tooltip tone as a CSS variable on each rail row: `style={{ ["--rail-tone" as string]: "var(--tooltip-bg-<tone>)" }}`. Everything visual below reads `var(--rail-tone)` so a single source of truth drives icon color, glow, and underline.

### Interaction states (composed on the row element)

1. **Icon color swap** — icon `color: var(--ink-muted)` at rest; on `hover`/`focus-visible`/`data-[hovered]`/`data-[focus-visible]`, `color: var(--rail-tone)` with `transition: color var(--motion-duration-fast) var(--motion-ease-standard)`.
2. **Halo ring** — pseudo `::before` `absolute inset-0 rounded-f-md ring-1 ring-transparent` → on hover `ring-[color-mix(in_oklch,var(--rail-tone)_55%,transparent)]` + soft `box-shadow: 0 0 0 4px color-mix(in oklch, var(--rail-tone) 18%, transparent)`. Transitions `box-shadow, ring-color` at `--motion-duration-base` / `--motion-ease-emphasized`.
3. **Left tone bar** — pseudo `::after` on the left edge: `w-[0.1875rem] h-[60%] rounded-full bg-[var(--rail-tone)] scale-y-0 origin-center`. On hover / active → `scale-y-100 opacity-100`. Transition `transform, opacity` at `--motion-duration-base` / `--motion-ease-emphasized`. This is the "unified" motion signature visible in both modes because it's edge-anchored, not label-dependent.
4. **Icon micro-motion** — `transform: translateX(0) scale(1)` at rest → on hover `translateX(0.125rem) scale(1.06)` (collapsed) / `translateX(0.125rem) scale(1.03)` (expanded). Transition `transform` at `--motion-duration-fast` / `--motion-ease-emphasized`.
5. **Label sweep (expanded only)** — label `letter-spacing: 0.2em` at rest → `letter-spacing: 0.24em` on hover, transition at `--motion-duration-base`. Uses existing typography — no new tokens.
6. **Press** — `data-[pressed]:scale-[0.98]` on the row for tactile feedback.
7. **Active state** — persistent tone bar (`::after` visible), icon in tone color, subtle `bg: color-mix(in oklch, var(--rail-tone) 12%, var(--surface) 88%)`.
8. **Reduced motion** — all transforms/box-shadows collapse to instant color swap under `motion-reduce:*`.

Every state selector uses Tailwind arbitrary + RAC data-attrs. Nothing hardcoded.

### Focus ring
Existing `--focus-ring` stays; per-item tone is decorative. Keyboard `focus-visible` shows both the tone halo AND the `--focus-ring` outline (WAI-ARIA APG requires a distinct focus indicator regardless of decorative state).

## Files touched

Edited (only)
- `src/domains/shell/components/left-rail/left-rail.tsx` — add `<Focusable>` wrapping inside each `TooltipTrigger`, add `--rail-tone` style var per item, replace flat hover classes with the composed interaction stack above.

No other files change. No new tokens, no new primitives, no fluid changes, no palette changes.

## Verify
- Hover / keyboard-focus each rail item in collapsed mode → tooltip appears on right + icon lights up in item's tone + left tone bar sweeps in + halo appears.
- Same interaction in expanded mode → tooltip still appears (collapse arrow item too) + label tracking widens + icon nudges right.
- Tab through the rail with keyboard → focus-visible ring shows alongside tone halo.
- `prefers-reduced-motion: reduce` → colors change instantly, no transforms.
- `rg -n "#[0-9a-fA-F]{3,}|rgb\\(" src/domains/shell/components/left-rail` empty.
- `bunx tsgo --noEmit` clean.
