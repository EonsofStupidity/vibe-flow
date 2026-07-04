
# Plan: Foundation V2 — tokens, naming, structure, multi-brand

Slow, deliberate pass. No new features, no new components beyond what's already shipped. Fixes the token architecture, the naming inconsistencies, the shadcn residue that survived the last pass, and lays the ground for a multi-brand system without wiring the shell yet.

## Confirmed context

- **shadcn residue** left after the last pass:
  - `class-variance-authority` still in `package.json` (unused; `tailwind-variants` replaced it)
  - `src/lib/utils.ts` `cn()` is fine but lives in a template-shaped `lib/` folder
  - `src/routes/__root.tsx` NotFound + Error components still use raw shadcn-shape utilities (`border-input`, `hover:bg-accent`, `bg-primary/90`) — no shadcn code, but the styling patterns leaked
- **TanStack Start bootstrap** is correct: `src/router.tsx`, `src/routes/__root.tsx`, `src/routes/index.tsx`, `src/server.ts`, `src/start.ts`, `vite.config.ts` all in place. No changes to bootstrap files this pass.
- **Naming today is inconsistent**: `Button/Button.tsx` (PascalCase folder), `useSwipeNav.hook.ts` (dot suffix), `deck-navigation.service.ts` (kebab). User wants one convention: **lowercase everywhere; caps only when TanStack or React forces it (component symbols in JSX, route param `$id`, etc.)**.
- **Tokens today are one flat layer** with px values inside clamps. User wants **REM + OKLCH + fluid clamp**, three layers, **multi-brand (both property-scoped and free-accent)**.
- **Runtime error**: styles.css 500 was transient (currently HTTP 200). Will re-verify at end of pass.

## 1. Naming convention (locks in for the whole project)

Every folder and file lowercase kebab-case. React component symbols and TanStack-required tokens keep caps. Hook filenames match their exported hook (`useSwipeNav.ts`) — camelCase filename because the hook name is the file's identity; no `.hook.` infix.

| Kind                      | File                              | Exported symbol            |
| ------------------------- | --------------------------------- | -------------------------- |
| Component                 | `button/button.tsx`               | `Button`                   |
| Component types           | `button/button.types.ts`          | `ButtonProps`              |
| Component variants        | `button/button.variants.ts`       | `buttonVariants`           |
| Component readme          | `button/readme.md`                | —                          |
| Hook                      | `input/hooks/useSwipeNav.ts`      | `useSwipeNav`              |
| Service                   | `deck/services/deck-nav.service.ts` | `nextIndex`, `prevIndex` |
| Util                      | `fluid/utils/fluid.util.ts`       | `fluid`                    |
| Types module              | `deck/types/deck.types.ts`        | `Deck`, `SlideDefinition`  |
| Route file (TanStack)     | `routes/deck.$deckId.$slideIndex.tsx` | (framework-imposed)    |

Rules memory'd. All existing files renamed to match; every importer updated in the same pass. Route files stay TanStack-shape.

## 2. Folder reshape

```text
src/
  routes/                          # TanStack-owned, unchanged
  app/                             # NEW — app-level plumbing (was: src/lib/)
    fonts.ts
    error-capture.ts
    error-page.ts
    lovable-error-reporting.ts
  domains/
    theme/
      tokens/                      # split from one file into a token layer stack
        primitives.css             # raw palette + raw sizes (OKLCH ramps, rem scale)
        semantics.css              # role tokens (surface, ink, brand, focus, hairline)
        fluid.css                  # fluid rem clamps for type/space/radius
        brands.css                 # per-brand data-brand blocks (news, vibes, eos)
        motion.css                 # motion tokens (duration + easing) — no presets, just tokens
      tokens.css                   # aggregator: @imports the four above (single entry)
    ui/                            # owned RAC primitives (already exists)
      button/                      # renamed from Button/
      toggle-button/               # renamed from ToggleButton/
      toolbar/                     # renamed from Toolbar/
      utils/
        cn.util.ts                 # moved from src/lib/utils.ts
      readme.md                    # was index.md — renamed for consistency
    fluid/                         # already exists; internal file renames only
    deck/
      components/
        deck-host/                 # renamed from DeckHost/
        edge-nav/
        progress-rail/
        runtime-toolbar/
        slide-navigator/
      services/                    # already kebab, unchanged
      state/
        runtime.store.ts           # unchanged
      types/                       # unchanged
    slide-catalog/
      primitives/
        slide-frame/
        title-card/
        still-zoomable/
        comparator-panel/
        callout-badge/
        big-number/                # NEW folder (primitive already listed in README, no file)
        code-block-still/          # same
      readme.md
    annotation/
      components/
        annotation-layer/
    input/
      hooks/
        useSwipeNav.ts             # dropped .hook infix
        useKeyboardNav.ts
        usePinchZoom.ts
```

`src/lib/` is deleted after its four files move to `src/app/`. `src/hooks/` was already removed.

## 3. Token architecture — three layers, REM + OKLCH + fluid clamp

### Layer 1 — `tokens/primitives.css`

Raw material only. No semantic meaning. Every color as an **OKLCH ramp**, every size in **rem**.

```css
:root {
  /* Neutral surface ramp (was: --background/--panel/--muted etc.) */
  --neutral-50:  oklch(0.98 0.005 250);
  --neutral-100: oklch(0.94 0.007 250);
  --neutral-200: oklch(0.86 0.009 250);
  --neutral-300: oklch(0.72 0.011 250);
  --neutral-400: oklch(0.58 0.013 250);
  --neutral-500: oklch(0.44 0.014 250);
  --neutral-600: oklch(0.32 0.015 250);   /* current hairline */
  --neutral-700: oklch(0.24 0.012 250);   /* current muted */
  --neutral-800: oklch(0.20 0.012 250);   /* current card */
  --neutral-850: oklch(0.18 0.011 250);
  --neutral-900: oklch(0.16 0.010 250);   /* current background */
  --neutral-950: oklch(0.10 0.008 250);

  /* Brand ramps — four brands, each -50..-950 */
  --amber-50..--amber-950;    /* signal amber (EoS/live) */
  --cyan-50..--cyan-950;      /* DevPULSE News */
  --magenta-50..--magenta-950;/* AngryVibes */
  --lime-50..--lime-950;      /* annotate / ink accent */
  --coral-50..--coral-950;    /* free accent */
  --violet-50..--violet-950;  /* free accent */
  --teal-50..--teal-950;      /* free accent */

  /* Raw sizes in rem (16px base). */
  --size-1: 0.25rem; --size-2: 0.5rem; --size-3: 0.75rem;
  --size-4: 1rem;    --size-5: 1.25rem; --size-6: 1.5rem;
  --size-7: 2rem;    --size-8: 3rem;    --size-9: 4rem;
  --size-10: 5rem;   --size-12: 6rem;   --size-16: 8rem;
}
```

### Layer 2 — `tokens/semantics.css`

Role tokens. Every component reads from here — never from Layer 1 directly.

```css
:root {
  /* Surfaces */
  --surface-base:      var(--neutral-900);
  --surface-raised:    var(--neutral-800);
  --surface-overlay:   var(--neutral-850);
  --surface-input:     var(--neutral-700);
  --hairline:          var(--neutral-600);

  /* Ink (foregrounds) */
  --ink-strong:        var(--neutral-50);
  --ink-default:       oklch(0.96 0.01 90);
  --ink-muted:         oklch(0.68 0.02 250);
  --ink-inverse:       var(--neutral-900);

  /* Brand semantic — resolved by data-brand block in brands.css */
  --brand:             var(--amber-500);
  --brand-strong:      var(--amber-400);
  --brand-soft:        var(--amber-200);
  --brand-ink:         var(--neutral-900);   /* text on --brand */

  /* Focus + state */
  --focus-ring:        var(--brand);
  --danger:            oklch(0.62 0.22 25);
  --danger-ink:        oklch(0.98 0.01 90);

  /* Annotation */
  --ink-annotate:      oklch(0.96 0.02 80);
}
```

### Layer 3 — `tokens/brands.css` (multi-brand, "Both" answer)

Property-scoped brand + free accent tones simultaneously.

```css
[data-brand="eos"]   { --brand: var(--amber-500);   --brand-strong: var(--amber-400);   --brand-soft: var(--amber-200);   --brand-ink: var(--neutral-900); }
[data-brand="news"]  { --brand: var(--cyan-500);    --brand-strong: var(--cyan-400);    --brand-soft: var(--cyan-200);    --brand-ink: var(--neutral-900); }
[data-brand="vibes"] { --brand: var(--magenta-500); --brand-strong: var(--magenta-400); --brand-soft: var(--magenta-200); --brand-ink: var(--neutral-50);  }

/* Free accents — always available regardless of active brand.
   Any component that accepts a `tone` prop can pick one. */
:root {
  --accent-amber:   var(--amber-500);
  --accent-cyan:    var(--cyan-500);
  --accent-magenta: var(--magenta-500);
  --accent-lime:    var(--lime-500);
  --accent-coral:   var(--coral-500);
  --accent-violet:  var(--violet-500);
  --accent-teal:    var(--teal-500);
}
```

`__root.tsx` sets `data-brand="eos"` on `<html>` by default. Later, the shell layout for each property route will set its own `data-brand` — no shell in this plan.

### Layer 3 — `tokens/fluid.css`

Rebuild the fluid scale in **rem-based clamps**, one continuous curve from `24rem` (384px) to `120rem` (1920px):

```css
:root {
  --fs-eyebrow: clamp(0.6875rem, calc(0.5938rem + 0.4167vw), 0.9375rem);   /* 11 -> 15px */
  --fs-body:    clamp(0.875rem,  calc(0.7813rem + 0.4167vw), 1.125rem);    /* 14 -> 18 */
  --fs-h3:      clamp(1.125rem,  calc(0.9375rem + 0.8333vw), 1.625rem);    /* 18 -> 26 */
  --fs-h2:      clamp(1.5rem,    calc(1.1875rem + 1.3889vw), 2.3125rem);   /* 24 -> 37 */
  --fs-h1:      clamp(2rem,      calc(1.5rem + 2.2222vw),    3.3125rem);   /* 32 -> 53 */
  --fs-display: clamp(2.75rem,   calc(1.9375rem + 3.6111vw), 4.9375rem);   /* 44 -> 79 */

  --sp-1..--sp-8;                  /* same curve, rem-based */
  --r-sm, --r-md, --r-lg;          /* same */
  --slide-pad-y;                   /* svh-based, unchanged shape */
}
```

`src/domains/fluid/utils/fluid.util.ts` gains a `unit` option so authors can emit rem OR px:

```ts
fluid(minRem: number, maxRem: number, opts?: { minVw?: number; maxVw?: number; unit?: 'rem' | 'px' })
```

Default unit `'rem'`. `fluidY` gains the same.

### `styles.css` becomes tiny

Just aggregates:

```css
@import "tailwindcss" source(none);
@source "../src";
@import "./domains/theme/tokens.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-surface: var(--surface-base);
  --color-surface-raised: var(--surface-raised);
  --color-surface-overlay: var(--surface-overlay);
  --color-hairline: var(--hairline);
  --color-ink: var(--ink-default);
  --color-ink-strong: var(--ink-strong);
  --color-ink-muted: var(--ink-muted);
  --color-ink-inverse: var(--ink-inverse);
  --color-brand: var(--brand);
  --color-brand-strong: var(--brand-strong);
  --color-brand-soft: var(--brand-soft);
  --color-brand-ink: var(--brand-ink);
  --color-focus-ring: var(--focus-ring);
  --color-danger: var(--danger);
  --color-danger-ink: var(--danger-ink);
  --color-ink-annotate: var(--ink-annotate);

  --color-accent-amber:   var(--accent-amber);
  --color-accent-cyan:    var(--accent-cyan);
  --color-accent-magenta: var(--accent-magenta);
  --color-accent-lime:    var(--accent-lime);
  --color-accent-coral:   var(--accent-coral);
  --color-accent-violet:  var(--accent-violet);
  --color-accent-teal:    var(--accent-teal);

  --font-display: var(--font-display);
  --font-sans:    var(--font-body);
  --font-mono:    var(--font-mono);

  --text-eyebrow: var(--fs-eyebrow);
  --text-body:    var(--fs-body);
  --text-h3:      var(--fs-h3);
  --text-h2:      var(--fs-h2);
  --text-h1:      var(--fs-h1);
  --text-display: var(--fs-display);

  --spacing-f1..--spacing-f8;
  --radius-f-sm, --radius-f-md, --radius-f-lg;
}

@layer base { ... small reset unchanged, but using semantic names ... }

@utility tap-target { min-width: var(--tap-min); min-height: var(--tap-min); }
@utility hairline-t { border-top: 1px solid var(--color-hairline); }
@utility hairline-b { border-bottom: 1px solid var(--color-hairline); }
```

**Legacy semantic names (`--background`, `--foreground`, `--primary`, `--card`, `--popover`, `--muted`, `--accent`, `--secondary`, `--border`, `--input`, `--ring`, `--destructive`) are deleted.** Every consumer migrates:

| Old class                | New class                       |
| ------------------------ | ------------------------------- |
| `bg-background`          | `bg-surface`                    |
| `text-foreground`        | `text-ink`                      |
| `text-muted-foreground`  | `text-ink-muted`                |
| `bg-primary`             | `bg-brand`                      |
| `text-primary-foreground`| `text-brand-ink`                |
| `bg-secondary`           | `bg-surface-raised`             |
| `text-secondary-foreground` | `text-ink`                   |
| `bg-card`                | `bg-surface-raised`             |
| `bg-popover`             | `bg-surface-overlay`            |
| `text-destructive`       | `text-danger`                   |
| `ring-ring`              | `ring-focus-ring`               |
| `border-input`           | `border-hairline`               |
| `bg-muted`               | `bg-surface-raised` (case-by-case) |

Every touched file: `runtime-toolbar.tsx`, `deck-host.tsx`, `edge-nav.tsx`, `progress-rail.tsx`, `slide-navigator.tsx`, `annotation-layer.tsx`, `title-card.tsx`, `still-zoomable.tsx`, `comparator-panel.tsx`, `callout-badge.tsx`, `slide-frame.tsx`, `__root.tsx`, `routes/index.tsx`, `routes/deck.$deckId.$slideIndex.tsx`, `button.variants.ts`, `toggle-button.variants.ts`.

## 4. shadcn residue removal

- **Remove `class-variance-authority`** from `package.json` — no callers left; `tailwind-variants` covers CVA's shape.
- **Delete `src/lib/`** after moving its four files to `src/app/`. Update all importers (root, error page, fonts).
- **Rewrite `__root.tsx` NotFound + Error** components to use the new semantic tokens (`bg-surface`, `text-ink`, `bg-brand`, `text-brand-ink`, `border-hairline`) and the owned `Button` primitive instead of `<button className="...shadcn shapes...">`.

## 5. Managed knowledge

Add:
- `mem://preferences/naming.md` — lowercase kebab-case files/folders; caps only where React/TanStack forces (component symbols in JSX, route `$param`, TanStack framework files). Hooks: filename matches hook name (`useSwipeNav.ts`), no `.hook.` infix. Services: `.service.ts`. Utils: `.util.ts`. Types: `.types.ts`. Variants: `.variants.ts`.
- `mem://design/token-architecture.md` — three layers (primitives → semantics → brand overrides). Components read only from semantic layer. Multi-brand via `data-brand` on `<html>` (property-scoped) plus free `--accent-*` tokens (per-widget). REM + OKLCH + fluid clamp everywhere. No hardcoded hex, no px in scale tokens.
- `mem://preferences/no-shadcn.md` — no `class-variance-authority`, no Radix, no shadcn class shapes (`bg-primary/90`, `border-input`, `hover:bg-accent`). Interactive elements use owned RAC primitives from `src/domains/ui/`.

Update `mem://index.md` Core to point at all three and note the new semantic class names.

## 6. Verify at end of pass

- `bunx tsgo --noEmit` clean
- `curl http://localhost:8080/src/styles.css` returns 200 with the new token surface present
- Preview render of `/` and `/deck/ep-000-template/0` shows no lost styling
- Manually toggle `data-brand="news"` and `data-brand="vibes"` on `<html>` via a preview snippet; confirm the runtime toolbar toggle-button "selected" color swaps

## Explicitly out of scope

- DevPULSE Labs shell (TopBar/LeftSidebar/RightSidebar/BottomBar)
- Workspace routes `/news`, `/angryvibes`, `/eos`
- Migrating the deck runtime under `/eos`
- New primitives (Dialog, Menu, Tabs, Popover, Tooltip, Slider, etc.)
- Effects catalog (shadow / glow / gradient / motion presets) — deferred; only motion **duration/easing tokens** land as raw material
- Registry / lesson-schema scaffolding
- EOS-001 content

## Technical notes

- Tailwind v4 `@theme inline` correctly resolves `var(--x)` where `--x` is defined in `:root` from an imported CSS file — Lightning CSS reads the aggregator's `@import` graph at build. The previous pass already validated this pattern for `--font-*` and `--color-*`.
- The `data-brand` mechanism relies on cascade — `[data-brand="news"] { --brand: ... }` overrides `:root { --brand: ... }` for descendants only. Property routes will set `data-brand` on their outermost element (future plan).
- `fluid()` staying pure means its output is safe to embed anywhere CSS accepts a length; `unit` option gates the emitted suffix only.
- No `.d.ts` shims. No re-export barrels (existing `src/episodes/index.ts` enumeration barrel remains the sole exception).
- Route rename count is zero — TanStack file conventions untouched. Only domain internals rename.
