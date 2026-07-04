/**
 * Runtime shell state — chrome visibility, annotate mode, navigator.
 *
 * @remarks
 * Zustand for shell/app state per workspace guidance. Slide-local
 * widget state uses Jotai atoms colocated with the widget instead.
 */
import { create } from "zustand";

interface RuntimeState {
  chromeHidden: boolean;
  annotateOn: boolean;
  navigatorOpen: boolean;
  toggleChrome: () => void;
  setChromeHidden: (v: boolean) => void;
  toggleAnnotate: () => void;
  toggleNavigator: () => void;
  setNavigatorOpen: (v: boolean) => void;
}

export const useRuntimeStore = create<RuntimeState>((set) => ({
  chromeHidden: false,
  annotateOn: false,
  navigatorOpen: false,
  toggleChrome: () => set((s) => ({ chromeHidden: !s.chromeHidden })),
  setChromeHidden: (chromeHidden) => set({ chromeHidden }),
  toggleAnnotate: () => set((s) => ({ annotateOn: !s.annotateOn })),
  toggleNavigator: () => set((s) => ({ navigatorOpen: !s.navigatorOpen })),
  setNavigatorOpen: (navigatorOpen) => set({ navigatorOpen }),
}));
