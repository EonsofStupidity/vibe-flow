/**
 * Shell types — shared shape used across store, context, components.
 */
import type { BrandId } from "@/domains/theme/foundry.tokens";

export type LeftMode = "collapsed" | "expanded";
export type RightTab = "notes" | "queue" | "inspector" | "data";

export interface ShellSize {
  readonly width: number;   // inner content rect width in CSS px
  readonly height: number;  // inner content rect height in CSS px
  readonly dpr: number;     // devicePixelRatio at last measurement
}

export interface ShellStateShape {
  readonly leftMode: LeftMode;
  readonly rightOpen: boolean;
  readonly rightTab: RightTab;
  readonly fullBleed: boolean;
  readonly brand: BrandId;
}
