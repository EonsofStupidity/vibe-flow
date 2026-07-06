/**
 * fluid-container — CSS payload for any element that wants to opt into
 * container-driven fluid layout.
 *
 * @remarks
 * Sets `container-type: inline-size` (or `size` for Y-axis queries) and
 * a `container-name` so descendants can target `@container <name> (...)`.
 * Returns a plain style object — safe for SSR, no runtime cost.
 *
 * @public
 */
import type { CSSProperties } from "react";

export type FluidContainerAxis = "inline" | "size";

export interface FluidContainerOptions {
  readonly name?: string;
  readonly axis?: FluidContainerAxis;
}

export function fluidContainerStyle(opts: FluidContainerOptions = {}): CSSProperties {
  const axis = opts.axis ?? "inline";
  return {
    containerType: axis === "size" ? "size" : "inline-size",
    containerName: opts.name,
  } as CSSProperties;
}
