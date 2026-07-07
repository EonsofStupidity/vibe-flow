/**
 * Code showcase slide — read-only tone-tinted CodeBlock with line highlight.
 */
import type { SlideDefinition } from "@/domains/deck/types/slide.types";
import { SlideFrame } from "@/domains/slide-catalog/primitives/slide-frame/slide-frame";
import { CodeBlock } from "@/domains/slide-catalog/primitives/code-block/code-block";

const SAMPLE = `import "./tokens/primitives.css";
import "./tokens/effects.css";   /* ← tone × category matrix */
import "./tokens/semantics.css";
import "./tokens/brands.css";

const toneStyle = (tone) => ({
  "--rail-tone":  \`var(--fx-surface-\${tone})\`,
  "--rail-glass": \`var(--fx-wash-\${tone})\`,
  "--rail-halo":  \`var(--fx-halo-\${tone})\`,
});`;

export const codeSlide: SlideDefinition = {
  id: "code-showcase",
  kind: "custom",
  title: "CodeBlock — lime tone, line 2 highlighted",
  render: () => (
    <SlideFrame align="center">
      <div className="mx-auto flex h-full w-full max-w-5xl flex-col">
        <CodeBlock
          tone="lime"
          title="tokens.css"
          language="css / js"
          highlights={[2]}
          code={SAMPLE}
        />
      </div>
    </SlideFrame>
  ),
};
