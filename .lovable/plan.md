
# Plan: Rip shadcn, own RAC primitives, land fluid clamp

Foundation-only pass. No shell chrome, no workspace routes, no episode content. Those come next. This pass makes the codebase RAC-native and gives the shell a real fluid-sizing contract to build on.

## Confirmed context (from exploration)

- `src/components/ui/*` is completely orphaned — nothing in the active runtime (`src/domains/*`, `src/routes/*`, `src/episodes/*`) imports it. Removal has zero call-site cost.
- Only surviving shadcn-adjacent surfaces: `tw-animate-css` import in `src/styles.css` and `src/hooks/use-mobile.tsx` (currently unused).
- Existing runtime already fits the target model (domains under `src/domains/`, named imports, tokens in `src/domains/theme/tokens.css`, WAI-ARIA intent). Broadcast Console theme stays.

## 1. Dependency surgery (single `bun` call)

**Remove (33 packages):** every `@radix-ui/*`, plus shadcn-companion deps that only existed for `components/ui/*` — `cmdk`, `vaul`, `embla-carousel-react`, `input-otp`, `react-day-picker`, `react-resizable-panels`, `recharts`, `sonner`, `@hookform/resolvers`, `react-hook-form`, `tw-animate-css`.

**Add:** `react-aria-components`, `@react-aria/utils`, `tailwind-variants`. Keep `class-variance-authority` + `tailwind-merge` + `clsx` (still useful; `tailwind-variants` complements, doesn't replace `cn`).

**Keep untouched:** TanStack (router/start/query), zustand, jotai, `@fontsource/*`, `lucide-react`, `zod`, tailwind, `date-fns`.

## 2. Delete

- `src/components/ui/` (entire directory)
- `src/hooks/use-mobile.tsx` (unused; anti-breakpoint per the fluid direction)
- `components.json` (shadcn CLI config; irrelevant post-rip)
- `tw-animate-css` line in `src/styles.css`

Directory `src/components/` will be empty and will also be deleted; component-adjacent code lives under `src/domains/*`.

## 3. Fluid XY clamp utility

New domain `src/domains/fluid/`:

```
src/domains/fluid/
  utils/
    fluid.util.ts           # fluid(minPx, maxPx, minVw, maxVw) -> "clamp(...)" string
    fluid-y.util.ts         # fluidY(minPx, maxPx, minSvh, maxSvh) using svh (safe viewport)
  types/
    fluid.types.ts
  README.md                 # contract + when to use X vs Y vs container
```

Contract (pure functions, no JS at runtime — they emit CSS strings for use inside `style={{}}`, `@theme`, or `--var:` declarations):

```ts
fluid(minPx: number, maxPx: number, minVw?: number, maxVw?: number): string
// -> "clamp(<minPx>px, calc(<a>px + <b>vw), <maxPx>px)"
```

Applied at token level in `src/domains/theme/tokens.css` for:
- Type scale: `--fs-eyebrow`, `--fs-body`, `--fs-h3`, `--fs-h2`, `--fs-h1`, `--fs-display`
- Spacing scale: `--sp-1` … `--sp-8`
- Radii: `--r-sm`, `--r-md`, `--r-lg`
- Slide viewport margins (Y-axis): `--slide-pad-y`

Registered in Tailwind v4 `@theme` so utilities like `text-display`, `p-4-fluid`, `gap-fluid` work. No breakpoint variants used anywhere. No `useMobile`, no `sm:` / `md:` in components going forward — layout responds via clamp + intrinsic sizing.

## 4. Owned RAC primitives

New `src/domains/ui/`, one folder per primitive, each self-contained:

```
src/domains/ui/
  Button/                  { Button.tsx, Button.types.ts, Button.variants.ts, README.md }
  Dialog/                  (+ Modal, DialogTrigger)
  Menu/                    (MenuTrigger, Menu, MenuItem, Section, Separator)
  Toolbar/                 (Toolbar, ToggleButton, Group)
  Tabs/                    (Tabs, TabList, Tab, TabPanel)
  Popover/
  Tooltip/
  ListBox/                 (ListBox, ListBoxItem)
  Select/                  (Select, SelectValue, SelectPopover, SelectListBox)
  ComboBox/
  Slider/
  Switch/
  Checkbox/
  RadioGroup/              (RadioGroup, Radio)
  TextField/               (TextField, Label, Input, Description, FieldError)
  NumberField/
  ProgressBar/
  Separator/
  index.md                 # catalog: primitive -> RAC component -> status
```

Each primitive is a thin `react-aria-components` wrapper: apply our tokens via `tailwind-variants`, force `.tap-target` min-height (64px) on interactive primitives, expose `data-*` state selectors already emitted by RAC for styling. No default exports. No re-exports (each consumer imports from the primitive folder directly). WAI-ARIA compliance comes free from RAC.

**Not built this pass (deferred until needed):** Table, Tree, GridList, DatePicker, Calendar, DateField, TimeField, FileTrigger, DropZone, ColorPicker. Added on demand.

## 5. Runtime rewire

Two existing files touch shadcn-orbit deps; audit and adjust:
- `src/styles.css` — drop `@import "tw-animate-css"` and any `@layer utilities` remnants. Keep the Tailwind v4 `@import "tailwindcss"` + `@theme inline` block. Add `@theme` mappings for new fluid tokens.
- `src/domains/deck/components/RuntimeToolbar/RuntimeToolbar.tsx` — currently uses plain buttons; migrate its toggle buttons to `Toolbar` + `ToggleButton` from the new `src/domains/ui/Toolbar/`. Only file in the runtime that changes.

Nothing else in the runtime touches shadcn, so `DeckHost`, `EdgeNav`, `ProgressRail`, `SlideNavigator`, `AnnotationLayer`, hooks, services, and the sample episode compile unchanged.

## 6. Managed knowledge (memories)

Add:
- `mem://preferences/ui-primitives.md` — Own RAC wrappers under `src/domains/ui/`. No shadcn, no Radix, no re-exports. Consumers import from the primitive folder directly. Each primitive folder = `.tsx` + `.types.ts` + `.variants.ts` + README.
- `mem://preferences/no-breakpoints.md` — No responsive breakpoint variants (`sm:`, `md:`, `lg:`) in application code. Sizing responds via `fluid()` / `fluidY()` clamp tokens and intrinsic layout only. No `useMobile`-style hooks.
- `mem://features/devpulse-labs.md` — Product framing: DevPULSE Labs is the local-only shell that hosts three properties — DevPULSE News (live show with Clyffy on a GB10 cluster), AngryVibes (episodic), Eons of Stupidity (touchscreen lessons). No auth, no cloud, no backend. Ever.

Update `mem://index.md` Core:
- "React Aria Components only under `src/domains/ui/`. No shadcn, no Radix, no re-exports."
- "No responsive breakpoints. Use `fluid()` / `fluidY()` clamp tokens for all sizing."
- "DevPULSE Labs shell hosts three properties: News, AngryVibes, EoS. Local-only, no auth."

## Explicitly out of scope this pass

- DevPULSE Labs shell (TopBar / LeftSidebar / RightSidebar / BottomBar)
- Workspace routes `/news/*`, `/angryvibes/*`, `/eos/*`
- Moving the existing deck runtime under `/eos/*`
- Registry / lesson-schema scaffolding (previous plan; will re-land after shell)
- Any News- or AngryVibes-specific features (GB10 cluster wiring, episode manager)
- Recharts replacement, form-lib replacement, toast system, calendar/date picker (add when a feature needs one)

## Follow-up plan queue (in order)

1. **Shell** — DevPULSE Labs `AppLayout` with TopBar/LeftSidebar/RightSidebar/BottomBar wired to fluid tokens; workspace switcher routes to `/news`, `/angryvibes`, `/eos`.
2. **Migrate EoS** — move deck runtime to `/eos/deck/$deckId/$slideIndex`, keep `ep-000-template` working.
3. **Registry + schema scaffolding** (the previously-approved plan, re-issued against the new shell).
4. **News + AngryVibes** stubs with their own sub-nav shape.

## Technical notes

- `react-aria-components` supports React 19 and SSR; TanStack Start SSR is compatible.
- `tailwind-variants` is chosen over CVA for RAC because it composes slot recipes cleanly with `data-*` selectors (`Menu` has `MenuTrigger`, `Popover`, `ListBox`, `Item` slots).
- `.tap-target` min-height of 64px is enforced at the primitive level via `tailwind-variants` base class, not left to each caller.
- No barrels. Consumers import `import { Button } from "@/domains/ui/Button/Button"`. The sole exception `src/episodes/index.ts` remains as an enumeration barrel per existing memory.
- No `postcss.config.js`. Tailwind v4 tokens for the new fluid scale go into `@theme` in `src/styles.css`.
- After removal, `bun install` runs once; TanStack dev server auto-restarts.
