/**
 * Reveal-step schema — runtime validator for authored reveal beats.
 *
 * @remarks
 * The structural `RevealStep` interface lives in `slide.types.ts` because
 * slides declare reveals inline as TSX literals; this ArkType schema exists
 * so the episode manifest loader can validate authored data (script MDX
 * frontmatter, quiz definitions) against the same shape without drift.
 *
 * @public
 */
import { type } from "arktype";
import { TONE_NAMES } from "@/domains/theme/foundry/source/effects/effects.matrix";

const toneEnum = type.enumerated(...TONE_NAMES);

export const RevealStepSchema = type({
  id: "string >= 1",
  label: "string >= 1",
  "tone?": toneEnum,
});

export type RevealStepInput = typeof RevealStepSchema.infer;
