/**
 * Legacy audience route — redirects to the step-aware canonical URL.
 *
 * @remarks
 * Kept alive so bookmarks and shared links stay valid. All rendering now
 * happens at `/deck/$deckId/$slideIndex/$stepIndex`.
 */
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/deck/$deckId/$slideIndex/")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/deck/$deckId/$slideIndex/$stepIndex",
      params: { ...params, stepIndex: "0" },
      replace: true,
    });
  },
});
