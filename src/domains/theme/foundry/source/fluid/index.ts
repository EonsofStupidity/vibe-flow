/**
 * Aggregated fluid scale sources — the foundry build transform iterates
 * this list to emit every `--sp-*`, `--fs-*`, `--r-*`, `--rail-*`,
 * `--panel-*`, `--slide-*` custom property in `primitives.css`.
 */
import { typeFluid }   from "./type.fluid";
import { spaceFluid }  from "./space.fluid";
import { radiusFluid } from "./radius.fluid";
import { shellFluid }  from "./shell.fluid";
import { slideFluid }  from "./slide.fluid";
import type { FluidSourceEntry } from "./fluid-source.types";

export interface FluidSourceGroup {
  readonly label: string;
  readonly entries: readonly FluidSourceEntry[];
}

export const fluidSourceGroups: readonly FluidSourceGroup[] = [
  { label: "Type ramp",       entries: typeFluid },
  { label: "Spacing steps",   entries: spaceFluid },
  { label: "Radii",           entries: radiusFluid },
  { label: "Shell chrome",    entries: shellFluid },
  { label: "Slide chrome",    entries: slideFluid },
];
