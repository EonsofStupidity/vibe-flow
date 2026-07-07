# Fix: slides won't open (ERR_TOO_MANY_REDIRECTS)

## Diagnosis

Clicking a deck on the landing page never loads a slide. Repro via direct navigation confirms `net::ERR_TOO_MANY_REDIRECTS` on `/deck/ep-000-template/0`.

Root cause is in the generated route tree. Because both files exist:

- `src/routes/deck.$deckId.$slideIndex.tsx` (legacy redirect)
- `src/routes/deck.$deckId.$slideIndex.$stepIndex.tsx` (canonical)

TanStack's flat-dot router treats the shorter filename as the **parent layout** of the longer one. From `routeTree.gen.ts`:

```
'/deck/$deckId/$slideIndex/$stepIndex': {
  id: '/deck/$deckId/$slideIndex/$stepIndex'
  path: '/$stepIndex'                       // ← child of the legacy route
```

So every match of the 3-segment canonical URL first runs the legacy route's `beforeLoad`, which unconditionally throws `redirect({ to: '/deck/$deckId/$slideIndex/$stepIndex', params: { ...params, stepIndex: "0" } })`. The redirect target re-matches the same parent → same redirect → loop.

Both `/deck/:id/0` (legacy shape, hit by the landing `<Link>` and the SlideNavigator) and `/deck/:id/0/0` (canonical shape) fall into this loop, which is why nothing opens from either episode.

## Fix

Convert the legacy file into an **index leaf** so it stops being the parent of the canonical route:

1. Rename `src/routes/deck.$deckId.$slideIndex.tsx` → `src/routes/deck.$deckId.$slideIndex.index.tsx`.
2. Change its `createFileRoute("/deck/$deckId/$slideIndex")` to `createFileRoute("/deck/$deckId/$slideIndex/")` (trailing slash marks it as index).
3. Leave the redirect body unchanged — visiting the exact 2-segment URL still bounces to `.../0`, and the canonical 3-segment route is now a sibling leaf, not a child, so it renders without the parent's `beforeLoad` firing.

No other files change. `SlideNavigator`, `_shell.index`, and both hosts keep working (their links are typed against the still-existing legacy path or the canonical path).

## Verification

- `bun run build` produces a clean `routeTree.gen.ts` where the canonical route is no longer nested under the legacy one.
- Playwright: `GET /deck/ep-000-template/0` → 302 → `/deck/ep-000-template/0/0` → renders DeckHost (no loop).
- Manual click from landing on both episode cards opens slide 0 / step 0.

## Notes / non-goals

- Not touching `present.*` routes (no legacy sibling, no loop).
- Not touching the hydration-mismatch warning in `__root.tsx` (`data-tsd-source` line numbers) — separate, non-blocking issue.
