import type { ToneName, Density } from "../types";

export interface SequenceStep {
  readonly id: string;
  readonly label: string;
  readonly detail?: string;
}

export interface NumberedSequenceProps {
  readonly steps: readonly SequenceStep[];
  /** How many steps to reveal. Wire to ctx.stepIndex + 1. */
  readonly revealCount?: number;
  readonly tone?: ToneName;
  readonly density?: Density;
  readonly className?: string;
}
