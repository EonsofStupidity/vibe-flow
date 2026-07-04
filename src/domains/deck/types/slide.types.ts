/**
 * Slide contract — the boring, predictable API every slide implements.
 *
 * @remarks
 * A slide is a pure TSX module exporting a SlideDefinition. The runtime
 * does not mutate slides; it just calls render() with a context.
 */
import type { ReactNode } from "react";

export type SlideKind = "title" | "still" | "comparator" | "custom";

export type SlideChrome = "default" | "dim" | "hidden";

export interface SlideRenderContext {
  readonly deckId: string;
  readonly index: number;
  readonly total: number;
}

export interface SlideDefinition {
  readonly id: string;
  readonly kind: SlideKind;
  readonly title: string;
  readonly render: (ctx: SlideRenderContext) => ReactNode;
  readonly chrome?: SlideChrome;
  readonly allowAnnotate?: boolean;
}
