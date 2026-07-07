import type { SlideDefinition } from "@/domains/deck/types/slide.types";
import { SlideFrame } from "@/domains/slide-catalog/primitives/slide-frame/slide-frame";
import { QuoteBlock } from "@/domains/slide-catalog/primitives/quote-block/quote-block";
import { BulletsList } from "@/domains/slide-catalog/primitives/bullets-list/bullets-list";

export const trapSlide: SlideDefinition = {
  id: "ep002-trap",
  kind: "custom",
  title: "The Vibe Coding Trap",
  render: () => (
    <SlideFrame align="center">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-f8">
        <QuoteBlock
          tone="coral"
          quote="It compiles, it runs, I don't know why, but we're shipping it anyway."
          attribution="Every vibe coder"
          attributionSub="Monday morning stand-up, universally"
        />
        <BulletsList
          tone="warning"
          title="Signs you're vibe coding"
          bullets={[
            { id: "v1", label: "You can't explain what the code does",      detail: "If you can't, neither can the next person — or you, in 3 months." },
            { id: "v2", label: "You regenerate instead of debug",           detail: "\"Just try again\" is not a debugging strategy." },
            { id: "v3", label: "You trust output without reviewing it",     detail: "Models hallucinate. Your job is to catch it." },
            { id: "v4", label: "The AI made all the architectural choices", detail: "Your system, your responsibility. Verify the decisions." },
          ]}
        />
      </div>
    </SlideFrame>
  ),
};
