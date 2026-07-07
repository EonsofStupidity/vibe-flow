/**
 * Episode manifest schema — the top-level contract every EOS episode
 * (and any future News / AngryVibes lesson) satisfies.
 *
 * @remarks
 * An episode owns one folder under `src/episodes/<id>/` and registers
 * two decks derived from the same slide list: `audience` (clean) and
 * `presenter` (script + reveals + timer). This schema validates the
 * authored manifest object at import time; slide `render` functions
 * are TS-typed and not part of the ArkType surface (functions do not
 * belong in runtime validators).
 *
 * The `chapters` array is the authoritative content spine — chapter
 * ids referenced by `SlideDefinition.chapterId` and by each
 * `QuizDefinition.chapterId` must appear here or the loader throws.
 *
 * @public
 */
import { type } from "arktype";

const PropertyEnum = type("'eos' | 'news' | 'vibes'");

const ChapterSchema = type({
  id: "string >= 1",
  title: "string >= 1",
  "summary?": "string",
  /** Id of the QuizDefinition that recaps this chapter. */
  recapId: "string >= 1",
});

export const EpisodeManifestSchema = type({
  id: "string >= 1",
  property: PropertyEnum,
  title: "string >= 1",
  "eyebrow?": "string",
  "summary?": "string",
  chapters: ChapterSchema.array().atLeastLength(1),
});

export type EpisodeProperty = typeof PropertyEnum.infer;
export type ChapterMeta = typeof ChapterSchema.infer;
export type EpisodeManifest = typeof EpisodeManifestSchema.infer;
