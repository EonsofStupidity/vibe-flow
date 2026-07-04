# Button

RAC-backed button primitive. Enforces tap-target minimum; tones read semantic
tokens (`bg-surface-raised`, `bg-brand`, `bg-danger`).

```tsx
import { Button } from "@/domains/ui/button/button";

<Button tone="brand" onPress={handleGo}>Go</Button>
<Button shape="icon" aria-label="Open menu"><MenuIcon /></Button>
```

Props extend RAC `ButtonProps` (minus `className`/`style`/`children`) plus
`tone` and `shape` variants.
