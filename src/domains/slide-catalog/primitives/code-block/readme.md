# CodeBlock

Tone-driven read-only code block with gutter, tone-tinted line highlights,
and an owned `Button` copy control. Not a syntax highlighter.

```tsx
import { CodeBlock } from "@/domains/slide-catalog/primitives/code-block/code-block";

<CodeBlock
  tone="lime"
  title="tokens.css"
  language="css"
  highlights={[3]}
  code={`@import "./tokens/primitives.css";
@import "./tokens/effects.css";
@import "./tokens/semantics.css";
@import "./tokens/brands.css";`}
/>
```
