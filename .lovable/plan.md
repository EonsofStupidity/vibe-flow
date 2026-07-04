# Eons of Stupidity — Touchscreen Show Runtime

A local-only web app that runs on your large touchscreen as an on-camera prop. Each episode is a code-defined slide deck. Slides mix stills, title cards, and live interactive components. The runtime provides the boring, predictable chrome (nav, zoom, annotate, navigator) so each slide only implements what makes *it* unique.

Security is intentionally out of scope. No auth, no backend, no Lovable Cloud.

---

## Guiding principles (locked in, memory-worthy)

- **Hypermodular, domain-driven, colocated.** No `core/`, no re-exports, no shims, no backwards-compat. Self-describing folders only.
- **Slide API catalog is the contract.** A small, boring, versioned set of primitives every slide composes from. New slide? You reach into the catalog first; you only invent when the catalog doesn't cover it, and then the invention gets promoted into the catalog.
- **Code-defined slides.** Each slide is a TSX module colocated with its assets and its metadata. No JSON manifest, no runtime editor.
- **Touch-first, one-handed.** Controls anchor to edges. Min 64px hit targets. Nothing critical in screen center where a hand would occlude on camera.
- **Named imports everywhere.** The existing named→default import util is honored; nothing bypasses it.
- **WAI-ARIA APG compliant** for every interactive primitive (toolbar, dialog, tabs, slider).
- **Design tokens only.** All color/spacing/type via `src/styles.css` semantic tokens. No hardcoded color utilities in components.

---

## Scope of this first pass

Build the **runtime shell + slide API catalog + one sample episode** with three canonical slide types so the pattern is proven end-to-end. No real Eons content yet — the sample episode is the reference implementation you'll copy from.

**In scope**
1. Runtime shell: deck host, slide viewport, edge nav, progress, navigator overlay, annotate layer, keyboard + touch input.
2. Slide API catalog v1 (primitives listed below).
3. Sample episode `ep-000-template` with three slides:
   - Title card
   - Still with pinch/zoom + pan
   - Comparator widget (Lovable vs local LLM shell — inert placeholder content)
4. Design system tokens + dark editorial theme baseline.
5. Route `/` = deck selector, `/deck/$deckId/$slideIndex` = runtime.

**Out of scope (future turns)**
- Real episode content.
- Recording/OBS integration.
- Persisted annotations.
- Cloud sync.

---

## Folder structure (hypermodular, domain-driven)

```text
src/
  routes/
    __root.tsx
    index.tsx                          # deck picker
    deck.$deckId.$slideIndex.tsx       # runtime host
  domains/
    deck/                              # domain: a deck = ordered slides
      services/
        deck-registry.service.ts       # register/list decks
        deck-navigation.service.ts     # next/prev/jump, guards
      utils/
        slide-index.util.ts
      types/
        deck.types.ts
        slide.types.ts
      components/
        DeckHost/
          DeckHost.tsx
          DeckHost.types.ts
        EdgeNav/
          EdgeNav.tsx                  # left/right tap zones + prev/next
        ProgressRail/
        SlideNavigator/                # thumbnail overlay
    slide-catalog/                     # THE API CATALOG
      primitives/
        SlideFrame/                    # standard chrome wrapper
        TitleCard/
        StillZoomable/                 # pinch/zoom/pan on a still
        ComparatorPanel/               # side-by-side widget frame
        CalloutBadge/
        BigNumber/
        CodeBlockStill/
      services/
        slide-primitive-registry.service.ts
      types/
        primitive.types.ts
      README.md                        # the catalog docs
    annotation/
      components/
        AnnotationLayer/               # canvas overlay
        AnnotationToolbar/
      services/
        ink-stroke.service.ts
      utils/
      types/
    input/                             # touch + keyboard input domain
      services/
        gesture.service.ts             # swipe, pinch, edge-swipe
        keyboard.service.ts
      hooks/
        useSwipeNav.hook.ts
        usePinchZoom.hook.ts
    theme/
      tokens.css                       # imported by src/styles.css
  episodes/
    ep-000-template/
      episode.ts                       # registers deck
      slides/
        01-title.slide.tsx
        02-still.slide.tsx
        03-comparator.slide.tsx
      assets/
        cover.png
  lib/
    named-import.util.ts               # existing helper honored
```

No `core/`. Each domain owns its own `services/`, `utils/`, `types/`, `components/`, `hooks/`. Microservices/utilities colocate under the component or slide that uses them.

---

## Slide API catalog v1 (the boring, predictable part)

Every slide is a TSX module exporting a `SlideDefinition`:

```ts
type SlideDefinition = {
  id: string;                    // stable within deck
  kind: 'title' | 'still' | 'comparator' | 'custom';
  title: string;                 // shown in navigator
  render: (ctx: SlideRenderContext) => ReactNode;
  chrome?: 'default' | 'dim' | 'hidden';
  allowAnnotate?: boolean;       // default true
};
```

Primitives shipped in v1:

| Primitive         | Purpose                                                 |
| ----------------- | ------------------------------------------------------- |
| `SlideFrame`      | Standard padding, safe area, chrome slot                |
| `TitleCard`       | Episode/segment title with eyebrow + subtitle           |
| `StillZoomable`   | Image with pinch/zoom/pan + reset                       |
| `ComparatorPanel` | Two-column labeled panel for A/B demos                  |
| `CalloutBadge`    | Inline emphasis chip                                    |
| `BigNumber`       | Oversized stat with caption                             |
| `CodeBlockStill`  | Static code screenshot with zoom                        |

Each primitive: colocated `.tsx` + `.types.ts` + brief README describing when to reach for it. That README is the API catalog surface.

---

## Runtime behavior

- **Nav:** swipe left/right anywhere non-interactive; tap left/right 15% edge zones; keyboard `←/→`, `Home`, `End`, `G` = navigator.
- **Navigator overlay:** edge-swipe up from bottom OR bottom-corner tap; grid of slide thumbnails; tap to jump.
- **Annotate:** toolbar toggle on right edge; canvas overlay above slide, below chrome; clear-per-slide; not persisted in v1.
- **Zoom stills:** pinch on `StillZoomable`; double-tap resets.
- **Progress rail:** thin bar top edge, non-interactive.
- **Full-bleed mode:** `chrome: 'hidden'` on a slide hides everything; single tap in top-right corner brings chrome back.

---

## Design direction (proposed, one commit)

Because the design-directions tool requires an existing UI screenshot and this is a blank template, I'm proposing a single opinionated direction rather than deferring. If you want three rendered variants, say so and I'll build a placeholder screen first, then re-run directions against it.

**Direction: "Broadcast Console"**
- Deep near-black background `oklch(0.16 0.01 250)`, panels in slightly lifted charcoal, single hot accent in signal amber `oklch(0.78 0.17 75)` reserved for live/active state.
- Display: `Space Grotesk` for titles and eyebrows; body/UI: `Inter Tight`; mono: `JetBrains Mono` for code stills. Loaded via `@fontsource` packages, not CDN.
- Chrome feels like broadcast equipment: thin hairline dividers, subtle beveled panels, tactile buttons with pressed-in states.
- Slide transitions: horizontal panel slide (200ms, custom cubic), not fade.
- Annotate ink: warm off-white with slight weight variance.
- Tokens live in `domains/theme/tokens.css`, imported at top of `src/styles.css`.

---

## Technical notes (for the technical reader)

- TanStack Start file-based routing; runtime route is `/deck/$deckId/$slideIndex`, both are path params (deep-linkable to a slide mid-stream).
- Deck registry is a plain module map (`episodes/*/episode.ts` self-registers via imported side effect from a single `src/episodes/index.ts` barrel — the *only* barrel in the app, and it exists to enumerate decks, not to re-export symbols).
- Gestures via a small custom hook layer over Pointer Events; no heavy gesture dep unless it becomes necessary — decision documented when it happens.
- Annotation uses a plain `<canvas>` sized to the slide viewport; ResizeObserver keeps it in sync.
- Zustand for shell state (current deck, chrome visibility, annotate on/off). Jotai for per-slide widget UI state. TanStack Query not needed yet (no remote data).
- All new imports named. `bun add` is used for any package before its first import.
- Strict TS, no `any`, no re-exports, no shims.

---

## Memories I will save on approval

- **preference:** Hypermodular domain-driven structure; no `core/`, no re-exports, no shims, no backwards-compat. Named imports only.
- **preference:** Boring, predictable slide API catalog is the source of truth; new patterns get promoted into it before reuse.
- **feature:** Runtime is local-only, no auth, no Cloud, touchscreen-first with min 64px hit targets, edge-anchored controls.
- **design:** Broadcast Console direction — near-black bg, signal-amber accent, Space Grotesk / Inter Tight / JetBrains Mono.

---

## What I'd like to confirm before building

1. OK to commit to the "Broadcast Console" direction, or do you want me to stub a screen first and then generate 3 rendered directions against it?
2. Confirm `ep-000-template` as the sample episode name (or pick a different id).
3. Zustand + Jotai split as described, or prefer one of them only for v1?

If you approve as-is, I'll take the three answers as: (1) Broadcast Console, (2) `ep-000-template`, (3) both.
