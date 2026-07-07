/**
 * QuoteBlock — large pull-quote with optional attribution and tone glow.
 *
 * @remarks
 * Tone drives the quotation mark colour, accent bar, and text-shadow.
 * No per-instance color logic — all effects flow through `--tone-*` vars
 * published by `toneVars(tone)`.
 *
 * @public
 */
import { cn } from "@/domains/ui/utils/cn.util";
import { toneVars } from "../tone-vars.util";
import { quoteBlockVariants } from "./quote-block.variants";
import type { QuoteBlockProps } from "./quote-block.types";

export function QuoteBlock({
  quote,
  attribution,
  role,
  tone = "neutral",
  density,
  className,
}: QuoteBlockProps) {
  const { root, mark, quote: quoteSlot, attribution: attrSlot, name, role: roleSlot, bar } = quoteBlockVariants({ density });

  return (
    <div style={toneVars(tone)} className={cn(root(), className)}>
      <span aria-hidden className={mark()}>&ldquo;</span>
      <div className="relative">
        <span aria-hidden className={bar()} />
        <blockquote className={quoteSlot()}>{quote}</blockquote>
      </div>
      {attribution ? (
        <footer className={attrSlot()}>
          <span className={name()}>{attribution}</span>
          {role ? <span className={roleSlot()}>{role}</span> : null}
        </footer>
      ) : null}
    </div>
  );
}
