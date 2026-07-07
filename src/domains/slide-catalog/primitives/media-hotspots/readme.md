# MediaHotspots

Tone-driven image with pulsing hotspots. Each hotspot is a `TooltipTrigger`
wrapping a `<Focusable>` button — hover, touch, and keyboard focus all
reveal the tooltip label. `data-no-swipe` on the frame keeps deck gestures
from stealing the interaction.

```tsx
import { MediaHotspots } from "@/domains/slide-catalog/primitives/media-hotspots/media-hotspots";

<MediaHotspots
  tone="cyan"
  src="/img/gb10-topology.png"
  alt="GB10 cluster topology"
  hotspots={[
    { id: "cpu",  x: 32, y: 44, label: "CPU crossbar", tone: "cyan" },
    { id: "mem",  x: 68, y: 30, label: "HBM stack",    tone: "violet" },
    { id: "net",  x: 52, y: 78, label: "NVLink switch", tone: "magenta" },
  ]}
  caption="Every hotspot is one tone × one label."
/>
```

Requires the `hotspot-pulse` keyframe (added in `src/styles.css`).
