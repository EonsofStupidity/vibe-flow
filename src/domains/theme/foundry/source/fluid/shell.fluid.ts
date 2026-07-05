/**
 * Fluid shell chrome — emits `--rail-collapsed`, `--rail-expanded`,
 * `--panel-width`, `--topbar-height`, `--bottombar-height`, `--tap-min`.
 *
 * @remarks
 * `rail-expanded` is hard-capped at 10.3125rem (165px @ 16px root) per
 * the shell scope requirement — the max in the clamp is the ceiling.
 * `rail-collapsed` stays above the 56px tap-target floor at all widths.
 * `tap-min` is intentionally static (4rem = 64px) so touch targets never
 * shrink below the accessibility floor.
 */
import type { FluidSourceEntry } from "./fluid-source.types";

export const shellFluid: readonly FluidSourceEntry[] = [
  { name: "rail-collapsed",   min: 3.5000, max: 4.2500 },   // 56 → 68px
  { name: "rail-expanded",    min: 8.5000, max: 10.3125 },  // 136 → 165px HARD CAP
  { name: "panel-width",      min: 20.000, max: 28.0000 },  // 320 → 448px
  { name: "topbar-height",    min: 3.0000, max: 3.7500 },   // 48 → 60px
  { name: "bottombar-height", min: 2.2500, max: 2.7500 },   // 36 → 44px
  { name: "tap-min",          min: 4.0000, max: 4.0000 },   // 64px floor, non-fluid
];
