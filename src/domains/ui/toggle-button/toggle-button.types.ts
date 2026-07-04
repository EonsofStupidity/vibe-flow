import type { ToggleButtonProps as AriaToggleButtonProps } from "react-aria-components";
import type { VariantProps } from "tailwind-variants";
import type { toggleButtonVariants } from "./toggle-button.variants";

export interface ToggleButtonProps
  extends Omit<AriaToggleButtonProps, "className" | "style" | "children">,
    VariantProps<typeof toggleButtonVariants> {
  readonly className?: string;
  readonly children?: React.ReactNode;
}
