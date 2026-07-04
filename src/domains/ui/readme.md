# DevPULSE Labs UI Primitives

Owned, thin wrappers around [React Aria Components](https://react-spectrum.adobe.com/react-aria/components.html).
No shadcn, no Radix, no re-exports.

## Rules

- One folder per primitive: `xxx.tsx` + `xxx.types.ts` + `xxx.variants.ts` + `readme.md`.
- Lowercase kebab-case files and folders. React component symbols stay PascalCase.
- Named exports only. Consumers import from the primitive folder directly:
  `import { Button } from "@/domains/ui/button/button"`.
- WAI-ARIA compliance comes from RAC. Do not re-implement roles or keyboard
  handling.
- Interactive primitives enforce `.tap-target` (min 4rem / 64px) via `tailwind-variants`
  base class — not left to callers.
- Styling reads only from **semantic** tokens (`bg-surface`, `text-ink`,
  `bg-brand`, `ring-focus-ring`, …). Never from primitive tokens
  (`--amber-500`) directly.
- Style RAC state via the `data-*` selectors RAC emits (`data-hovered`,
  `data-focus-visible`, `data-pressed`, `data-selected`, `data-disabled`).

## Catalog (v1)

| Primitive     | RAC component(s)                              | Status  |
| ------------- | --------------------------------------------- | ------- |
| Button        | `Button`                                      | shipped |
| ToggleButton  | `ToggleButton`                                | shipped |
| Toolbar       | `Toolbar`, `Group`                            | shipped |

## Reserved (build on demand)

Dialog · Menu · Tabs · Popover · Tooltip · ListBox · Select · ComboBox ·
Slider · Switch · Checkbox · RadioGroup · TextField · NumberField ·
ProgressBar · Separator
