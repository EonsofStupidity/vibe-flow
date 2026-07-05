# Shell Domain

Workspace chrome: top bar, left rail, right overlay panel, bottom status bar,
and full-bleed toggle. Deck runtime routes bypass the shell (they render
directly under `__root`).

## Layout

```
┌─────────────── TopBar (banner) ───────────────┐
│                                                │
│ LeftRail │       Content (measured)   │ Right  │
│ (nav)    │                            │ Panel  │
│          │                            │(overlay)│
├─────────── BottomBar (contentinfo) ────────────┤
```

- **TopBar**: brand switcher (`eos` / `news` / `vibes`), title, full-bleed toggle.
- **LeftRail**: collapsed 4rem ↔ expanded 8.4375rem (135px). Persists.
- **BottomBar**: measured viewport + shortcut hints.
- **RightPanel**: slide-out overlay (does not push content). Tabs: notes, queue, inspector, data.
- **FullbleedExit**: shown only when `fullBleed = true`; Esc also exits.

## Keyboard

`[` toggle left · `]` toggle right · `\\` toggle full-bleed · `Esc` exit full-bleed.
Skipped when focus is inside an editable target.

## Sizing

`ShellSizeProvider` wraps the shell. The content `<main>` element gets a
`ResizeObserver`. Children read the inner rect with `useShellSize()`:

```tsx
const { width, height, dpr } = useShellSize();
```

## State

`useShellStore` (zustand). Persisted through valibot-validated
`shell.persist` — corrupt state resets to defaults.

## Files

```
shell/
  components/
    app-shell/         # frame + observer wiring
    top-bar/           # banner
    left-rail/         # collapsible nav
    bottom-bar/        # status
    right-panel/       # overlay tabs (RAC)
    fullbleed-exit/    # corner affordance
  context/
    shell-size.context.tsx
    useShellSize.ts
  hooks/
    useShellKeyboard.ts
  state/
    shell.store.ts
    shell.persist.ts
  types/
    shell.types.ts
```
