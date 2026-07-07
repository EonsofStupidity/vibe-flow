/**
 * Script loader service — registers and retrieves episode script beats.
 *
 * @remarks
 * Episodes call `registerScripts()` at module load time with an object
 * keyed by script ID (matching `SlideScriptLink.file`). This service
 * validates each entry against `ScriptFrontmatterSchema` and stores the
 * result for the presenter teleprompter to consume via `getScript(file)`.
 */
import { type } from "arktype";
import { ScriptFrontmatterSchema } from "../types/script.ark";
import type { ScriptFrontmatter } from "../types/script.ark";

const registry = new Map<string, ScriptFrontmatter>();

/**
 * Register script objects. Key should match `SlideScriptLink.file`.
 *
 * @example
 * ```ts
 * registerScripts({ "01-intro": { slideId: "intro", title: "Intro", beats: [...] } });
 * ```
 */
export function registerScripts(scripts: Record<string, unknown>): void {
  for (const [key, raw] of Object.entries(scripts)) {
    const result = ScriptFrontmatterSchema(raw);
    if (result instanceof type.errors) {
      console.error(`[script-loader] invalid script "${key}":`, result.summary);
      continue;
    }
    registry.set(key, result);
  }
}

/** Retrieve a validated script by its registered key. */
export function getScript(file: string): ScriptFrontmatter | undefined {
  return registry.get(file);
}

/** Clear all registered scripts (useful in tests). */
export function clearScripts(): void {
  registry.clear();
}
