
# Plan — Effects Matrix + RAC Template Library

Two coordinated tracks. Track A fixes the token architecture so any component picks effects from a shared matrix instead of inventing `--tooltip-*` / `--rail-*` per domain. Track B stands up the presentation/lesson template library on top of that matrix. Nothing gets deleted until the replacement is proven; existing tooltip + left-rail work stays until it migrates onto the new tokens.

---

## Track A — Effects Matrix (theme tokens)

### Goal
One 2-D grid of tokens:
- **Rows = tones** (`neutral`, `brand`, `info`, `warning`, `danger`, `lime`, `cyan`, `magenta`, `violet`, `coral`, plus future).
- **Columns = effect categories** (`surface`, `glass`, `edge`, `ring`, `shadow`, `glow`, `sheen`, `halo`, `text-shadow`, `background`, `outline`, `noise`, plus future).

Every cell is a CSS var: `--fx-<category>-<tone>` (e.g. `--fx-glow-cyan`, `--fx-glass-magenta`, `--fx-sheen-brand`). Adding a new category = one new file that appends a column across all tones. Adding a new tone = one new palette + one line per category. Nothing in components changes.

### File layout (new)

```text
src/domains/theme/foundry/source/effects/
  tones.effect.ts          # canonical tone list (single source of truth)
  categories/
    surface.category.ts    # solid tone-tinted fills
    glass.category.ts      # translucent tone fills for backdrop-blur surfaces
    edge.category.ts       # hairline / border tone
    ring.category.ts       # focus + selection rings
    shadow.category.ts     # depth ladder tinted by tone
    glow.category.ts       # outer glow / drop-shadow tint
    sheen.category.ts      # diagonal linear-gradient sweep
    halo.category.ts       # composed box-shadow stack (border + drop + inset highlight)
    text-shadow.category.ts
    background.category.ts # top-of-app background washes (ambient tone bloom)
    noise.category.ts      # tone-tinted grain overlays
  effects.matrix.ts        # cross-product builder: for each tone × category → tokens
  effects.types.ts         # ToneName, EffectCategory, MatrixCell types
```

The foundry build already emits `primitives.css` → `semantics.css`. Add `effects.css` between them, generated from `effects.matrix.ts`:

```text
src/domains/theme/tokens/
  primitives.css   (generated, unchanged)
  effects.css      (generated, NEW — one section per category, one row per tone)
  semantics.css    (authored, thinned — role aliases only, no tone-scoped copies)
  brands.css       (generated, unchanged)
```

`tokens.css` imports in order: primitives → effects → semantics → brands.

### Backgrounds (top layer)

New `background.category.ts` emits ambient page washes that live at the shell root, not scoped per domain:

- `--fx-background-base` — the neutral app canvas (currently spread across `--surface-deep`, `--surface`, `--surface-raised` — those stay but the shell reads `--fx-background-base`).
- `--fx-background-bloom-<tone>` — a large soft radial-gradient bloom keyed off the active brand or the currently focused domain, applied to `<body>` or `<AppShell>` as `background-image`. Swappable via a single data-attribute on the shell.
- `--fx-background-grain` — noise overlay layer.

The `top-bar`, `bottom-bar`, `left-rail`, `right-panel` all read the same background tokens — no component re-declares surface colors.

### Component migration

Every existing component that currently declares `--tooltip-bg-*`, `--rail-tone`, `--rail-glass`, `--rail-shadow`, etc. changes to read the matrix:

- Tooltip drops the entire `--tooltip-bg-<tone>` / `--tooltip-glass-<tone>` / `--tooltip-edge-<tone>` blocks in `semantics.css`. Its variant recipe sets `[--tone:<tone>]` once and the CSS reads `var(--fx-glass-<tone>)`, `var(--fx-edge-<tone>)`, etc.
- LeftRail row keeps the `--tone` local var but stops synthesizing shadows/sheens inline in `toneStyle()`. Instead it reads `var(--fx-halo-<tone>)`, `var(--fx-sheen-<tone>)`, `var(--fx-glow-<tone>)` directly.
- Any future primitive (button, popover, menu, dialog, toast, badge, tab) uses the same pattern — pick a tone, read from the matrix.

### WCAG / WAI-ARIA compliance pass

- Every tone × surface pairing gets a contrast check baked into the foundry build (fail the build if the tone's `--fx-ink-*` pair on `--fx-glass-*` drops below 4.5:1 for body / 3:1 for large text). Uses culori's contrast math already in the foundry.
- `--fx-ring-focus` is a distinct token (not brand) so focus-visible is always high-contrast against any tone surface.
- Motion tokens gain a `motion-reduce` mirror: `--fx-motion-*-reduced` = `0ms` / `linear`, and utilities respect `prefers-reduced-motion` automatically.
- All interactive primitives keep `.tap-target` (min 4rem).

### Deliverables (Track A)

1. New effects source files + matrix builder + types.
2. Regenerated `effects.css` (added to `tokens.css` import chain).
3. Thinned `semantics.css` (removes per-domain tone token spam).
4. Tooltip + LeftRail migrated to the matrix (behavior identical, tokens sourced centrally).
5. Foundry build extended with contrast assertion + a docs page (`src/domains/theme/foundry/readme.md` addendum) showing the tone×category grid.

---

## Track B — RAC Presentation/Lesson Template Library

### Goal

A set of owned RAC template components under `src/domains/slide-catalog/templates/` that accept **content as a typed prop** and render fully interactive, touchscreen-ready slides. Each template is fluid XY (rem + `fluid()` / `fluidY()`), reads only from the effects matrix (Track A), and is WAI-ARIA correct via RAC.

### Template catalog (v1)

| Template            | Content prop shape                                                    | Interactions                                                    |
| ------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------- |
| `TitleTemplate`     | `{ kicker?, title, subtitle?, tone }`                                 | none (hero)                                                     |
| `BulletsTemplate`   | `{ title, tone, bullets: {id, label, detail?}[] }`                    | tap/keyboard-reveal per bullet, RAC `ListBox` selection         |
| `ComparatorTemplate`| `{ title, left, right, criteria: {label, leftValue, rightValue}[] }`  | RAC `ToggleButton` per criterion to highlight side              |
| `StatsTemplate`     | `{ title, stats: {value, label, tone}[] }`                            | tap-to-flip card (RAC `ToggleButton`) for detail                |
| `TimelineTemplate`  | `{ title, milestones: {when, label, detail}[] }`                      | RAC `Slider` for scrubbing, tap milestone → expand              |
| `QuizTemplate`      | `{ prompt, options: {id, label, correct?}[], mode: "single"\|"multi"}`| RAC `RadioGroup`/`CheckboxGroup`, reveal on submit              |
| `CalloutTemplate`   | `{ tone, title, body, cta? }`                                         | optional RAC `Button` CTA                                       |
| `MediaTemplate`     | `{ title?, src, alt, caption?, hotspots?: {x,y,label}[] }`            | RAC `Tooltip` on each hotspot                                   |
| `DiagramTemplate`   | `{ nodes, edges, activeId? }`                                         | RAC `Focusable` nodes, tap→highlight, keyboard walk             |
| `CodeTemplate`      | `{ title, language, code, highlights?: number[] }`                    | none (readonly), copy button via RAC `Button`                   |

Each template:
- Lives at `src/domains/slide-catalog/templates/<name>/<name>.tsx` + `.types.ts` + `.variants.ts` + `readme.md`.
- Accepts `tone: ToneName` prop → sets `[--tone:<tone>]` once → reads matrix tokens.
- Accepts `density: "comfy" | "compact"` → drives fluid scale + card min-heights per the slides-app density budget.
- Uses `SlideFrame` as its outer container (already exists).
- Ships example usage in its `readme.md`.

### Author ergonomics

A slide file becomes pure data:

```tsx
// src/episodes/ep-000-template/slides/05-comparator.slide.tsx
import { ComparatorTemplate } from "@/domains/slide-catalog/templates/comparator/comparator";

export default function Slide() {
  return (
    <ComparatorTemplate
      tone="cyan"
      title="GB10 vs Desktop"
      left={{ label: "GB10 Cluster", tone: "cyan" }}
      right={{ label: "Single Workstation", tone: "magenta" }}
      criteria={[
        { label: "Throughput",  leftValue: "4.2x", rightValue: "1x"   },
        { label: "Latency P99", leftValue: "38ms", rightValue: "112ms"},
      ]}
    />
  );
}
```

No custom markup, no per-slide styling, no per-slide color decisions — the tone prop drives every visual state through the effects matrix.

### Touchscreen guarantees

- Every interactive element is min 4rem via `.tap-target` at the primitive level.
- Hit targets are edge-anchored (top/bottom/side padding rails) — nothing critical in center bottom where thumbs sit.
- `usePinchZoom` + `useSwipeNav` hooks (already present) are wired into every template that has zoomable/swipeable content.
- `hover:` effects are duplicated on `data-[pressed]` / `data-[focus-visible]` so touch and keyboard get parity with mouse.

### Deliverables (Track B)

1. `src/domains/slide-catalog/templates/` scaffolding with the 10 templates above (start with `Title`, `Bullets`, `Comparator`, `Stats`, `Callout` in first pass; queue the rest).
2. Shared `template.types.ts` with `ToneName`, `Density`, and a discriminated union of all template prop shapes for router-driven or JSON-driven decks later.
3. `src/domains/slide-catalog/readme.md` updated with the template catalog table.
4. One demo episode (`src/episodes/ep-001-template-showcase/`) that renders every template once so regressions are visible.

---

## Technical notes

- **Zero shadcn / Radix / CVA** — RAC + tailwind-variants only, per project memory.
- **Zero breakpoints** — every size uses `fluid()` / `fluidY()` from the fluid domain.
- **Zero raw hex/rgb** — everything reads matrix tokens; the matrix is OKLCH end-to-end.
- **Zero per-domain color declarations** — components ship a `tone` prop and consume `--fx-*-<tone>` from CSS. `semantics.css` shrinks; `effects.css` (generated) grows.
- **No backend, no Cloud, no auth** — presentation library is local-only per project scope.
- **Named exports only, kebab-case files, WAI-ARIA via RAC** — enforced by existing UI-primitive rules.
- **Build gates**: foundry contrast check on tone×surface pairs; typecheck on the discriminated template prop union so misconfigured slides fail at build.

## Order of execution (once approved)

1. Track A steps 1–3 (matrix + effects.css + thinned semantics) — no visible change.
2. Track A step 4 (migrate Tooltip + LeftRail) — visible parity check.
3. Track A step 5 (contrast gate + docs).
4. Track B first-pass templates (`Title`, `Bullets`, `Comparator`, `Stats`, `Callout`) + showcase episode.
5. Track B remaining templates (`Timeline`, `Quiz`, `Media`, `Diagram`, `Code`).

Each step ends with a typecheck + visual check in the running preview.
