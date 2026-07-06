/**
 * Public type surface for the owned `Tooltip` primitive.
 */
import type { ReactNode } from "react";
import type { TooltipProps as AriaTooltipProps } from "react-aria-components";
import type { TooltipTone, TooltipSize } from "./tooltip.variants";

export type { TooltipTone, TooltipSize };

export interface TooltipProps
  extends Omit<AriaTooltipProps, "className" | "style" | "children"> {
  readonly tone?: TooltipTone;
  readonly size?: TooltipSize;
  /** Show the little OverlayArrow pointing at the trigger. Default `true`. */
  readonly showArrow?: boolean;
  /** Distance in `rem` between trigger and tooltip edge. Default `0.5`. */
  readonly offsetRem?: number;
  readonly className?: string;
  readonly children?: ReactNode;
}
