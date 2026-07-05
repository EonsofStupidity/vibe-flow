/**
 * Valibot-validated localStorage persistence for the shell store.
 *
 * @remarks
 * Rejects malformed persisted state instead of silently coercing —
 * corrupt state resets to defaults so the shell always boots clean.
 */
import * as v from "valibot";
import type { ShellStateShape } from "../types/shell.types";

const schema = v.object({
  leftMode: v.picklist(["collapsed", "expanded"]),
  rightOpen: v.boolean(),
  rightTab: v.picklist(["notes", "queue", "inspector", "data"]),
  fullBleed: v.boolean(),
  brand: v.picklist(["eos", "news", "vibes"]),
});

const KEY = "devpulse:shell:v1";

export const shellDefaults: ShellStateShape = {
  leftMode: "expanded",
  rightOpen: false,
  rightTab: "notes",
  fullBleed: false,
  brand: "eos",
};

export function loadShellState(): ShellStateShape {
  if (typeof window === "undefined") return shellDefaults;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return shellDefaults;
    const parsed = v.parse(schema, JSON.parse(raw));
    return parsed;
  } catch {
    return shellDefaults;
  }
}

export function saveShellState(state: ShellStateShape): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // storage full / disabled — silently skip; state stays in-memory
  }
}
