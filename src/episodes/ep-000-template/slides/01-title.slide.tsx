/**
 * Sample title slide — reference implementation for future episodes.
 */
import type { SlideDefinition } from "@/domains/deck/types/slide.types";
import { SlideFrame } from "@/domains/slide-catalog/primitives/SlideFrame/SlideFrame";
import { TitleCard } from "@/domains/slide-catalog/primitives/TitleCard/TitleCard";
import { CalloutBadge } from "@/domains/slide-catalog/primitives/CalloutBadge/CalloutBadge";

export const titleSlide: SlideDefinition = {
  id: "title",
  kind: "title",
  title: "Cold open",
  render: () => (
    <SlideFrame align="center">
      <div className="flex max-w-5xl flex-col gap-10">
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
