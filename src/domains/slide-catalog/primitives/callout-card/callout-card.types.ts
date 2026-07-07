import type { ReactNode } from "react";
import type { ToneName, Density } from "../types";

export interface CalloutCta {
  readonly label: ReactNode;
  readonly onPress: () => void;
  /** Optional accessible name override for icon-only CTAs. */
  readonly ariaLabel?: string;
}

export interface CalloutCardProps {
  readonly tone?: ToneName;
  readonly density?: Density;
  readonly kicker?: ReactNode;
  readonly title: ReactNode;
  readonly body?: ReactNode;
  readonly cta?: CalloutCta;
  readonly className?: string;
}
