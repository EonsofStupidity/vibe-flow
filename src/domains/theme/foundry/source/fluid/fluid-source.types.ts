/**
 * Typed shape for every entry in a `*.fluid.ts` source file.
 *
 * @remarks
 * The build-time transform reads these files and emits CSS custom
 * properties by calling `fluidAxis(entry)`. `name` becomes the property
 * name verbatim (`--<name>`), so pick names that match the tokens
 * components already consume (`sp-3`, `fs-body`, `rail-expanded`).
 */
import type { FluidAxisInput } from "@/domains/fluid/types/fluid.types";

export interface FluidSourceEntry extends FluidAxisInput {
  readonly name: string;
  /**
   * Emitted alongside the clamp when set — useful for type ramp
   * `--leading-*` / `--tracking-*` companions.
   */
  readonly companions?: readonly { readonly suffix: string; readonly value: string | number }[];
}
