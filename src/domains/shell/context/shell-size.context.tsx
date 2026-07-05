/**
 * ShellSize context — publishes the measured inner content rect to
 * children via `ResizeObserver`. Consumers read with `useShellSize()`.
 *
 * @remarks
 * The content region owns the observer, not the window, so nested
 * children get the actual usable rect (post-sidebars, post-topbar) —
 * fluid math based on this is accurate regardless of chrome state.
 */
import { createContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { ShellSize } from "../types/shell.types";

interface ShellSizeContextValue {
  readonly size: ShellSize;
  readonly ref: (el: HTMLElement | null) => void;
}

export const ShellSizeContext = createContext<ShellSizeContextValue | null>(null);

const initialSize: ShellSize = { width: 0, height: 0, dpr: 1 };

export function ShellSizeProvider({ children }: { readonly children: ReactNode }) {
  const [size, setSize] = useState<ShellSize>(initialSize);
  const observerRef = useRef<ResizeObserver | null>(null);
  const elRef = useRef<HTMLElement | null>(null);

  const ref = useMemo(
    () => (el: HTMLElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      elRef.current = el;
      if (!el || typeof ResizeObserver === "undefined") return;
      const obs = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (!entry) return;
        const rect = entry.contentRect;
        setSize({
          width: rect.width,
          height: rect.height,
          dpr: typeof window !== "undefined" ? window.devicePixelRatio : 1,
        });
      });
      obs.observe(el);
      observerRef.current = obs;
    },
    [],
  );

  useEffect(
    () => () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    },
    [],
  );

  const value = useMemo(() => ({ size, ref }), [size, ref]);
  return <ShellSizeContext.Provider value={value}>{children}</ShellSizeContext.Provider>;
}
