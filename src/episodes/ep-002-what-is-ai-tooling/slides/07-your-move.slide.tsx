import type { SlideDefinition } from "@/domains/deck/types/slide.types";
import { SlideFrame } from "@/domains/slide-catalog/primitives/slide-frame/slide-frame";
import { CalloutCard } from "@/domains/slide-catalog/primitives/callout-card/callout-card";
import { StatsGrid } from "@/domains/slide-catalog/primitives/stats-grid/stats-grid";

export const yourMoveSlide: SlideDefinition = {
  id: "ep002-your-move",
  kind: "custom",
  title: "Your Move",
  render: () => (
    <SlideFrame align="center">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-f8">
        <CalloutCard
          tone="lime"
          title="One thing before next episode."
          body="Open Bolt, Cursor, or Claude.ai. Give it a task you actually need done. Read the output line by line before you accept it. Then ask yourself: do I understand this?"
        />
        <StatsGrid
          tone="brand"
          stats={[
            { id: "s1", label: "Tools covered next",   value: "3",    detail: "Bolt · Cursor · Claude.ai" },
            { id: "s2", label: "Things to review",      value: "100%", detail: "Every line of AI output" },
            { id: "s3", label: "Deploys before review", value: "0",    detail: "Review first, ship second" },
          ]}
        />
      </div>
    </SlideFrame>
  ),
};
