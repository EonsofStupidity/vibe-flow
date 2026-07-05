/**
 * useShellSize — typed consumer for the shell inner-rect context.
 *
 * @throws When used outside `<ShellSizeProvider>`.
 */
import { useContext } from "react";
import { ShellSizeContext } from "./shell-size.context";
import type { ShellSize } from "../types/shell.types";

export function useShellSize(): ShellSize {
  const ctx = useContext(ShellSizeContext);
  if (!ctx) throw new Error("useShellSize must be used inside <ShellSizeProvider>");
  return ctx.size;
}

/** Internal — the app-shell component uses this to attach the observer ref. */
export function useShellSizeRef(): (el: HTMLElement | null) => void {
  const ctx = useContext(ShellSizeContext);
  if (!ctx) throw new Error("useShellSizeRef must be used inside <ShellSizeProvider>");
  return ctx.ref;
}
