import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn — merge conditional class strings with Tailwind conflict resolution.
 *
 * @remarks
 * Used by owned primitives and slide-catalog components. Behaviour identical
 * to the well-known shadcn `cn` helper; kept here so we own the utility.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
