# ToggleButton

Two-state RAC toggle. `data-selected` swaps to the active brand color.

```tsx
import { ToggleButton } from "@/domains/ui/toggle-button/toggle-button";

<ToggleButton shape="icon" isSelected={isOn} onChange={setIsOn} aria-label="Toggle annotate">
  <PenIcon />
</ToggleButton>
```
