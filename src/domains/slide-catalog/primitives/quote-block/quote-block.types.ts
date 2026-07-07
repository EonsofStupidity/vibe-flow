import type { ToneName, Density } from "../types";

export interface QuoteBlockProps {
  readonly quote: string;
  readonly attribution?: string;
  readonly role?: string;
  readonly tone?: ToneName;
  readonly density?: Density;
  readonly className?: string;
}
