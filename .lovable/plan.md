
# Revised Plan — Aligned Pass

Fresh read of current posture. Findings that reshape the remaining work:

### What changed since the original plan

- Track A steps 1–4 already shipped and verified live. `effects.matrix.ts` + generated `effects.css` are in place; `tooltipVariants` and left-rail `toneStyle()` consume `--fx-<cat>-<tone>` pass-throughs; the tooltip token spam in `semantics.css` is gone.
- `culori@^4.0.2` (+ `@types/culori`) is already a dependency — no install needed for the contrast gate.
- `foundry.types.ts` already carries typed `Ladder` / `Oklch` shapes and `buildLadder()` already enforces the "never pure black" floor. The contrast gate slots in beside those checks.

### Boundary corrections to the earlier plan

The earlier plan drifted from established conventions. Corrections:

1. **Folder is `src/domains/slide-catalog/primitives/`, not `templates/`.** Project memory says "compose from `slide-catalog/primitives/`, promote before reuse." Everything content-driven ships as a new primitive under that same folder.
2. **`SlideDefinition.kind` stays as `"title" | "still" | "comparator" | "custom"`.** New primitives register as `kind: "custom"` — the deck domain is not modified.
3. **Do not touch existing primitives** (`SlideFrame`, `TitleCard`, `CalloutBadge`, `StillZoomable`, `ComparatorPanel`). Per user memory, unsolicited changes to unrelated domain logic are forbidden. New tone-aware content primitives are added alongside them; existing ones keep their current tone system (`neutral | live` / brand-scoped) untouched.
4. **Slide-catalog primitives adopt the split file layout** (`<name>.tsx` + `<name>.types.ts` + `<name>.variants.ts` + `readme.md`) **only for the new ones**. Matches the UI-primitives rule in `src/domains/ui/readme.md`; existing single-file primitives remain as-is.
5. **Interactive state stays Jotai-per-slide** per workspace guidance ("Jotai for feature workflow UI"). Primitives expose optional controlled props; uncontrolled instances use an internal atom scoped by an `id` prop.
6. **`data-no-swipe`** on every zoomable / scrollable / dragged surface so `useSwipeNav` doesn't hijack the gesture (matches `StillZoomable` / `ComparatorPanel`).

---

## Track A — Step 5 (Contrast gate + docs)

### Where it lands
New file `src/domains/theme/foundry/build/transforms/contrast.transform.ts`. Consumed once per build from `build-tokens.ts`, immediately after `validate(built)`.

### What it asserts
Uses `culori.wcagContrast()` against the resolved OKLCH triples the ladder transform already produces:

- **Brand pairs** — for every `BrandBinding`, `ladder[brandStep]` vs `ink-ladder[inkStep]` must meet **WCAG AA large text (3:1)** and be reported for normal text (4.5:1). Hard fail on <3:1.
- **Utility pairs** — `danger` / `warning` / `info` at step 500 vs the configured `--<util>-ink` step. Hard fail on <3:1.
- **Free-accent readout** — every `kind: "accent"` palette at step 500 vs `--ink-strong` is measured and printed to the build log at info level (no fail). This surfaces which accents are safe on light ink without preventing edits.

The gate operates on numeric OKLCH triples — it never has to parse `color-mix()` strings from the matrix. The matrix inherits confidence from the pairs the gate proves.

### Reduced-motion tokens (semantics-only sibling of the matrix)
Add three tokens to `semantics.css` (authored file, single edit):
- `--motion-duration-reduced: 0.01ms;`
- `--motion-ease-reduced: linear;`
- `--motion-transition-reduced: none;`

Existing `motion-reduce:` Tailwind variants keep working; primitives that inline a `[transition:...]` value can read the reduced token behind a `@media (prefers-reduced-motion: reduce)` block in `styles.css`. No component churn — only future primitives use it.

### Docs
Append a "Effects matrix" section to `src/domains/theme/foundry/readme.md` with a rendered tone × category table (generated from `buildEffectsMatrix()` at build time, written to the readme's fenced block — no manual sync).

### Deliverables
1. `contrast.transform.ts` + integration in `build-tokens.ts`.
2. Reduced-motion tokens in `semantics.css`.
3. Readme section auto-emitted by the build.
4. Verified with `bun run tokens` — build must still pass; any real contrast failure is a signal, not something to suppress.

---

## Track B — First-pass content-driven primitives

All under `src/domains/slide-catalog/primitives/`, each in its own folder with the split layout. Every primitive:
- Accepts `tone: ToneName` (imported from `@/domains/theme/foundry/source/effects/effects.matrix`).
- Sets one row of `[--tone-*:var(--fx-*-<tone>)]` locals and reads the matrix — zero color logic in the component.
- Wraps interactive elements in owned RAC primitives (`Button`, `ToggleButton`, `TooltipTrigger`, `Focusable`, or new RAC primitives added as needed).
- Enforces `.tap-target` at every interactive leaf.
- Applies `data-no-swipe` on any surface that owns the gesture.
- Uses `fluid()` / `fluidY()` / rem-based token classes (`p-f5`, `text-h2`, `rounded-f-md`) — never breakpoints, never hex.

### Primitives added (this pass)

| Primitive        | Folder                                | New RAC primitives needed          |
| ---------------- | ------------------------------------- | ---------------------------------- |
| `BulletsList`    | `primitives/bullets-list/`            | none (uses `Focusable` + list markup) |
| `StatsGrid`      | `primitives/stats-grid/`              | none (uses owned `ToggleButton` for flip) |
| `CalloutCard`    | `primitives/callout-card/`            | none (uses owned `Button` for CTA) |
| `MediaHotspots`  | `primitives/media-hotspots/`          | uses `TooltipTrigger` per hotspot  |
| `CodeBlock`      | `primitives/code-block/`              | uses owned `Button` for copy       |

### Primitives deferred to a second pass (need new RAC UI primitives first)

| Primitive   | Blocked on new UI primitive                                          |
| ----------- | --------------------------------------------------------------------- |
| `Timeline`  | `src/domains/ui/slider/` (RAC `Slider`)                              |
| `QuizPoll`  | `src/domains/ui/radio-group/` + `src/domains/ui/checkbox-group/`     |
| `DiagramMap`| `src/domains/ui/focus-ring/` node walker (or reuse `Focusable`)      |

Adding those UI primitives is boundary-clean but doubles the surface area of one pass. Deferring keeps this turn tight; a follow-up turn ships each new UI primitive under `src/domains/ui/<name>/` with `.tsx` + `.types.ts` + `.variants.ts` + `readme.md` then wires the slide-catalog primitive on top.

### Reference episode
New folder `src/episodes/ep-001-catalog-showcase/` renders each new primitive once as a `kind: "custom"` slide, so any regression in tone application, contrast, or interaction is visible immediately. Registered via `registerDeck()` at import time exactly like `ep-000-template`.

### Shared type surface
New `src/domains/slide-catalog/primitives/types.ts` (single flat file, no `types/` folder — matches the domain scope) exporting:
- `ToneName` re-exported from the effects matrix source so slide files import from the slide-catalog domain, not from theme internals.
- `Density = "comfy" | "compact"` — drives per-primitive padding / min-height.
- No discriminated union of prop shapes at this stage. That was speculative in the earlier plan and only pays off once a JSON deck loader exists.

---

## Technical notes (unchanged, re-affirmed)

- RAC only — no shadcn / Radix / CVA.
- `tailwind-variants` for slot/variant recipes.
- OKLCH end-to-end via matrix; no hex/rgb; no per-domain color declarations.
- No breakpoints; `fluid()` / `fluidY()` only.
- Named exports, kebab-case files, hypermodular colocation.
- No re-exports, no shims, no backwards-compat glue.
- `sideEffects: false` respected — every new file is tree-shakeable.
- WAI-ARIA / APG compliance inherited from RAC; nothing hand-rolled.
- No backend, no Cloud, no auth touched.

## Order of execution (once approved)

1. Track A step 5 — contrast gate + reduced-motion tokens + auto-emitted readme table. One typecheck + one `bun run tokens` at the end.
2. Track B first-pass primitives — `BulletsList`, `StatsGrid`, `CalloutCard`, `MediaHotspots`, `CodeBlock` — each with its own readme and one showcase slide.
3. Register `ep-001-catalog-showcase` and verify each primitive renders correctly with three different tones.
4. Report back with the deferred UI-primitive queue (`Slider`, `RadioGroup`, `CheckboxGroup`) so you decide the sequencing for pass two.

Each step ends with a typecheck and a live-preview visual check.
