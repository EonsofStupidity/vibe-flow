# EOS Episode Template — ep-002 "Truly, What is AI?"

This episode doubles as the reference template for every future EOS lesson. We build only what chapter 1 needs first, then grow the catalog chapter-by-chapter — no speculative primitives.

---

## 1. Content spine (locked, drives everything)

Chapters (each = 1 title slide + N content slides + 1 recap quiz):

1. **Evolution 2023 → 2026** — scrub timeline reveal
2. **AI is autocomplete** — origin story from phone keyboard suggestions
3. **The black box** — even the creators don't fully know
4. **Frontier vs local LLM** — comparator with reveals
5. **Fundamentals** — tensors, weights, KV-cache

Chapter 1 is the template proof. Chapters 2–5 reuse the same shapes and only introduce a new primitive when the chapter genuinely needs one.

---

## 2. Episode folder shape (`src/episodes/ep-002-fundamentals-of-ai/`)

```text
ep-002-fundamentals-of-ai/
  episode.ts                    ArkType-validated Episode manifest, registers both decks
  episode.types.ts              ArkType schemas → inferred types
  script/
    ch01-evolution.mdx          per-slide MDX beats (frontmatter validated)
    ch01-s01-hook.mdx
    ...
  slides/
    ch01-s00-title.slide.tsx
    ch01-s01-timeline.slide.tsx
    ...
  quiz/
    ch01-recap.quiz.ts          ArkType-validated QuizDefinition
  assets/                       episode-owned imagery (no shared dumping ground)
```

One episode owns one folder. No cross-episode imports. Script MDX and slide TSX both key off a shared `slideId` string.

---

## 3. Requirements & vars we lock now (the template contract)

These become the official EOS episode requirements. Encoded in ArkType so drift is a build error.

### 3.1 Episode manifest
- `id` — kebab, matches folder
- `property` — `"eos" | "news" | "vibes"` (drives `data-brand`)
- `chapter[]` — ordered list of chapter records
- `chapter.recap` — required `QuizDefinition` reference
- `decks` — auto-derived: `audience` + `presenter` (share the same slide list, differ in chrome)

### 3.2 Slide contract (extension of existing `SlideDefinition`)
- `id` — episode-unique
- `chapterId` — required for EOS slides
- `kind` — existing `title | still | comparator | custom`
- `reveals?: readonly RevealStep[]` — new. Ordered, addressable via URL step index
- `script?: { file: string; beats: readonly string[] }` — links slide → MDX + beat ids
- `allowAnnotate?`, `chrome?` — unchanged

### 3.3 Reveal step
- `id` — slide-unique beat id (matches MDX beat)
- `label` — human name for presenter view
- `tone?: ToneName` — drives halo/glow via effects matrix

Reveal state lives entirely in the URL (`$stepIndex`). Minigame transient state (card flip mid-animation, drag position, quiz picks) lives in Jotai atomFamily keyed by `slideId`.

### 3.4 Quiz definition
- 2–3 questions per recap, `single | multi` select
- `explanation` per question (rendered post-answer, not persisted)

All four schemas defined in `src/domains/deck/types/*.ark.ts` using ArkType, with inferred TS types exported alongside. No parallel Zod copies.

---

## 4. Runtime routes

### Existing
- `/deck/$deckId/$slideIndex` — keep as **audience** route, redirect to step 0 on mount if slide has reveals

### New
- `/deck/$deckId/$slideIndex/$stepIndex` — audience with explicit step
- `/present/$deckId/$slideIndex/$stepIndex` — **presenter/teleprompter** surface. Renders:
  - current slide (scaled down)
  - upcoming reveals list
  - script beats from linked MDX (long-form teleprompter column)
  - timer + next-slide preview

Both routes live outside `_shell` (full-bleed, as today). Presenter route is its own file, not a `?mode=` flag — keeps preloading and bundle boundaries clean.

### BroadcastChannel sync
- New `src/domains/deck/services/deck-sync.service.ts` — thin BroadcastChannel wrapper posting `{ deckId, slideIndex, stepIndex }` on nav. Both routes subscribe and mirror.
- No leader election — presenter is authoritative when both surfaces open; audience follows.

---

## 5. Keyboard / touch nav (extended)

Existing `useKeyboardNav` / `useSwipeNav` / edge-nav gain step-awareness:
- `→` / swipe-left: if `stepIndex < reveals.length - 1` → next step, else next slide (step 0)
- `←` / swipe-right: mirror
- `↓` / `↑`: skip whole slide regardless of steps
- All controls stay ≥ 4rem tap targets, edge-anchored, `data-no-swipe` on interactive surfaces

---

## 6. First-batch primitives (only what chapter 1 needs today)

Under `src/domains/slide-catalog/primitives/`, same split-file pattern (`.tsx`, `.types.ts`, `.variants.ts`, `readme.md`), tone-driven via `toneVars(tone)`, WAI-ARIA APG compliant.

**Ship in this plan:**
1. `reveal-timeline` — horizontal scrub timeline (chapter 1). RAC `Slider` wrapper required → also ship `src/domains/ui/slider/` as an owned RAC primitive.
2. `tap-reveal-cards` — grid of face-down cards, tap flips. Uses existing `ToggleButton` + tone matrix. Needed chapter 2.
3. `quiz-recap` — 2–3 question inline quiz with post-answer explanation. Requires new `src/domains/ui/radio-group/` RAC wrapper.

**Deferred (added as their chapter arrives):**
- `hotspot-quiz` — chapter 2/3
- `sort-rank` — TBD chapter
- Any variant we haven't proven we need

Each new primitive lands with a readme that documents props, tone behaviour, and touchscreen tap-target math.

---

## 7. MDX pipeline

- Add `@mdx-js/rollup` + `@mdx-js/react` (Vite plugin).
- MDX files under `script/` compile to lazy React components; presenter route dynamically imports the file listed on the slide's `script.file`.
- Frontmatter validated at build time via a tiny `src/domains/deck/services/script-loader.service.ts` that runs the ArkType `ScriptFrontmatter` schema and throws a legible error naming the file + beat.
- No MDX in audience bundle — code-split so audience deck stays lean.

---

## 8. Auto-growing hover previews

Requested "clean mouse over previews, optimized, no zod". Delivered via:
- Existing `Tooltip` primitive already tone-driven and glass-morphic (previous track).
- New `src/domains/deck/components/slide-preview/` — hover/long-press card that renders the target slide inside a `transform: scale(...)` container capped to a rem width, lazy-mounted with `RAC TooltipTrigger`, cached per slide id.
- Used by presenter route's "upcoming reveals" list and by `SlideNavigator` (existing) so it grows automatically as the deck grows.

---

## 9. Validation & non-goals

- ArkType schemas cover: episode manifest, slide definition, reveal step, script frontmatter, quiz definition. Zero Zod.
- No Cloud, no auth, no server functions. Pure local runtime. Episode assets ship in the bundle.
- No responsive breakpoints — everything through existing `fluid()` tokens.
- No shadcn / Radix / CVA. Owned RAC only.
- No re-export barrels; `src/episodes/index.ts` stays the single side-effect enumerator.

---

## 10. Implementation order (single build session at a time)

Each step lands independently, builds green, and is reviewable before the next.

1. **Schemas & types** — ArkType schemas + `SlideDefinition` extension (reveals, script, chapterId). No behavior change yet.
2. **Step-aware routes + deck-sync service** — new route file, redirect old route, BroadcastChannel wrapper, nav hooks step-aware.
3. **Owned RAC primitives** — `slider`, `radio-group` under `src/domains/ui/` with readmes.
4. **Content primitives** — `reveal-timeline`, `tap-reveal-cards`, `quiz-recap` in slide-catalog.
5. **MDX pipeline + script-loader** — vite plugin, ArkType frontmatter gate, presenter route wires it up.
6. **Slide-preview hover card** — hooked into presenter's reveal list and existing `SlideNavigator`.
7. **ep-002 chapter 1** — title slide + timeline slide + recap quiz + MDX beats. Full end-to-end walk on touchscreen + projector.
8. **Chapters 2–5** — one PR-sized chunk each, promoting a new primitive only when that chapter demonstrably needs it.

After step 7 the template contract is proven; steps 8+ are content authoring against a stable framework.

---

## Open confirmations before I switch to build mode

- Are you good adding `arktype`, `@mdx-js/rollup`, `@mdx-js/react` as deps? (No other new deps required.)
- Presenter route path — `/present/$deckId/$slideIndex/$stepIndex` OK, or prefer `/teleprompter/...`?
- Chapter 1 title — I'll use "Evolution 2023 → 2026" unless you have exact wording.