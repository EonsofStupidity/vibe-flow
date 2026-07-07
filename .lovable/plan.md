# Step 2 — Step-aware routes + deck-sync service

Wire the URL `$stepIndex` segment into the runtime, add a presenter surface, and mirror both via BroadcastChannel. No content primitives yet — this step only proves the routing/nav/sync spine.

---

## 1. Routes

### 1a. Redirect old route → step 0
`src/routes/deck.$deckId.$slideIndex.tsx` becomes redirect-only:
- On match, `throw redirect({ to: "/deck/$deckId/$slideIndex/$stepIndex", params: { deckId, slideIndex, stepIndex: "0" }, replace: true })` from `beforeLoad`.
- Keeps existing deep links alive; audience always lives on the step-aware URL.

### 1b. New audience route
`src/routes/deck.$deckId.$slideIndex.$stepIndex.tsx`:
- `beforeLoad` validates deck exists (`getDeck`) and clamps `slideIndex`/`stepIndex`; on mismatch, `throw redirect(...)` to the clamped canonical URL.
- Renders `<DeckHost deck slideIndex stepIndex />`.

### 1c. New presenter route
`src/routes/present.$deckId.$slideIndex.$stepIndex.tsx`:
- Same `beforeLoad` clamp logic.
- Renders new `<PresenterHost deck slideIndex stepIndex />` — a distinct component under `src/domains/deck/components/presenter-host/`. Chapter 1 landing content deferred to step 5; this step ships a minimal shell (current slide scaled, upcoming-reveals list from `slide.reveals`, script placeholder, timer stub). No MDX yet.
- Kept outside `_shell`, full-bleed, mirrors audience deep-link semantics.

Route path uses `/present/...` per plan; no `?mode=` flag.

---

## 2. `DeckHost` updates

- Accept `stepIndex: number` prop; drop the hardcoded `stepIndex: 0` in `ctx`.
- `go(nextSlide, nextStep = 0)` navigates to `/deck/$deckId/$slideIndex/$stepIndex`.
- New `goStep(stepIndex)` navigates within the current slide.
- Prev/next handlers become step-aware via a new pure helper `advanceStep`/`retreatStep` in `deck-nav.service.ts`:
  - Next: if `stepIndex < reveals.length - 1` → `goStep(stepIndex+1)`; else → next slide, step 0.
  - Prev: mirror; when retreating into a slide with reveals, land on its last step.
- `↑`/`↓` (added to `useKeyboardNav`) skip the whole slide regardless of steps.

`deck-nav.service.ts` gains:
```ts
stepCount(slide): number      // reveals?.length ?? 1
advance({ index, step, deck }): { index; step }
retreat({ index, step, deck }): { index; step }
```
Pure, unit-testable. `DeckHost` calls them; no math in the component.

---

## 3. Input hook extensions

- `useKeyboardNav`: add `onSlidePrev`/`onSlideNext` for `↑`/`↓`; existing `←/→/PageUp/PageDown/Space` become the step-aware pair. No breaking rename — same option keys, meaning updated by what `DeckHost` passes in.
- `useSwipeNav`: unchanged (horizontal swipes map to onPrev/onNext, which are now step-aware in `DeckHost`).
- `EdgeNav`: `canPrev`/`canNext` computed from `advance/retreat` result vs current position so edge chevrons dim only at true deck ends.

---

## 4. `deck-sync.service.ts` (new)

`src/domains/deck/services/deck-sync.service.ts` — thin BroadcastChannel wrapper.

Shape:
```ts
interface DeckSyncMessage {
  deckId: string;
  slideIndex: number;
  stepIndex: number;
  origin: "audience" | "presenter";
  ts: number;
}
export function createDeckSyncChannel(deckId: string): {
  post(msg: Omit<DeckSyncMessage, "ts" | "deckId">): void;
  subscribe(fn: (msg: DeckSyncMessage) => void): () => void;
  close(): void;
};
```
- One channel per deck: `new BroadcastChannel(`deck:${deckId}`)`.
- SSR-safe: guarded by `typeof window` / `typeof BroadcastChannel` checks; returns a no-op impl on server.
- No leader election — receivers apply if `ts` newer than last-applied.

New hook `src/domains/deck/hooks/useDeckSync.ts`:
- Args: `{ deckId, slideIndex, stepIndex, origin }`.
- Effect posts on every position change.
- Effect subscribes and calls `navigate({ to, params, replace: true })` when an incoming message differs from current URL.
- Ignores own messages by comparing `origin` + skipping when incoming matches current.

Wired into both `DeckHost` and `PresenterHost`.

---

## 5. Slide-navigator + progress rail

- `SlideNavigator` "go" click already calls `go(i)` — update to include `stepIndex: 0`.
- `ProgressRail` unchanged (slide-level only). Step ticks deferred to Step 4 when a real reveal-bearing slide exists.

---

## 6. ArkType at the route edge

Existing schemas from Step 1 are not needed here (nothing authored is parsed yet). Route params stay string→number with clamp. ArkType comes back in Step 5 (MDX frontmatter) and Step 4 (quiz).

---

## 7. Non-goals for this step

- No MDX, no script loading, no slide-preview hover card.
- No new content primitives.
- No changes to episode manifests — existing decks (ep-000, ep-001) keep working because `reveals` is optional; `stepCount` returns 1 and step-aware nav collapses to slide-only nav.
- No presenter timer logic beyond a `useState` mm:ss counter; polished timer in later step.

---

## 8. File changes

**New**
- `src/routes/deck.$deckId.$slideIndex.$stepIndex.tsx`
- `src/routes/present.$deckId.$slideIndex.$stepIndex.tsx`
- `src/domains/deck/components/presenter-host/presenter-host.tsx`
- `src/domains/deck/components/presenter-host/readme.md`
- `src/domains/deck/services/deck-sync.service.ts`
- `src/domains/deck/hooks/useDeckSync.ts`

**Edited**
- `src/routes/deck.$deckId.$slideIndex.tsx` — redirect-only `beforeLoad`
- `src/domains/deck/components/deck-host/deck-host.tsx` — accept `stepIndex`, step-aware nav, sync hook
- `src/domains/deck/services/deck-nav.service.ts` — add `stepCount`/`advance`/`retreat`
- `src/domains/input/hooks/useKeyboardNav.ts` — add `↑`/`↓` slide-skip handlers
- `src/domains/deck/components/slide-navigator/slide-navigator.tsx` — include `stepIndex: "0"` in nav params
- `.lovable/plan.md` — mark Step 2 complete once landed

---

## 9. Verification

- `bun run build` green.
- Manual: open `/deck/ep-001-catalog-showcase/0` → auto-redirect to `/deck/.../0/0`. Arrow keys still advance slides (no reveals → step-aware = slide-aware). Open `/present/.../0/0` in a second tab → advancing on either surface mirrors the other via BroadcastChannel.
- Playwright smoke: script to open audience URL, press ArrowRight twice, assert URL is `/deck/ep-001-catalog-showcase/2/0`.

---

## Open confirmation

- Presenter route path: `/present/$deckId/$slideIndex/$stepIndex` — OK, or prefer `/teleprompter/...`?
- Should the old `/deck/$deckId/$slideIndex` URL 301-style redirect (as planned) or be removed entirely? (Recommend redirect — no cost, keeps any bookmarks alive.)
