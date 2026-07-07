/**
 * Deck navigation math — pure, side-effect free.
 *
 * @remarks
 * Step-aware helpers layer on top of index math. `stepCount(slide)` returns
 * `slide.reveals?.length ?? 1` — slides without reveals collapse to a
 * single "step 0" so callers never branch on the presence of reveals.
 */
import type { Deck } from "@/domains/deck/types/deck.types";
import type { SlideDefinition } from "@/domains/deck/types/slide.types";

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

export function stepCount(slide: SlideDefinition): number {
  return slide.reveals?.length ?? 1;
}

export function clampStep(step: number, slide: SlideDefinition): number {
  const max = stepCount(slide) - 1;
  if (step < 0) return 0;
  if (step > max) return max;
  return step;
}

export interface DeckPosition {
  readonly index: number;
  readonly step: number;
}

/**
 * Advance one beat: next reveal step within the current slide, or step 0
 * of the next slide when we've exhausted this slide's reveals. Clamps at
 * the deck's last slide + last step.
 */
export function advance(deck: Deck, pos: DeckPosition): DeckPosition {
  const total = deck.slides.length;
  const index = clampIndex(pos.index, total);
  const slide = deck.slides[index];
  const step = clampStep(pos.step, slide);
  if (step < stepCount(slide) - 1) return { index, step: step + 1 };
  if (index >= total - 1) return { index, step };
  return { index: index + 1, step: 0 };
}

/**
 * Retreat one beat: previous reveal step, or last step of the previous
 * slide when we're at step 0. Clamps at { 0, 0 }.
 */
export function retreat(deck: Deck, pos: DeckPosition): DeckPosition {
  const total = deck.slides.length;
  const index = clampIndex(pos.index, total);
  const slide = deck.slides[index];
  const step = clampStep(pos.step, slide);
  if (step > 0) return { index, step: step - 1 };
  if (index <= 0) return { index, step: 0 };
  const prev = deck.slides[index - 1];
  return { index: index - 1, step: stepCount(prev) - 1 };
}

export function canAdvance(deck: Deck, pos: DeckPosition): boolean {
  const next = advance(deck, pos);
  return next.index !== pos.index || next.step !== pos.step;
}

export function canRetreat(deck: Deck, pos: DeckPosition): boolean {
  const prev = retreat(deck, pos);
  return prev.index !== pos.index || prev.step !== pos.step;
}
