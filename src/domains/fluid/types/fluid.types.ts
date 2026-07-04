/**
 * Shared types for the fluid clamp domain.
 */
export interface FluidRange {
  readonly min: number;
  readonly max: number;
  readonly minVp: number;
  readonly maxVp: number;
  readonly unit: "rem" | "px";
}
