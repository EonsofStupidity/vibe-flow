# Fix: `/deck/…` still 404s after previous rename

## What happened

The earlier fix converted `deck.$deckId.$slideIndex.tsx` → `deck.$deckId.$slideIndex.index.tsx` so it stopped being the parent of the canonical 3-segment route. That killed the redirect loop (verified: `routeTree.gen.ts` now has both as sibling children of root), but now every `/deck/:id/0/0` returns 404 while the twin `/present/:id/0/0` returns 200.

Repro:
- `curl /present/ep-000-template/0/0` → **200**
- `curl /deck/ep-000-template/0/0` → **404** (root's `NotFoundComponent`)
- `curl /deck/ep-001-catalog-showcase/0/0` → **404**

The only shape difference between the working `present` route and the broken `deck` route is the presence of the sibling `deck.$deckId.$slideIndex.index.tsx` file. Having a `$slideIndex/` index route alongside a `$slideIndex/$stepIndex` route creates a match ambiguity that TanStack resolves in favor of the index leaf, whose `beforeLoad` then throws a redirect to the same 3-seg URL — which re-selects the index leaf — so the router bails out to root not-found.

## Fix — remove the legacy redirect route entirely

The legacy 2-segment URL is only referenced from one place in the codebase (`src/routes/_shell.index.tsx`, the landing page `<Link>`). Nothing external depends on it (no publish, no bookmarks). Cleaner than juggling a redirect sibling.

1. **Delete** `src/routes/deck.$deckId.$slideIndex.index.tsx`.
2. **Update** `src/routes/_shell.index.tsx` — change the deck-card link from
   ```tsx
   to="/deck/$deckId/$slideIndex"
   params={{ deckId: deck.id, slideIndex: "0" }}
   ```
   to
   ```tsx
   to="/deck/$deckId/$slideIndex/$stepIndex"
   params={{ deckId: deck.id, slideIndex: "0", stepIndex: "0" }}
   ```
3. No other consumers exist. `SlideNavigator` already navigates to the 3-segment canonical path. `DeckHost`, `PresenterHost`, and both route files are unchanged.

## Verification

- `bun run build` — clean type check; `routeTree.gen.ts` shows exactly three deck-family leaves: `deck.$deckId.$slideIndex.$stepIndex`, `present.$deckId.$slideIndex.$stepIndex`.
- Playwright: hit `/` → click first deck card → lands on `/deck/ep-000-template/0/0` status 200 with the slide rendered.
- `curl -o /dev/null -w %{http_code} /deck/ep-000-template/0/0` → 200 (both episodes).

## Non-goals

- Not addressing the pre-existing `data-tsd-source` line-number hydration mismatch in `__root.tsx` — unrelated, non-blocking.
- Not changing any deck/slide/service code.
