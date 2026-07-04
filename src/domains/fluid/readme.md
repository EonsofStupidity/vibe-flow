# Fluid clamp

Pure functions that emit `clamp(min, calc(a + b·vw), max)` (or `svh` for
Y-axis) strings. No JS at runtime — every value collapses to a CSS `clamp()`
the browser evaluates natively.

Values default to **rem**, so they scale with user root font-size. Pass
`{ unit: "px" }` for hairlines and icon strokes where rem would be wrong.

```ts
import { fluid } from "@/domains/fluid/utils/fluid.util";
import { fluidY } from "@/domains/fluid/utils/fluid-y.util";

// Typography scale token:
const fs = fluid(1, 1.5);                       // rem, 24vw → 120vw
// Slide vertical padding:
const pad = fluidY(1, 3);                       // rem, 40svh → 100svh
```

This is the only place where fluid math lives; token files under
`domains/theme/tokens/fluid.css` mirror the same shape but statically for
CSS-only consumers.
