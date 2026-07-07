import type { SlideDefinition } from "@/domains/deck/types/slide.types";
import { SlideFrame } from "@/domains/slide-catalog/primitives/slide-frame/slide-frame";
import { KeyValueGrid } from "@/domains/slide-catalog/primitives/key-value-grid/key-value-grid";

export const definitionSlide: SlideDefinition = {
  id: "ep002-definition",
  kind: "custom",
  title: "What is AI Tooling?",
  render: () => (
    <SlideFrame align="center">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-f8">
        <div>
          <div className="font-mono text-eyebrow uppercase tracking-[0.3em] text-brand">
            Working definition
          </div>
          <h2 className="mt-f3 font-display text-display font-bold leading-tight text-ink-strong">
            AI Tooling
          </h2>
          <p className="mt-f4 max-w-3xl text-h2 text-ink-muted">
            Software that wraps a language model to perform a specific development task — writing, reviewing, explaining, or executing code.
          </p>
        </div>
        <KeyValueGrid
          tone="info"
          columns={2}
          pairs={[
            { id: "k1", term: "Not",         definition: "Magic. It predicts the next token based on patterns it learned." },
            { id: "k2", term: "Also not",    definition: "A search engine. It generates, not retrieves." },
            { id: "k3", term: "But it is",   definition: "A very fast, very opinionated pair programmer." },
            { id: "k4", term: "Your job",    definition: "Know what you're asking for. Review what you get back." },
          ]}
        />
      </div>
    </SlideFrame>
  ),
};
