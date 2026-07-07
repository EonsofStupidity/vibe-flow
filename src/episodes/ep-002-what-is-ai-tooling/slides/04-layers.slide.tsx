import type { SlideDefinition } from "@/domains/deck/types/slide.types";
import { SlideFrame } from "@/domains/slide-catalog/primitives/slide-frame/slide-frame";
import { NumberedSequence } from "@/domains/slide-catalog/primitives/numbered-sequence/numbered-sequence";

export const layersSlide: SlideDefinition = {
  id: "ep002-layers",
  kind: "custom",
  title: "The Three Layers",
  render: () => (
    <SlideFrame align="center">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-f7">
        <div>
          <div className="font-mono text-eyebrow uppercase tracking-[0.3em] text-brand">Architecture</div>
          <h2 className="mt-f3 font-display text-h1 font-bold leading-tight text-ink-strong">
            Every AI tool has three layers.
          </h2>
        </div>
        <NumberedSequence
          tone="cyan"
          steps={[
            {
              id: "l1",
              label: "Model",
              detail: "The LLM itself — GPT-4o, Claude 3.5, Gemini, Llama. This is what predicts tokens. You rarely touch it directly.",
            },
            {
              id: "l2",
              label: "Runtime",
              detail: "The plumbing between you and the model. Context windows, tool calls, RAG, memory, system prompts. This is where the magic and the mistakes live.",
            },
            {
              id: "l3",
              label: "Interface",
              detail: "What you see: a chat box, an IDE plugin, a CLI, an agent loop. Different interfaces encourage wildly different mental models.",
            },
          ]}
        />
      </div>
    </SlideFrame>
  ),
};
