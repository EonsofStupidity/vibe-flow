# DevPULSE Labs UI Primitives

Owned, thin wrappers around [React Aria Components](https://react-spectrum.adobe.com/react-aria/components.html).
No shadcn, no Radix, no re-exports.

## Rules

- One folder per primitive: `Xxx.tsx` + `Xxx.types.ts` + `Xxx.variants.ts` + `README.md`.
- Named exports only. Consumers import from the primitive folder directly:
  `import { Button } from "@/domains/ui/Button/Button"`.
- WAI-ARIA compliance comes from RAC. Do not re-implement roles or keyboard
  handling.
- Interactive primitives enforce `.tap-target` (min 64px) via `tailwind-variants`
  base class — not left to callers.
- Styling reads only from semantic tokens in `src/domains/theme/tokens.css`.
- Style RAC state via the `data-*` selectors RAC already emits
  (`data-hovered`, `data-focus-visible`, `data-pressed`, `data-selected`,
  `data-disabled`).

## Catalog (v1)

| Primitive     | RAC component(s)                              | Status |
| ------------- | --------------------------------------------- | ------ |
| Button        | `Button`                                      | shipped |
| ToggleButton  | `ToggleButton`                                | shipped |
| Toolbar       | `Toolbar`, `Group`                            | shipped |

## Reserved (build on demand)

Dialog · Menu · Tabs · Popover · Tooltip · ListBox · Select · ComboBox ·
Slider · Switch · Checkbox · RadioGroup · TextField · NumberField ·
ProgressBar · Separator
