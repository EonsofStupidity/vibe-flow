/**
 * ToggleButton — owned RAC toggle. Uses `isSelected` / `onChange` for state.
 */
import { ToggleButton as AriaToggleButton } from "react-aria-components";
import { toggleButtonVariants } from "./toggle-button.variants";
import type { ToggleButtonProps } from "./toggle-button.types";

export function ToggleButton({ shape, className, children, ...rest }: ToggleButtonProps) {
  return (
    <AriaToggleButton {...rest} className={toggleButtonVariants({ shape, className })}>
      {children}
    </AriaToggleButton>
  );
}
