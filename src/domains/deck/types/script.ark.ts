/**
 * Script frontmatter schema — validates the YAML head of every episode
 * MDX script file at load time.
 *
 * @remarks
 * Each MDX file under `src/episodes/<id>/script/*.mdx` declares its
 * `slideId` (must match a slide in the episode), a human `title`, and
 * an ordered `beats` array whose ids correspond to `RevealStep.id`
 * values on the slide. The script-loader service (plan step 5) runs
 * this schema and throws a legible error naming the file + beat when
 * it fails.
 *
 * @public
 */
import { type } from "arktype";

const ScriptBeatSchema = type({
  id: "string >= 1",
  cue: "string >= 1",
  "note?": "string",
});

export const ScriptFrontmatterSchema = type({
  slideId: "string >= 1",
  title: "string >= 1",
  beats: ScriptBeatSchema.array().atLeastLength(1),
});

export type ScriptBeat = typeof ScriptBeatSchema.infer;
export type ScriptFrontmatter = typeof ScriptFrontmatterSchema.infer;
