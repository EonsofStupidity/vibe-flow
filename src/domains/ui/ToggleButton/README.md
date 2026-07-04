# ToggleButton

Owned wrapper over `react-aria-components`' `ToggleButton`.

Controlled with `isSelected` / `onChange`. Selected state applies the
`primary` tone via `data-[selected]`.

```tsx
import { ToggleButton } from "@/domains/ui/ToggleButton/ToggleButton";

<ToggleButton isSelected={on} onChange={setOn} aria-label="Annotate">
  <PenLine className="h-6 w-6" />
</ToggleButton>
```
