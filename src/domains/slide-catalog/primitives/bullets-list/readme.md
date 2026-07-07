# BulletsList

Tone-driven, keyboard-navigable bullet list. Each bullet toggles on tap /
Space / Enter. Reads the effects matrix by tone — no color logic in the
primitive.

```tsx
import { BulletsList } from "@/domains/slide-catalog/primitives/bullets-list/bullets-list";

<BulletsList
  tone="cyan"
  title="What ships in v1"
  bullets={[
    { id: "a", label: "Owned RAC primitives",     detail: "Button, Tooltip, ToggleButton, Toolbar." },
    { id: "b", label: "Effects matrix (tone × cat)", detail: "180 cells, one file to grow." },
    { id: "c", label: "Content-driven slides",    detail: "Data in, interactive slide out." },
  ]}
/>
```

## Props

- `tone` — `ToneName` from `../types`. Defaults to `neutral`.
- `density` — `comfy | compact`. Defaults `comfy`.
- `bullets` — `{ id, label, detail? }[]`.
- `selectedIds` / `onSelectionChange` — controlled selection. Uncontrolled when omitted.
- `multi` — allow multi-select. Defaults `true`.

## Accessibility

- Wraps every trigger in RAC `<Focusable>` so `data-hovered` / `data-focus-visible` / `data-pressed` state selectors resolve.
- `role="listbox"` + `aria-multiselectable` for multi, `role="radiogroup"` + `role="radio"` for single-select.
- Meets `.tap-target` 4rem minimum on every bullet button.
