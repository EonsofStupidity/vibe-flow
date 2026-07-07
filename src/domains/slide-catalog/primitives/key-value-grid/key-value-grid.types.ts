import type { ToneName } from "../types";

export interface KeyValuePair {
  readonly id: string;
  readonly term: string;
  readonly definition: string;
}

export interface KeyValueGridProps {
  readonly pairs: readonly KeyValuePair[];
  readonly tone?: ToneName;
  readonly columns?: 1 | 2;
  readonly className?: string;
}
