/**
 * FluidFrame — bounded, self-clamping content region with an intrinsic
 * aspect ratio. The single primitive every slide, panel, or preview
 * region composes to opt into the site-wide fluid contract.
 *
 * @remarks
 * The frame becomes its own containment context (`container-type:
 * inline-size`) and clamps its width via `clamp(min, 100cqi, max)` — no
 * viewport media queries, no JS observers on the hot path. Descendants
 * can read the frame's live dimensions via `100cqi` / `100cqb` or query
 * the container by name (`@container <name> (...)`).
 *
 * The frame publishes its own `--frame-w` / `--frame-h` custom
 * properties so children can compose fluid math without re-observing.
 *
 * @param ratio - Aspect ratio string (`"16/9"`, `"4/3"`, `"1"`).
 * @param min   - Lower width bound; accepts any CSS length (default `20rem`).
 * @param max   - Upper width bound; accepts any CSS length (default `120rem`).
 * @param name  - Optional container name for `@container` queries.
 * @public
 */
import type { CSSProperties, ReactNode } from "react";
import { fluidContainerStyle } from "../../utils/fluid-container.util";

interface FluidFrameProps {
  readonly children: ReactNode;
  readonly ratio?: string;
  readonly min?: string;
  readonly max?: string;
  readonly name?: string;
  readonly className?: string;
}

export function FluidFrame({
  children,
  ratio,
  min = "20rem",
  max = "120rem",
  name,
  className,
}: FluidFrameProps) {
  const style: CSSProperties = {
    ...fluidContainerStyle({ name }),
    width: `clamp(${min}, 100%, ${max})`,
    aspectRatio: ratio,
    // Publish live size for descendants via CSS variables.
    // 100cqi/100cqb resolve to the frame's inline/block dimensions.
    ["--frame-w" as never]: "100cqi",
    ["--frame-h" as never]: "100cqb",
  };
  return (
    <div className={className} style={style} data-fluid-frame={name ?? ""}>
      {children}
    </div>
  );
}
