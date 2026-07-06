# RAC Tooltip Primitive + LeftRail Wiring

Goal: A production-grade, WAI-ARIA APG-compliant tooltip primitive under `src/domains/ui/tooltip/` that supports a variety of tone colors (semantic + brand + accent), animated enter/exit with placement-aware transforms, and is wired into every link in `LeftRail`. No shadcn, no Radix, no CVA — pure RAC + `tailwind-variants` + our semantic tokens. All values OKLCH via existing token layer; sizing/offsets in `rem`.

## Scope
- New primitive only: `src/domains/ui/tooltip/`.
- Small addition to `semantics.css` for tooltip role tokens (bg/ink/ring per tone, arrow inheritance).
- Small addition to `motion.semantic.ts` if a `transition-tooltip` recipe is missing (reuse existing durations/easings — no new math).
- Refactor `LeftRail` nav links to wrap in `TooltipTrigger` and render `Tooltip` content with a per-item tone.
- No changes to fluid system, no changes to brand palettes, no changes to router or store.

## Files

Created
- `src/domains/ui/tooltip/tooltip.tsx` — owned RAC wrapper. Exports:
  - `TooltipTrigger` (re-typed re-export of `TooltipTrigger` from RAC — required by RAC contract; this is not a shim, it's a named surface with our types).
  - `Tooltip` — renders `AriaTooltip` + `OverlayArrow` with variants applied.
- `src/domains/ui/tooltip/tooltip.types.ts` — `TooltipProps` extending `AriaTooltipProps` with `tone`, `size`, `placement`, `offset`, `showArrow`.
- `src/domains/ui/tooltip/tooltip.variants.ts` — `tailwind-variants` recipe: base, `tone`, `size`, arrow variants; all state via RAC `data-entering` / `data-exiting` / `data-placement=*`.
- `src/domains/ui/tooltip/readme.md` — usage + WAI-ARIA notes, tone matrix, examples.

Edited
- `src/domains/theme/tokens/semantics.css` — add tooltip role tokens (see Tokens).
- `src/domains/shell/components/left-rail/left-rail.tsx` — wrap each `Link` with `TooltipTrigger` + `Tooltip`, cycle tones across nav items so the rail demonstrates variety.

Nothing deleted. No exports moved. No barrel files.

## Tokens (semantics.css additions)

Add a role block; values are derived from existing brand/accent/utility tokens so they follow `data-brand` swaps automatically. All OKLCH via already-defined vars.

```
--tooltip-bg-neutral:  color-mix(in oklch, var(--surface-overlay) 92%, var(--ink-950) 8%);
--tooltip-ink-neutral: var(--ink-strong);
--tooltip-bg-brand:    var(--brand);
--tooltip-ink-brand:   var(--brand-ink);
--tooltip-bg-info:     var(--info);
--tooltip-ink-info:    var(--ink-on-info);
--tooltip-bg-warning:  var(--warning);
--tooltip-ink-warning: var(--ink-on-warning);
--tooltip-bg-danger:   var(--danger);
--tooltip-ink-danger:  var(--ink-on-danger);
--tooltip-bg-accent-1: var(--accent-lime);
--tooltip-bg-accent-2: var(--accent-cyan);
--tooltip-bg-accent-3: var(--accent-magenta);
--tooltip-bg-accent-4: var(--accent-violet);
--tooltip-bg-accent-5: var(--accent-coral);
--tooltip-ring:        var(--focus-ring);
--tooltip-shadow:      var(--shadow-popover);
--tooltip-radius:      var(--r-md);
--tooltip-offset:      0.5rem;
```

Accent ink resolves via `color-mix(in oklch, <bg> 100%, transparent) contrast` fallback → we set `--tooltip-ink-accent: var(--ink-inverse)` and per-accent overrides only when contrast requires it (verified per accent from existing ramps; documented in the tooltip readme).

## Variants (tailwind-variants)

Base classes:
- `rounded-f-md px-f3 py-f2 font-mono text-eyebrow uppercase tracking-[0.15em]`
- `shadow-[var(--tooltip-shadow)] ring-1 ring-[color-mix(in_oklch,var(--tooltip-ring)_40%,transparent)]`
- `will-change-[transform,opacity]`
- Enter/exit via RAC data attrs:
  - `data-[entering]:animate-in data-[entering]:fade-in-0 data-[entering]:zoom-in-95`
  - `data-[exiting]:animate-out data-[exiting]:fade-out-0 data-[exiting]:zoom-out-95`
  - Placement-directional slides using `data-[placement=top|bottom|left|right]:slide-in-from-*` — mapped to fluid rem offsets (no px).
- `motion-reduce:transition-none motion-reduce:animate-none`

Variants:
- `tone`: `neutral | brand | info | warning | danger | lime | cyan | magenta | violet | coral` — each sets `bg-[var(--tooltip-bg-*)]` and `text-[var(--tooltip-ink-*)]` and arrow `fill-[var(--tooltip-bg-*)]`.
- `size`: `sm | md | lg` → `text-eyebrow|body|h3` + `px-f2/3/4 py-f1/2/3`.
- Arrow rendered via `<OverlayArrow>` when `showArrow` true; SVG uses `currentColor` set to the same tone bg.

Default variants: `tone: "neutral"`, `size: "md"`, `showArrow: true`, `offset: 0.5rem` (converted to `rem→px` at RAC boundary via `parseFloat(rem)*16` in a tiny local helper — kept inside `tooltip.tsx`, no util domain leak).

## API

```
<TooltipTrigger delay={200} closeDelay={80}>
  <Link to="/…">…</Link>
  <Tooltip tone="cyan" size="md" placement="right">
    Home
  </Tooltip>
</TooltipTrigger>
```

Types are exhaustive: `TooltipTone`, `TooltipSize` exported for consumers (nav configs, notice registries). `TooltipProps` = `Omit<AriaTooltipProps,"className"> & { tone?; size?; showArrow?; className?: string }`.

## LeftRail wiring

- Extend `NavItem` with `tooltipTone: TooltipTone` and keep `label` as tooltip text.
- Tone cycle across the four items: `cyan → magenta → lime → violet` (demonstrates variety; matches Broadcast Console brand accents without hardcoding brand).
- `placement="right"` for expanded and collapsed states.
- Tooltip shows in both collapsed AND expanded states (collapsed = discovery aid, expanded = affordance/confirmation) — consistent behavior, opt-out via prop if later needed.
- Preserves existing `.tap-target`, active state, and rail width behavior. No breakpoint additions.

## Accessibility
- RAC `TooltipTrigger` owns `aria-describedby` linkage — no manual ARIA.
- Tooltips are non-interactive (no focus stealing); pointer + keyboard focus both trigger per RAC defaults.
- `motion-reduce` respected via Tailwind variant.
- Contrast: every tone bg/ink pair verified against the OKLCH ramp anchors (documented in `tooltip/readme.md`).

## Out of scope
- No Notice/Toast primitive (separate future task; tokens sized to be reusable).
- No changes to fluid utilities, palettes, or gradients.
- No routing/store changes.

## Verify
- `bun run tokens` (no-op — no foundry source added, only static semantic CSS).
- Type check: `TooltipProps` exhaustive with RAC generics.
- Visual: hover + keyboard-focus each of the 4 rail items → 4 distinct-tone tooltips with slide+fade animation from the correct side; collapsed and expanded rail both animate; `prefers-reduced-motion` disables animation.
- `rg -n "sm:|md:|lg:|@media" src/domains/ui/tooltip` returns empty.
- `rg -n "#|rgb\\(" src/domains/ui/tooltip` returns empty (OKLCH via tokens only).
