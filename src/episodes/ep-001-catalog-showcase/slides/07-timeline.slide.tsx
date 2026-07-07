import type { SlideDefinition } from "@/domains/deck/types/slide.types";
import { SlideFrame } from "@/domains/slide-catalog/primitives/slide-frame/slide-frame";
import { TimelineRail } from "@/domains/slide-catalog/primitives/timeline-rail/timeline-rail";

export const timelineSlide: SlideDefinition = {
  id: "timeline-showcase",
  kind: "custom",
  title: "TimelineRail — cyan, horizontal, 3 of 5 revealed",
  render: () => (
    <SlideFrame align="center">
      <div className="mx-auto w-full max-w-5xl">
        <TimelineRail
          tone="cyan"
          orientation="horizontal"
          activeIndex={2}
          steps={[
            { id: "s1", label: "Design tokens",    detail: "CSS custom properties from the foundry" },
            { id: "s2", label: "Effects matrix",   detail: "Tone × category grid, 180 vars" },
            { id: "s3", label: "Slide primitives", detail: "Content-driven, tone-driven" },
            { id: "s4", label: "Episode contract", detail: "Manifest + deck validator" },
            { id: "s5", label: "Presenter host",   detail: "Teleprompter + timer" },
          ]}
        />
      </div>
    </SlideFrame>
  ),
};
