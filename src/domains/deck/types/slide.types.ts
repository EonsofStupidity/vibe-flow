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
  /**
   * Zero-based reveal step within the current slide. `0` when the slide has
   * no reveals or on first mount. Wired by the step-aware runtime route
   * (see plan step 2); slides without reveals may ignore it.
   */
  readonly stepIndex: number;
}

/**
 * Reveal step — one addressable beat inside a slide. Ordered; the URL's
 * `$stepIndex` selects which reveal is currently active. Slide primitives
 * read `ctx.stepIndex` and consult their own `reveals` list to decide what
 * to show. Kept structural (not an ArkType schema) because slides declare
 * reveals inline in TSX; the ArkType schema lives beside the episode
 * manifest for build-time validation of authored data.
 */
export interface RevealStep {
  readonly id: string;
  readonly label: string;
  readonly tone?: import("@/domains/theme/foundry/source/effects/effects.matrix").ToneName;
}

/**
 * Script link — points a slide at its MDX beats. `beats` mirrors the beat
 * ids declared in the MDX frontmatter so slide reveals and presenter
 * teleprompter stay in lockstep.
 */
export interface SlideScriptLink {
  readonly file: string;
  readonly beats: readonly string[];
}

export interface SlideDefinition {
  readonly id: string;
  readonly kind: SlideKind;
  readonly title: string;
  readonly render: (ctx: SlideRenderContext) => ReactNode;
  readonly chrome?: SlideChrome;
  readonly allowAnnotate?: boolean;
  /**
   * Chapter this slide belongs to. Required for EOS episodes (enforced by
   * the episode manifest schema); optional at the slide-type level so
   * pre-existing standalone decks (ep-000, ep-001) keep compiling.
   */
  readonly chapterId?: string;
  /** Ordered reveal beats. Absent → slide has no step axis. */
  readonly reveals?: readonly RevealStep[];
  /** Link to the slide's MDX script for the presenter/teleprompter surface. */
  readonly script?: SlideScriptLink;
}

