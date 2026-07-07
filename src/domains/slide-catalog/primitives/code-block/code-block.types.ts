import type { ToneName, Density } from "../types";

export interface CodeBlockProps {
  readonly title?: string;
  readonly language?: string;
  readonly code: string;
  /** 1-indexed line numbers to highlight (tone-tinted). */
  readonly highlights?: readonly number[];
  readonly tone?: ToneName;
  readonly density?: Density;
  /** Show the copy-to-clipboard button. Default `true`. */
  readonly showCopy?: boolean;
  readonly className?: string;
}
