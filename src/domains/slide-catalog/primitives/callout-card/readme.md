# CalloutCard

Display-sized tone-driven panel. Kicker + title + body + optional owned
`Button` CTA. Not to be confused with the chip-sized `CalloutBadge`.

```tsx
import { CalloutCard } from "@/domains/slide-catalog/primitives/callout-card/callout-card";

<CalloutCard
  tone="coral"
  kicker="Hot take"
  title="Every effect is one matrix cell."
  body="Tone × category. Add a column once, every primitive picks it up."
  cta={{ label: "Show me", onPress: () => console.log("go") }}
/>
```

## Props

- `tone` — `ToneName`. Defaults `brand`.
- `density` — `comfy | compact`.
- `kicker`, `title`, `body` — ReactNode content.
- `cta` — `{ label, onPress, ariaLabel? }` — routed through the owned RAC `Button`.
