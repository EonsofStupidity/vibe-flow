/**
 * Deck navigation math — pure, side-effect free.
 */
export function clampIndex(index: number, total: number): number {
  if (total <= 0) return 0;
  if (index < 0) return 0;
  if (index >= total) return total - 1;
  return index;
}

export function nextIndex(index: number, total: number): number {
  return clampIndex(index + 1, total);
}

export function prevIndex(index: number, total: number): number {
  return clampIndex(index - 1, total);
}
