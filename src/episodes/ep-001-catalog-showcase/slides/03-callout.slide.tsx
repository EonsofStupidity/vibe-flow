/**
 * Callout showcase slide — larger tone-driven panel with owned Button CTA.
 */
import type { SlideDefinition } from "@/domains/deck/types/slide.types";
import { SlideFrame } from "@/domains/slide-catalog/primitives/slide-frame/slide-frame";
import { CalloutCard } from "@/domains/slide-catalog/primitives/callout-card/callout-card";

export const calloutSlide: SlideDefinition = {
  id: "callout-showcase",
  kind: "custom",
  title: "CalloutCard — coral tone",
  render: () => (
    <SlideFrame align="center">
      <div className="mx-auto max-w-4xl">
        <CalloutCard
          tone="coral"
          kicker="Design principle"
          title="Every effect is one matrix cell."
          body="Tone in as a prop, effect out as a CSS var. New primitives read the same 180 cells the tooltip and rail already read."
          cta={{ label: "Open the matrix", onPress: () => console.log("[showcase] cta pressed") }}
        />
      </div>
    </SlideFrame>
  ),
};
