/**
 * Tooltip — DevPULSE Labs owned RAC tooltip primitive.
 *
 * @remarks
 * Thin wrapper over
 * {@link https://react-spectrum.adobe.com/react-aria/Tooltip.html Tooltip}
 * from `react-aria-components`. Renders `Tooltip` + `OverlayArrow` with a
 * variant-driven surface. State (`data-entering` / `data-exiting` /
 * `data-placement`) comes straight from RAC — no JS animation.
 *
 * WAI-ARIA APG: RAC wires `aria-describedby` between the trigger and the
 * tooltip; there is no manual ARIA authoring at the call site. Tooltip is
 * non-interactive by design (RAC hides it on pointer leave / blur / Escape).
 *
 * Pair with the re-exported `TooltipTrigger` for the canonical shape:
 *
 * ```tsx
 * <TooltipTrigger delay={200} closeDelay={80}>
 *   <Link to="/">…</Link>
 *   <Tooltip tone="cyan" placement="right">Home</Tooltip>
 * </TooltipTrigger>
 * ```
 *
 * @public
 */
import {
  Tooltip as AriaTooltip,
  TooltipTrigger as AriaTooltipTrigger,
  OverlayArrow,
} from "react-aria-components";
import type { TooltipTriggerComponentProps } from "react-aria-components";
import { tooltipVariants } from "./tooltip.variants";
import type { TooltipProps } from "./tooltip.types";

const REM_TO_PX = 16;

export function Tooltip({
  tone,
  size,
  showArrow = true,
  offsetRem = 0.5,
  className,
  children,
  ...rest
}: TooltipProps) {
  const { root, arrow } = tooltipVariants({ tone, size });
  return (
    <AriaTooltip
      {...rest}
      offset={offsetRem * REM_TO_PX}
      className={root({ className })}
    >
      {showArrow ? (
        <OverlayArrow
          className={[
            "flex origin-center",
            "data-[placement=bottom]:rotate-180",
            "data-[placement=left]:-rotate-90",
            "data-[placement=right]:rotate-90",
          ].join(" ")}
        >
          <svg viewBox="0 0 12 8" aria-hidden="true" className={arrow()}>
            <path d="M0 0 L6 8 L12 0 Z" />
          </svg>
        </OverlayArrow>
      ) : null}
      {children}
    </AriaTooltip>
  );
}

/**
 * `TooltipTrigger` — re-typed re-export of RAC's `TooltipTrigger`. Provides
 * the trigger→tooltip pairing and delay controls; no visual concerns.
 *
 * @public
 */
export function TooltipTrigger(props: TooltipTriggerComponentProps) {
  return <AriaTooltipTrigger {...props} />;
}
