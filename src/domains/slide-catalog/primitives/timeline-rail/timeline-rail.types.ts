import type { ToneName, Density } from "../types";

export interface TimelineStep {
  readonly id: string;
  readonly label: string;
  readonly detail?: string;
}

export interface TimelineRailProps {
  readonly steps: readonly TimelineStep[];
  /** Currently active step index (0-based). Defaults to last revealed step. */
  readonly activeIndex?: number;
  readonly tone?: ToneName;
  readonly density?: Density;
  readonly orientation?: "horizontal" | "vertical";
  readonly className?: string;
}
