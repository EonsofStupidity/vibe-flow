/**
 * FluidGrid — container-driven auto-fit grid. Replaces every
 * `sm:/md:/lg:grid-cols-*` pattern in the codebase.
 *
 * @remarks
 * Columns collapse and expand based on the parent container's inline
 * size, not the viewport. `colMin` is any CSS length (default a fluid
 * token) and represents the minimum acceptable column width; the grid
 * fits as many columns as the container permits and stretches them.
 *
 * Because the grid opts into `container-type: inline-size`, nested
 * `<FluidGrid>` instances behave independently — an outer grid at
 * 400px and an inner grid at 800px see their own widths.
 *
 * @param colMin - Minimum column width (default `var(--sp-8)` × 4 ≈ 12–18rem).
 * @param gap    - Gap token (default `var(--sp-4)`).
 * @public
 */
import type { CSSProperties, ReactNode } from "react";
import { fluidContainerStyle } from "../../utils/fluid-container.util";

interface FluidGridProps {
  readonly children: ReactNode;
  readonly colMin?: string;
  readonly gap?: string;
  readonly name?: string;
  readonly className?: string;
}

export function FluidGrid({
  children,
  colMin = "clamp(12rem, 20cqi, 22rem)",
  gap = "var(--sp-4)",
  name,
  className,
}: FluidGridProps) {
  const style: CSSProperties = {
    ...fluidContainerStyle({ name }),
    display: "grid",
    gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${colMin}), 1fr))`,
    gap,
    minWidth: 0,
  };
  return (
    <div className={className} style={style} data-fluid-grid={name ?? ""}>
      {children}
    </div>
  );
}
