
# DevPULSE Labs — Shell & Token Foundry (Foundation V3)

Two tracks land together because the shell has to consume the new tokens on day one. No shortcuts, no re-exports, no shims. Everything follows the existing lowercase-kebab, hypermodular, domain-boundary rules already in memory.

## Track 1 — Token Foundry (built before shell chrome renders)

### Why Style Dictionary
Style Dictionary (Amazon) is the reference industry tool for multi-platform, multi-brand token pipelines and is what large design systems (Salesforce, Shopify Polaris, Adobe Spectrum, GitHub Primer) publish with. It reads a typed source of truth and emits CSS/JS/whatever at build. Combined with `culori` (OKLCH-native color math) we generate:

- 11-step OKLCH lightness ladders per palette (50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950) — the Tailwind/Radix cadence, kept because tooling expects it.
- Gradient recipes per palette (linear, radial, conic, mesh) derived from the palette's own steps — no hand-picked stops.
- Alpha/overlay scales (`/8, /12, /20, /40, /60, /80`).
- Semantic aliases per brand context.
- Fluid rem scales already in `fluid.css` stay; the foundry replaces the hand-authored `primitives.css` color block.

### Source of truth
`src/domains/theme/foundry/source/` — one TS file per palette, typed against `foundry.types.ts`. No JSON hand-editing.

```
src/domains/theme/foundry/
  foundry.types.ts             # PaletteSource, GradientRecipe, SemanticMap
  source/
    palettes/
      ink.palette.ts           # near-black surface family (never #000)
      amber.palette.ts         # EoS
      cyan.palette.ts          # News (from ViziWizi --vf-neon)
      magenta.palette.ts       # AngryVibes (from ViziWizi --vf-plasma)
      lime.palette.ts          # free accent (from ViziWizi --vf-matrix)
      violet.palette.ts        # free accent
      warning.palette.ts       # amber-warm, non-brand
      danger.palette.ts        # red
      info.palette.ts          # blue
    semantic/
      surface.semantic.ts      # surface/ink/hairline/focus-ring maps
      brand.semantic.ts        # brand + brand-ink resolution per data-brand
      accent.semantic.ts       # accent-1..accent-5 slots
    gradients/
      brand.gradients.ts       # per-palette recipes
  build/
    build-tokens.ts            # style-dictionary config + culori transforms
    transforms/
      oklch-ladder.transform.ts   # generates 50..950 from anchor L/C/H
      gradient.transform.ts
      alpha-scale.transform.ts
    formats/
      css-tokens.format.ts     # emits primitives.css / semantics.css / brands.css
      ts-tokens.format.ts      # emits foundry.tokens.ts for runtime type-safe access
  readme.md
```

### Palette source shape
```ts
export interface PaletteSource {
  readonly name: string;            // "amber"
  readonly anchor: { l: number; c: number; h: number }; // OKLCH anchor at step 500
  readonly ladder: LadderCurve;     // "perceptual" | "flat-chroma" | custom
  readonly gradients?: GradientRecipe[];
}
```
Colors are OKLCH end-to-end; hex never enters the source. Culori validates in-gamut and clips per step.

### Rules baked in
- **Never pure black.** The `ink` palette bottoms out at OKLCH `L 0.14 C 0.01 h 260` (soft blue-black), never `#000000`. Enforced by a lint transform that rejects `L < 0.10`.
- **3–5 options per major category.** Brand palettes: 3 (`amber`, `cyan`, `magenta`). Free accent slots: 5 (`lime`, `violet`, `orange`, `teal`, `rose`). Utility: 1 each (`warning`, `danger`, `info`) — the obvious exceptions the user called out.
- **Multi-brand.** Every brand palette produces a `[data-brand="<name>"]` block in `brands.css` remapping semantic `--brand-*` + `--accent-*` slots. `data-brand` list is authored, not hardcoded per component.
- **REM everywhere.** Sizes, radii, spacing tokens all emit rem. Fluid clamp helpers stay in `fluid.css`.
- **Build step.** `bun run tokens` executes `build-tokens.ts` and writes `src/domains/theme/tokens/primitives.css`, `semantics.css`, `brands.css`, plus `foundry.tokens.ts`. Wired as a pre-build hook in `package.json`; the CSS files land at the same paths `tokens.css` already imports so nothing else moves.
- **Typed runtime access.** `foundry.tokens.ts` exports `const tokens = { surface: { base: "var(--surface-base)", ... } } as const` so the shell can reference tokens with autocomplete and no stringly-typed drift.

### Runtime validation library
Replace planned zod usage with **valibot** — same schema-first API, ~10× smaller, faster parse, tree-shakable. Used inside foundry build and by shell state persistence. Zod is not added.

## Track 2 — Shell Domain

### New domain
```
src/domains/shell/
  components/
    app-shell/app-shell.tsx            # grid frame; measures inner rect
    top-bar/top-bar.tsx
    left-rail/left-rail.tsx            # collapsed 4rem ↔ expanded ~8.4375rem (135px)
    bottom-bar/bottom-bar.tsx
    right-panel/right-panel.tsx        # slide-out overlay, tabbed
    right-panel/right-panel-tab.tsx
    fullbleed-exit/fullbleed-exit.tsx  # tiny corner icon while chrome hidden
  state/
    shell.store.ts                     # zustand: leftMode, rightOpen, rightTab, fullBleed
    shell.persist.ts                   # valibot-validated localStorage adapter
  context/
    shell-size.context.tsx             # ResizeObserver-driven inner-rect provider
    use-shell-size.ts                  # typed consumer hook
  hooks/
    useShellKeyboard.ts                # Esc → exit fullbleed, `[` `]` toggles, `.` right panel
    useShellShortcuts.ts               # cmd-registry hook
  types/
    shell.types.ts
  readme.md
```

### Layout topology
Flex shell (per user choice), with `ResizeObserver` measuring the inner content rectangle and publishing `{ width, height, dpr }` through React context. Children read via `useShellSize()` and pipe values into existing `fluid()` / `fluidY()` helpers or into CSS custom props for CSS-only consumers.

```text
┌─────────────────── TopBar (auto-height, rem) ───────────────────┐
│                                                                 │
│  Left  │            Content (flex 1, measured)          │ Right │
│  Rail  │                                                │Overlay│
│ 4↔8.4  │                                                │(slide)│
│  rem   │                                                │       │
│        │                                                │       │
├─────────────────── BottomBar (auto-height, rem) ────────────────┤
```

- **TopBar:** brand switcher (data-brand cycle), route title, global search stub, fullbleed toggle.
- **LeftRail:** collapsible via chevron; two widths `--rail-collapsed: 4rem` / `--rail-expanded: 8.4375rem` (135px). Persists per user.
- **BottomBar:** fixed status/context bar (deck position, brand indicator, shortcut hints).
- **RightPanel:** starts closed. Opens as an **overlay** above content (does not push layout). Tabs: `notes`, `queue`, `inspector`, `data`. Content wired to Jotai atoms for tab-local UI state; data tabs use TanStack Query for async and TanStack DB for local reactive stores (Turso decision deferred — see Open Question).
- **Full-bleed mode:** hides top/left/bottom/right, shows only `FullbleedExit` (tiny corner icon). Toggle via icon or `Esc` key.

### Route integration
- New pathless layout route `src/routes/_shell.tsx` renders `<AppShell><Outlet /></AppShell>`.
- Move `index.tsx` → `_shell.index.tsx`; add future workspace routes (`_shell.news.tsx`, `_shell.vibes.tsx`, `_shell.eos.tsx`) under it.
- `/deck/$deckId/$slideIndex` stays outside `_shell` (chromeless runtime — no regression to the slide surface).
- `__root.tsx` stays minimal (html shell only).

### Accessibility (WAI-ARIA APG)
- TopBar uses `role="banner"`, LeftRail `role="navigation"`, BottomBar `role="contentinfo"`, RightPanel `role="complementary"` + `aria-expanded` on trigger.
- RightPanel tabs implemented on React Aria Components `Tabs` (already the pattern in `src/domains/ui`). Focus trap only in full-bleed exit affordance, not the panel (panel is non-modal complementary content).
- All triggers ≥ 4rem tap targets via `.tap-target`.
- Roving tabindex handled by RAC; Esc exits fullbleed; `[`/`]` toggle rail; `.` toggles right panel — all announced via `aria-keyshortcuts`.

### State
`useShellStore` (zustand + valibot-validated persist):
```ts
interface ShellState {
  leftMode: "collapsed" | "expanded";
  rightOpen: boolean;
  rightTab: "notes" | "queue" | "inspector" | "data";
  fullBleed: boolean;
  brand: "eos" | "news" | "vibes";
  toggleLeft(): void; toggleRight(): void; setRightTab(t): void;
  toggleFullBleed(): void; setBrand(b): void;
}
```

## Track 3 — Wiring & Cleanup
- Update `src/domains/theme/tokens.css` only if the foundry output filenames drift; otherwise untouched (foundry writes into the same three files).
- Delete hand-authored color blocks from current `primitives.css` and `brands.css` — regenerated.
- `package.json` scripts: `"tokens": "bun run src/domains/theme/foundry/build/build-tokens.ts"`, `"prebuild": "bun run tokens"`, `"predev": "bun run tokens"`.
- Add `bun add -d style-dictionary culori valibot` (dev-only; runtime never imports style-dictionary).
- Update `mem://index.md` core rule: valibot over zod; add `mem://design/token-foundry.md` describing the pipeline.
- No changes to `src/domains/ui/*` primitives in this pass — they already read semantic classes and will inherit new palettes automatically.
- Deck runtime files untouched.

## Best-practice confirmations
- **OKLCH ladders + culori:** matches how Radix, Tailwind v4, Adobe Spectrum, and Leonardo generate accessible scales. Recommending "perceptual" curve as default with per-palette override — this is the current industry consensus.
- **Style Dictionary:** de facto standard for scale. Alternatives (Terrazzo, Tokenami) are newer/less mature for multi-brand emission. Style Dictionary v4 with DTCG-format sources is the aligned recommendation.
- **Valibot over zod:** correct call for a local-runtime app — smaller, faster, same ergonomics.
- **`ResizeObserver` context:** correct for a flex shell where inner rect must feed JS layout math. Container queries would also work but require CSS-only consumption; the measured-context approach the user chose lets Zustand/Jotai/deck code read the rect too.

## Open question (needs answer before build)
**Local DB pick.** You floated Turso (libSQL) and Mongo. For a local-only touchscreen shell, my recommendation is **TanStack DB + libSQL (Turso local file mode)** — SQL, reactive queries, embedded, zero-server, and TanStack DB has a first-party libSQL collection. Mongo requires a running `mongod` and isn't reactive without extra glue. I'll wait for your call before wiring the `data` right-panel tab; the shell itself doesn't block on this.

## Explicitly out of scope for this pass
- Actual workspace pages (News/Vibes/EoS route bodies).
- Right-panel content beyond scaffolding (tabs render placeholders).
- Any change to slide runtime or deck registry.
- MCP server (already shipped).
