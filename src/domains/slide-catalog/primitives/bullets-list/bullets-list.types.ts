import type { ReactNode } from "react";
import type { ToneName, Density } from "../types";

export interface BulletItem {
  readonly id: string;
  readonly label: ReactNode;
  readonly detail?: ReactNode;
}

export interface BulletsListProps {
  readonly title?: ReactNode;
  readonly tone?: ToneName;
  readonly density?: Density;
  readonly bullets: readonly BulletItem[];
  /** Controlled selection (bullet ids). If omitted, selection is uncontrolled. */
  readonly selectedIds?: readonly string[];
  readonly onSelectionChange?: (ids: readonly string[]) => void;
  /** Allow selecting multiple bullets simultaneously. Default `true`. */
  readonly multi?: boolean;
  readonly className?: string;
}
