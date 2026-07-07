import type { ReactNode } from "react";
import type { ToneName } from "../types";

export interface FullBleedMediaProps {
  /** Image src URL */
  readonly src: string;
  readonly alt: string;
  readonly overlay?: "none" | "top" | "bottom" | "full";
  readonly overlayStrength?: "light" | "medium" | "heavy";
  readonly tone?: ToneName;
  readonly children?: ReactNode;
  /** CSS object-fit. Defaults to "cover". */
  readonly fit?: "cover" | "contain" | "fill";
  readonly className?: string;
}
