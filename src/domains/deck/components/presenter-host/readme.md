# presenter-host

Teleprompter surface for a deck. Renders a scaled preview of the current
slide, a jump-list of reveal beats, a script column, and a running timer.
Mirrors position with the audience surface via `useDeckSync` — either
side can drive.

## URL

`/present/$deckId/$slideIndex/$stepIndex` — same shape as the audience
route so keyboard flow, deep links, and BroadcastChannel messages line
up 1:1.

## Notes

- Step 2 ships the shell only. MDX-backed script beats land in step 5.
- Keyboard: ←/→ step-aware, ↑/↓ skip whole slides, matches the audience.
- No annotate layer, no navigator overlay — those live on the audience.
