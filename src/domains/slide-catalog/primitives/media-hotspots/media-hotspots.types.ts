import type { ReactNode } from "react";
import type { ToneName } from "../types";

export interface Hotspot {
  readonly id: string;
  /** Position as a percentage of the image box, 0..100. */
  readonly x: number;
  readonly y: number;
  readonly label: ReactNode;
  readonly tone?: ToneName;
}

export interface MediaHotspotsProps {
  readonly src: string;
  readonly alt: string;
  readonly caption?: ReactNode;
  readonly tone?: ToneName;
  readonly hotspots: readonly Hotspot[];
  readonly className?: string;
}
