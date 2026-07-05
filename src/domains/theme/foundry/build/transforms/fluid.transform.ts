/**
 * Fluid transform — walks the scale sources under
 * `src/domains/theme/foundry/source/fluid/*.fluid.ts` and produces the
 * flat list of CSS custom properties (name + `clamp()` value) that the
 * build script writes into `primitives.css`.
 *
 * @remarks
 * Uses the SAME `fluidAxis` math the runtime `fluid()` / `useFluid`
 * helpers use, so the generated CSS and the runtime helpers stay
 * byte-identical.
 */
import { fluidAxis } from "@/domains/fluid/utils/fluid-axis.util";
import type { FluidToken } from "@/domains/fluid/types/fluid.types";
import { fluidSourceGroups, type FluidSourceGroup } from "../../source/fluid";

export interface FluidGroupOutput {
  readonly label: string;
  readonly tokens: readonly FluidToken[];
}

export function fluidGroups(): readonly FluidGroupOutput[] {
  return fluidSourceGroups.map((group: FluidSourceGroup) => {
    const tokens: FluidToken[] = [];
    for (const entry of group.entries) {
      tokens.push({
        name: entry.name,
        value: fluidAxis(entry),
      });
      if (entry.companions) {
        for (const c of entry.companions) {
          tokens.push({ name: c.suffix, value: String(c.value) });
        }
      }
    }
    return { label: group.label, tokens };
  });
}

/** Flat list — convenience for consumers that don't need the grouping. */
export function fluidTokens(): readonly FluidToken[] {
  return fluidGroups().flatMap((g) => g.tokens);
}
