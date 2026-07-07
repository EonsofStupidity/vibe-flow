import type { SlideDefinition } from "@/domains/deck/types/slide.types";
import { SlideFrame } from "@/domains/slide-catalog/primitives/slide-frame/slide-frame";
import { NumberedSequence } from "@/domains/slide-catalog/primitives/numbered-sequence/numbered-sequence";

export const sequenceSlide: SlideDefinition = {
  id: "numbered-sequence-showcase",
  kind: "custom",
  title: "NumberedSequence — coral tone, 4 of 5 revealed",
  render: () => (
    <SlideFrame align="center">
      <div className="mx-auto w-full max-w-3xl">
        <NumberedSequence
          tone="coral"
          revealCount={4}
          steps={[
            { id: "s1", label: "Clone the repo",     detail: "git clone git@github.com:your/project.git" },
            { id: "s2", label: "Install deps",        detail: "npm install — no Bun required" },
            { id: "s3", label: "Build tokens",        detail: "npx tsx src/domains/theme/foundry/build/build-tokens.ts" },
            { id: "s4", label: "Start the dev server",detail: "npm run dev — hot reload, no restart" },
            { id: "s5", label: "Open the deck",       detail: "Navigate to / and pick your episode" },
          ]}
        />
      </div>
    </SlideFrame>
  ),
};
