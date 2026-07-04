# Button

Owned wrapper over `react-aria-components`' `Button`.

## Props

`tone`: `"neutral" | "primary" | "ghost"` — default `neutral`.
`shape`: `"pill" | "square" | "icon"` — default `pill`. Use `icon` for
tap-target-sized icon-only buttons; put the icon as the only child.

All other props forward to RAC `Button` (aria-*, onPress, isDisabled, etc.).

## Usage

```tsx
import { Button } from "@/domains/ui/Button/Button";

<Button tone="primary" onPress={() => save()}>Save</Button>
<Button shape="icon" aria-label="Home"><Home className="h-6 w-6" /></Button>
```
