/**
 * `_shell` — pathless layout route wrapping workspace pages with the
 * DevPULSE Labs chrome (top bar, left rail, bottom bar, right panel).
 *
 * @remarks
 * The deck runtime (`/deck/$deckId/$slideIndex`) intentionally lives
 * OUTSIDE this layout so it remains a full-bleed slide surface.
 */
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/domains/shell/components/app-shell/app-shell";

export const Route = createFileRoute("/_shell")({
  component: ShellLayout,
});

function ShellLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
