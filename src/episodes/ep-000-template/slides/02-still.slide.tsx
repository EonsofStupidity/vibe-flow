/**
 * Sample still slide — demonstrates StillZoomable primitive.
 */
import type { SlideDefinition } from "@/domains/deck/types/slide.types";
import { SlideFrame } from "@/domains/slide-catalog/primitives/slide-frame/slide-frame";
import { StillZoomable } from "@/domains/slide-catalog/primitives/still-zoomable/still-zoomable";
import cover from "../assets/cover.svg";

export const stillSlide: SlideDefinition = {
  id: "still",
  kind: "still",
  title: "The stack, laid bare",
  render: () => (
    <SlideFrame align="stretch" bleed={false}>
      <StillZoomable
        src={cover}
        alt="Diagram of frontier vs local LLM stacks"
        caption="Pinch to zoom. Double-tap to reset. Boring, predictable — on purpose."
      />
    </SlideFrame>
  ),
};
