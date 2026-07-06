/**
 * FluidStack — vertical stack with token-driven gap.
 *
 * @remarks
 * The one primitive for vertical rhythm. Gap keys map to fluid spacing
 * tokens so vertical density scales with the viewport without any
 * breakpoint variants.
 *
 * @param density - `compact` = `--sp-2`, `comfortable` = `--sp-4`, `spacious` = `--sp-6`.
 * @public
 */
import type { CSSProperties, ReactNode } from "react";

type Density = "compact" | "comfortable" | "spacious";

const DENSITY_TOKEN: Record<Density, string> = {
  compact: "var(--sp-2)",
  comfortable: "var(--sp-4)",
  spacious: "var(--sp-6)",
};

interface FluidStackProps {
  readonly children: ReactNode;
  readonly density?: Density;
  readonly align?: "start" | "center" | "end" | "stretch";
  readonly className?: string;
}

export function FluidStack({
  children,
  density = "comfortable",
  align = "stretch",
  className,
}: FluidStackProps) {
  const style: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: DENSITY_TOKEN[density],
    alignItems: align,
    minWidth: 0,
  };
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}
