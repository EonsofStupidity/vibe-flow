/**
 * Episode contract validator — enforces the mandatory folder structure
 * requirements at module load time (dev only; stripped in production).
 *
 * @remarks
 * Call `assertEpisodeContract(manifest, deck)` at the bottom of every
 * episode.ts. In development, it throws a descriptive error if any
 * structural requirement is violated. In production the check is a no-op.
 *
 * Required episode folder structure:
 *   ep-NNN-slug/
 *     episode.ts        — episode manifest + deck registration (this file)
 *     deck.ts           — deck definition (slides array)  [or inline in episode.ts]
 *     slides/           — one *.slide.tsx per slide
 *     script/           — one *.script.ts per scripted slide (if any)
 *     assets/           — optional: local images, SVGs, video thumbnails
 *     cover.svg|png     — required: episode thumbnail for the picker UI
 */
import type { EpisodeManifest } from "../types/episode.ark";
import type { Deck } from "../types/deck.types";

interface EpisodeContractOptions {
  /**
   * Set of slide ids in the deck. Validated against chapter ids when
   * the episode property is "eos".
   */
  readonly slideIds?: ReadonlySet<string>;
  /**
   * Provide if scripts are registered so chapter-slide linkage can be
   * validated. Optional — missing scripts are warned, not errored.
   */
  readonly scriptedSlideIds?: ReadonlySet<string>;
}

export function assertEpisodeContract(
  manifest: EpisodeManifest,
  deck: Deck,
  opts: EpisodeContractOptions = {},
): void {
  if (import.meta.env.PROD) return;

  const errors: string[] = [];

  // Deck id must match episode id.
  if (deck.id !== manifest.id) {
    errors.push(`deck.id "${deck.id}" must match episode manifest id "${manifest.id}"`);
  }

  // Episode must have at least one slide.
  if (deck.slides.length === 0) {
    errors.push("episode deck must contain at least one slide");
  }

  // All chapter ids must be unique.
  const chapterIds = manifest.chapters.map((c) => c.id);
  const duplicateChapters = chapterIds.filter((id, i) => chapterIds.indexOf(id) !== i);
  if (duplicateChapters.length > 0) {
    errors.push(`duplicate chapter ids: ${duplicateChapters.join(", ")}`);
  }

  // All slide ids must be unique.
  const slideIds = deck.slides.map((s) => s.id);
  const duplicateSlides = slideIds.filter((id, i) => slideIds.indexOf(id) !== i);
  if (duplicateSlides.length > 0) {
    errors.push(`duplicate slide ids: ${duplicateSlides.join(", ")}`);
  }

  // EOS episodes: every slide must declare a chapterId.
  if (manifest.property === "eos") {
    const slidesWithoutChapter = deck.slides.filter((s) => !s.chapterId);
    if (slidesWithoutChapter.length > 0) {
      errors.push(
        `EOS episode slides must declare chapterId. Missing on: ${slidesWithoutChapter.map((s) => s.id).join(", ")}`,
      );
    }

    // Chapter ids referenced by slides must exist in the manifest.
    const knownChapters = new Set(chapterIds);
    const orphanSlides = deck.slides.filter(
      (s) => s.chapterId && !knownChapters.has(s.chapterId),
    );
    if (orphanSlides.length > 0) {
      errors.push(
        `slides reference unknown chapter ids: ${orphanSlides.map((s) => `${s.id}→${s.chapterId}`).join(", ")}`,
      );
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `[episode-contract] "${manifest.id}" failed validation:\n  • ${errors.join("\n  • ")}`,
    );
  }
}
