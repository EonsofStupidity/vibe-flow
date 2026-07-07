import type { SlideDefinition } from "@/domains/deck/types/slide.types";
import { SlideFrame } from "@/domains/slide-catalog/primitives/slide-frame/slide-frame";
import { QuoteBlock } from "@/domains/slide-catalog/primitives/quote-block/quote-block";

export const quoteSlide: SlideDefinition = {
  id: "quote-showcase",
  kind: "custom",
  title: "QuoteBlock — violet tone, glow accent",
  render: () => (
    <SlideFrame align="center">
      <div className="mx-auto w-full max-w-4xl">
        <QuoteBlock
          tone="violet"
          quote="The best way to predict the future is to build it — and ship it before anyone else notices you're learning on the job."
          attribution="Every developer, eventually"
          attributionSub="Stack Overflow, circa always"
        />
      </div>
    </SlideFrame>
  ),
};
