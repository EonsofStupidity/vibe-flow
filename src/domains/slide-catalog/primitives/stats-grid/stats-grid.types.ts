import type { ReactNode } from "react";
import type { ToneName, Density } from "../types";

export interface StatItem {
  readonly id: string;
  readonly value: ReactNode;
  readonly label: ReactNode;
  /** Optional back-of-card detail revealed on flip. */
  readonly detail?: ReactNode;
  /** Per-stat tone override. Falls back to `StatsGridProps.tone`. */
  readonly tone?: ToneName;
}

export interface StatsGridProps {
  readonly title?: ReactNode;
  readonly tone?: ToneName;
  readonly density?: Density;
  readonly stats: readonly StatItem[];
  /**
   * Whether tapping a stat flips it to reveal `detail`. Defaults `true`.
   * Cards without `detail` are non-interactive regardless.
   */
  readonly flippable?: boolean;
  readonly className?: string;
}
