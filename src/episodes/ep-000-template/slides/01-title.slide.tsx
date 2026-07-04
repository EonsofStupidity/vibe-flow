/**
 * Sample title slide — reference implementation for future episodes.
 */
import type { SlideDefinition } from "@/domains/deck/types/slide.types";
import { SlideFrame } from "@/domains/slide-catalog/primitives/slide-frame/slide-frame";
import { TitleCard } from "@/domains/slide-catalog/primitives/title-card/title-card";
import { CalloutBadge } from "@/domains/slide-catalog/primitives/callout-badge/callout-badge";

export const titleSlide: SlideDefinition = {
  id: "title",
  kind: "title",
  title: "Cold open",
  render: () => (
    <SlideFrame align="center">
      <div className="flex max-w-5xl flex-col gap-f7">
        <CalloutBadge tone="live">On air · Episode 000</CalloutBadge>
        <TitleCard
          eyebrow="Eons of Stupidity"
          title="Vibe coders, meet the frontier."
          subtitle="A live, on-camera tour of what Lovable, Bolt, and a local LLM each get right — and where each one hurts."
        />
      </div>
    </SlideFrame>
  ),
};
