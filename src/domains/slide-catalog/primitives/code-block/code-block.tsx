/**
 * CodeBlock — tone-driven read-only source block with gutter + copy.
 *
 * @remarks
 * Not a syntax-highlighter; deliberately raw. Displays lines with a
 * gutter, tone-tinted line highlights, and an owned `Button` copy control.
 * `data-no-swipe` on the scroll region keeps deck gestures out.
 *
 * @public
 */
import { useState } from "react";
import { Button } from "@/domains/ui/button/button";
import { cn } from "@/domains/ui/utils/cn.util";
import { toneVars } from "../tone-vars.util";
import { codeBlockVariants } from "./code-block.variants";
import type { CodeBlockProps } from "./code-block.types";

export function CodeBlock({
  title,
  language,
  code,
  highlights,
  tone = "neutral",
  density,
  showCopy = true,
  className,
}: CodeBlockProps) {
  const slots = codeBlockVariants({ density });
  const lines = code.replace(/\n$/u, "").split("\n");
  const hl = new Set(highlights ?? []);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      }
    } catch {
      /* user denied clipboard; silent */
    }
  };

  return (
    <div style={toneVars(tone)} className={cn(slots.root(), className)}>
      <header className={slots.header()}>
        <div className="flex items-baseline gap-f3">
          {title ? <span className={slots.label()}>{title}</span> : null}
          {language ? <span className={slots.lang()}>{language}</span> : null}
        </div>
        {showCopy ? (
          <Button tone="ghost" shape="pill" onPress={copy} aria-label="Copy code">
            {copied ? "Copied" : "Copy"}
          </Button>
        ) : null}
      </header>
      <div data-no-swipe className={slots.scroll()}>
        <div className={slots.grid()} role="group" aria-label={title ?? "Code block"}>
          <div className={slots.gutter()}>
            {lines.map((_, i) => (
              <div key={i} className={slots.gutterCell()}>
                {i + 1}
              </div>
            ))}
          </div>
          <div>
            {lines.map((ln, i) => (
              <div key={i} data-hl={hl.has(i + 1)} className={slots.line()}>
                {ln === "" ? "\u00A0" : ln}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
