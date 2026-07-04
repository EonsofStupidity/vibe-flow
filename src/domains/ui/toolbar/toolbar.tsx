/**
 * Toolbar — owned RAC toolbar with grouped controls.
 *
 * @remarks
 * Re-exposes the RAC `Group` primitive as `ToolbarGroup` so callers can
 * section a toolbar into left/center/right regions with proper ARIA grouping.
 */
import {
  Toolbar as AriaToolbar,
  Group as AriaGroup,
  type ToolbarProps as AriaToolbarProps,
  type GroupProps as AriaGroupProps,
} from "react-aria-components";

interface ToolbarProps extends Omit<AriaToolbarProps, "className" | "children"> {
  readonly className?: string;
  readonly children?: React.ReactNode;
}

interface GroupProps extends Omit<AriaGroupProps, "className" | "children"> {
  readonly className?: string;
  readonly children?: React.ReactNode;
}

export function Toolbar({ className, children, ...rest }: ToolbarProps) {
  return (
    <AriaToolbar {...rest} className={className}>
      {children}
    </AriaToolbar>
  );
}

export function ToolbarGroup({ className, children, ...rest }: GroupProps) {
  return (
    <AriaGroup {...rest} className={className}>
      {children}
    </AriaGroup>
  );
}
