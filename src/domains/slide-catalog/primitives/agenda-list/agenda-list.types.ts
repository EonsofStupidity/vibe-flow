import type { ToneName, Density } from "../types";

export interface AgendaItem {
  readonly id: string;
  readonly label: string;
  readonly detail?: string;
}

export interface AgendaListProps {
  readonly chapterLabel?: string;
  readonly items: readonly AgendaItem[];
  /** 0-based index of the currently active item. */
  readonly activeIndex?: number;
  readonly tone?: ToneName;
  readonly density?: Density;
  readonly className?: string;
}
