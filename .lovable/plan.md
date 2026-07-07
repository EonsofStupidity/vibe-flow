## Problem

Clicking/pressing Next in `ep-001-catalog-showcase` crashes during TanStack hydration with:

`Expected to find a dehydrated data on window.$_TSR.router`

The current deck route `beforeLoad` returns the full `deck` object in route context. That object contains slide definitions with `render` functions/React component closures, which are not serializable through TanStack Start SSR dehydration. Initial page load can appear to work, but client navigation to the next slide trips the dehydration path and blanks the surface.

## Fix plan

1. **Make deck routes return only serializable route context**
   - Update `/deck/$deckId/$slideIndex/$stepIndex` so `beforeLoad` validates/clamps using `getDeck`, but returns only `{ deckId, index, step }`.
   - Update `/present/$deckId/$slideIndex/$stepIndex` the same way.
   - Resolve the actual `deck` inside the route component from `deckId` with `getDeck`.
   - Keep `notFound()` for impossible missing deck cases.

2. **Keep TanStack route generation automatic**
   - Do **not** manually edit `src/routeTree.gen.ts`.
   - Leave route registration driven by the existing route files only.
   - If generated route state is stale, rely on the Vite/TanStack plugin refresh, not hand-written route-tree changes.

3. **Add route-local error/not-found boundaries only where needed**
   - Since these routes throw `notFound()`/`redirect()` in `beforeLoad`, add small route-local `errorComponent` and `notFoundComponent` for deck/presenter surfaces so failures don’t fall through to a blank shell.
   - Keep them minimal and within the deck route files.

4. **Verify the exact crash path**
   - Re-run the browser reproduction at `/deck/ep-001-catalog-showcase/0/0`.
   - Press/click Next and confirm URL advances to `/deck/ep-001-catalog-showcase/1/0`.
   - Confirm page body renders the StatsGrid slide and no hydration invariant/page errors fire.
   - Also sanity-check direct load of both `ep-000-template` and `ep-001-catalog-showcase` canonical URLs.

## Files to touch

- `src/routes/deck.$deckId.$slideIndex.$stepIndex.tsx`
- `src/routes/present.$deckId.$slideIndex.$stepIndex.tsx`

No database, no backend, no unrelated slide-catalog/theme changes.