import type { ButtonProps as AriaButtonProps } from "react-aria-components";
import type { VariantProps } from "tailwind-variants";
import type { buttonVariants } from "./Button.variants";

export interface ButtonProps
  extends Omit<AriaButtonProps, "className" | "style" | "children">,
    VariantProps<typeof buttonVariants> {
  readonly className?: string;
  readonly children?: React.ReactNode;
}
