# StatsGrid

Tone-driven stat tiles. Cards with a `detail` prop flip on tap to reveal it
via owned `ToggleButton`. Grid uses `auto-fit / minmax(14rem)` — no
breakpoints, no media queries.

```tsx
import { StatsGrid } from "@/domains/slide-catalog/primitives/stats-grid/stats-grid";

<StatsGrid
  tone="magenta"
  title="Where the time goes"
  stats={[
    { id: "a", value: "38ms", label: "P99 first-token",
      detail: "Measured on a GB10 cluster with a 7B quantized model." },
    { id: "b", value: "4.2×",  label: "Throughput vs single node" },
    { id: "c", value: "$0.00", label: "Cost per query",
      detail: "Your electric bill is a separate conversation." },
  ]}
/>
```

## Props

- `tone` — grid-level `ToneName`, per-card `tone` optional override.
- `density` — `comfy | compact`.
- `stats` — `{ id, value, label, detail?, tone? }[]`.
- `flippable` — default `true`. Cards without `detail` are always static.
