# Toolbar

Owned wrapper over `react-aria-components`' `Toolbar` + `Group`. Provides
`Toolbar` and `ToolbarGroup` exports. No styling opinions — the caller
brings layout classes; the primitive gives WAI-ARIA `toolbar` + `group`
roles and arrow-key navigation for free.

```tsx
import { Toolbar, ToolbarGroup } from "@/domains/ui/Toolbar/Toolbar";
import { Button } from "@/domains/ui/Button/Button";

<Toolbar aria-label="Runtime controls" className="flex items-center justify-between">
  <ToolbarGroup className="flex items-center gap-3">
    <Button shape="icon" aria-label="Home">…</Button>
  </ToolbarGroup>
</Toolbar>
```
