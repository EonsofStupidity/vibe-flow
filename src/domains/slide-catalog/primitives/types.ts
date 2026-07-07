/**
 * Shared type surface for content-driven slide-catalog primitives.
 *
 * @remarks
 * Primitives added to `src/domains/slide-catalog/primitives/*` should
 * import `ToneName` from here rather than reaching into
 * `src/domains/theme/foundry/source/effects/*` — that keeps slide files
 * and primitives referencing only their own domain surface.
 *
 * Existing single-file primitives (`title-card`, `callout-badge`,
 * `still-zoomable`, `slide-frame`, `comparator-panel`) predate this shared
 * surface and are intentionally left untouched.
 */
export type { ToneName } from "@/domains/theme/foundry/source/effects/effects.matrix";

/**
 * Density scale — drives padding, min-height, and inter-element gap on
 * primitives that render structured content. `comfy` is the default and
 * matches the slides-app density budget (see `.workspace/skills`); `compact`
 * halves gaps and shrinks pill padding for dense reference slides.
 */
export type Density = "comfy" | "compact";
