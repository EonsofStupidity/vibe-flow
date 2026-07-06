/**
 * AppShell — the workspace frame: top / left / content / right-overlay / bottom.
 *
 * @remarks
 * Flex topology. The content region owns a `ResizeObserver` and publishes
 * its inner rect through `ShellSizeContext`. Full-bleed mode hides every
 * chrome region and shows only the `FullbleedExit` affordance.
 */
import type { ReactNode } from "react";
import { ShellSizeProvider } from "../../context/shell-size.context";
import { useShellSizeRef } from "../../context/useShellSize";
import { useShellKeyboard } from "../../hooks/useShellKeyboard";
import { useShellStore } from "../../state/shell.store";
import { TopBar } from "../top-bar/top-bar";
import { LeftRail } from "../left-rail/left-rail";
import { BottomBar } from "../bottom-bar/bottom-bar";
import { RightPanel } from "../right-panel/right-panel";
import { FullbleedExit } from "../fullbleed-exit/fullbleed-exit";

interface AppShellProps {
  readonly children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <ShellSizeProvider>
      <AppShellInner>{children}</AppShellInner>
    </ShellSizeProvider>
  );
}

function AppShellInner({ children }: AppShellProps) {
  const fullBleed = useShellStore((s) => s.fullBleed);
  const brand = useShellStore((s) => s.brand);
  const sizeRef = useShellSizeRef();
  useShellKeyboard();

  return (
    <div data-brand={brand} className="flex h-dvh w-dvw flex-col overflow-hidden bg-surface text-ink">
      {!fullBleed ? <TopBar /> : null}
      <div className="relative flex min-h-0 flex-1">
        {!fullBleed ? <LeftRail /> : null}
        <main
          ref={sizeRef}
          className="container-q relative min-w-0 flex-1 overflow-auto"
          style={{ containerName: "shell-content" }}
        >
          {children}
        </main>
        {!fullBleed ? <RightPanel /> : null}
      </div>
      {!fullBleed ? <BottomBar /> : null}
      <FullbleedExit />
    </div>
  );
}
