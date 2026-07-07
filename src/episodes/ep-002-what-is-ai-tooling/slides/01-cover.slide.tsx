import type { SlideDefinition } from "@/domains/deck/types/slide.types";
import { SlideFrame } from "@/domains/slide-catalog/primitives/slide-frame/slide-frame";
import { TitleCard } from "@/domains/slide-catalog/primitives/title-card/title-card";
import { CalloutBadge } from "@/domains/slide-catalog/primitives/callout-badge/callout-badge";

export const coverSlide: SlideDefinition = {
  id: "ep002-cover",
  kind: "title",
  title: "What is AI Tooling?",
  render: () => (
    <SlideFrame align="center">
      <div className="flex max-w-5xl flex-col gap-f7">
        <CalloutBadge tone="live">EoS · Episode 002</CalloutBadge>
        <TitleCard
          eyebrow="Eons of Stupidity"
          title="What is AI Tooling?"
          subtitle="From autocomplete to agents — what these tools actually do under the hood, and how to use them without getting played."
        />
      </div>
    </SlideFrame>
  ),
};
