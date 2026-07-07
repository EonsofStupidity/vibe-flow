/**
 * Stats showcase slide — tap-to-flip cards driven by the effects matrix.
 */
import type { SlideDefinition } from "@/domains/deck/types/slide.types";
import { SlideFrame } from "@/domains/slide-catalog/primitives/slide-frame/slide-frame";
import { StatsGrid } from "@/domains/slide-catalog/primitives/stats-grid/stats-grid";

export const statsSlide: SlideDefinition = {
  id: "stats-showcase",
  kind: "custom",
  title: "StatsGrid — magenta tone, per-card tone overrides",
  render: () => (
    <SlideFrame align="center">
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-f4">
        <StatsGrid
          tone="magenta"
          title="Signal, not slides"
          stats={[
            { id: "a", tone: "cyan",    value: "180",  label: "Matrix cells",       detail: "10 tones × 18 categories. Add a column, everyone reads it." },
            { id: "b", tone: "lime",    value: "3",    label: "WCAG warns caught",   detail: "vibes / danger / warning are already sub-AA against light ink." },
            { id: "c", tone: "coral",   value: "0",    label: "Per-domain colors" },
            { id: "d", tone: "violet",  value: "4rem", label: "Min tap target",      detail: "Enforced at the primitive level via .tap-target." },
          ]}
        />
      </div>
    </SlideFrame>
  ),
};
