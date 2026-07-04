/**
 * Button — DevPULSE Labs owned RAC button.
 *
 * @remarks
 * Thin wrapper over {@link https://react-spectrum.adobe.com/react-aria/Button.html Button}
 * from `react-aria-components`. Styling reads from semantic tokens and RAC
 * `data-*` state selectors. Enforces the touchscreen tap-target minimum.
 */
import { Button as AriaButton } from "react-aria-components";
import { buttonVariants } from "./button.variants";
import type { ButtonProps } from "./button.types";

export function Button({ tone, shape, className, children, ...rest }: ButtonProps) {
  return (
    <AriaButton {...rest} className={buttonVariants({ tone, shape, className })}>
      {children}
    </AriaButton>
  );
}
