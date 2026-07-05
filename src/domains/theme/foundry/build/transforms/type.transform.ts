/**
 * Type transform — turns a fluid ramp entry into a CSS `clamp()` value
 * across the standard 24vw → 120vw window.
 */
import type { FluidType } from "../../source/semantic/type.semantic";

export function fluidClamp(min: number, max: number, minVw = 24, maxVw = 120): string {
  const slope = (max - min) / (maxVw - minVw);
  const intercept = min - slope * minVw;
  const vw = (slope * 100).toFixed(4);
  const base = intercept.toFixed(4);
  return `clamp(${min}rem, calc(${base}rem + ${vw}vw), ${max}rem)`;
}

export function typeEntries(ramp: readonly FluidType[]): readonly { name: string; value: string }[] {
  const out: { name: string; value: string }[] = [];
  for (const t of ramp) {
    out.push({ name: `type-${t.name}`, value: fluidClamp(t.min, t.max) });
    if (t.leading !== undefined) out.push({ name: `leading-${t.name}`, value: String(t.leading) });
    if (t.tracking !== undefined) out.push({ name: `tracking-${t.name}`, value: t.tracking });
  }
  return out;
}
