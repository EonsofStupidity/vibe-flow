## Plan: Proper RAC Tooltip + LeftRail Interaction System

### Scope
Only touch the tooltip primitive, its semantic tokens/motion hooks, and left-rail usage. No backend, no routes, no unrelated shell logic.

### What I found
- The tooltip exists in code, but its styling is too flat: mostly solid background + ring + shadow.
- The current animation is minimal and may not visibly communicate motion.
- Live DOM shows no tooltip mounted at rest, which is expected for RAC, but the current trigger/visual setup is not strong enough for heavy use.
- Left-rail interactions use color/halo classes, but not a polished glass/motion signature.

### Implementation
1. **Harden the RAC tooltip primitive**
   - Keep `react-aria-components` `Tooltip`, `TooltipTrigger`, and `OverlayArrow`.
   - Add a typed `variant`/surface concept if useful, but keep it small and domain-owned.
   - Keep offset in rem and typed props.

2. **Author true semantic glass tokens**
   - Add tooltip-specific semantic variables in `src/domains/theme/tokens/semantics.css` only.
   - Use OKLCH and `color-mix(in oklch, ...)` for:
     - glass surface fill
     - tonal glow
     - inner hairline/ring
     - arrow fill/stroke
     - text contrast
   - No hex/rgb, no primitive token reads from components.

3. **Upgrade tooltip visuals**
   - Use glassmorphism with standard `backdrop-filter` only.
   - Add layered shadow/glow driven by the tooltip tone.
   - Add subtle border/ring separation so it reads over the shell.
   - Give each tone a clear visible personality: cyan, magenta, coral, lime, brand, neutral, etc.

4. **Upgrade tooltip animation**
   - Replace the current simple enter/out with more visible RAC state-driven motion:
     - placement-aware directional slide
     - opacity
     - scale
     - small blur/saturate settle
   - Keep browser-owned CSS animations using RAC `data-entering`, `data-exiting`, `data-placement`.
   - Preserve `prefers-reduced-motion` behavior.

5. **Make left-rail interactions obvious in icon-only and expanded modes**
   - Keep per-item `--rail-tone`.
   - Strengthen hover/focus/active states with:
     - tonal glass wash
     - tone edge bar
     - icon color + glow
     - micro translate/scale
     - expanded label sweep that remains readable
   - Ensure focus-visible gets the same visual affordance plus accessible ring.

6. **Fix trigger wiring if needed**
   - Verify whether `Focusable` wrapping is actually forwarding RAC hover/focus as expected.
   - If it is fragile, switch to a typed wrapper that uses `asChild`/`composeRenderProps` patterns supported by RAC and TanStack Link without adding shims or re-exports.

7. **Validate visually**
   - Use the live preview to hover/focus a left-rail item.
   - Confirm a tooltip appears with glass styling, tone color, arrow, and motion.
   - Confirm collapsed and expanded rail interactions are both visibly colored and animated.

### Files expected to change
- `src/domains/ui/tooltip/tooltip.tsx`
- `src/domains/ui/tooltip/tooltip.variants.ts`
- `src/domains/ui/tooltip/tooltip.types.ts` only if typed props change
- `src/domains/theme/tokens/semantics.css`
- `src/styles.css`
- `src/domains/shell/components/left-rail/left-rail.tsx`

### Constraints I will follow
- OKLCH / rem / RAC only.
- No shadcn, no Radix, no `class-variance-authority`.
- No hardcoded hex/rgb color classes.
- No responsive breakpoints.
- No backend, no persistence, no Cloud.
- No broad refactor outside this interaction system.