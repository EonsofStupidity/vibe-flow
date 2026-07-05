/**
 * Shell store — chrome visibility, sidebar modes, active brand.
 *
 * @remarks
 * Zustand per workspace rule (shell/app state). Persists to localStorage
 * through a valibot-validated adapter — corrupt state resets to defaults.
 */
import { create } from "zustand";
import type { BrandId } from "@/domains/theme/foundry/foundry.tokens";
import type { LeftMode, RightTab, ShellStateShape } from "../types/shell.types";
import { loadShellState, saveShellState, shellDefaults } from "./shell.persist";

interface ShellState extends ShellStateShape {
  toggleLeft: () => void;
  setLeftMode: (mode: LeftMode) => void;
  toggleRight: () => void;
  setRightOpen: (open: boolean) => void;
  setRightTab: (tab: RightTab) => void;
  toggleFullBleed: () => void;
  setFullBleed: (v: boolean) => void;
  setBrand: (brand: BrandId) => void;
}

const initial: ShellStateShape =
  typeof window === "undefined" ? shellDefaults : loadShellState();

export const useShellStore = create<ShellState>((set, get) => {
  const persist = () => {
    const { leftMode, rightOpen, rightTab, fullBleed, brand } = get();
    saveShellState({ leftMode, rightOpen, rightTab, fullBleed, brand });
  };
  return {
    ...initial,
    toggleLeft: () => {
      set((s) => ({ leftMode: s.leftMode === "expanded" ? "collapsed" : "expanded" }));
      persist();
    },
    setLeftMode: (leftMode) => { set({ leftMode }); persist(); },
    toggleRight: () => { set((s) => ({ rightOpen: !s.rightOpen })); persist(); },
    setRightOpen: (rightOpen) => { set({ rightOpen }); persist(); },
    setRightTab: (rightTab) => { set({ rightTab, rightOpen: true }); persist(); },
    toggleFullBleed: () => { set((s) => ({ fullBleed: !s.fullBleed })); persist(); },
    setFullBleed: (fullBleed) => { set({ fullBleed }); persist(); },
    setBrand: (brand) => { set({ brand }); persist(); },
  };
});
