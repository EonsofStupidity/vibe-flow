/**
 * CalloutCard — larger emphasis panel with optional CTA.
 *
 * @remarks
 * Not to be confused with the pre-existing `CalloutBadge` chip primitive.
 * This is the display-sized cousin: full tone glass surface, tone edge
 * bar, kicker + title + body + optional owned `Button` CTA. Every visual
 * state reads the tone's effects-matrix column.
 *
 * @public
 */
import { Button } from "@/domains/ui/button/button";
import { cn } from "@/domains/ui/utils/cn.util";
import { toneVars } from "../tone-vars.util";
import { calloutCardVariants } from "./callout-card.variants";
import type { CalloutCardProps } from "./callout-card.types";

export function CalloutCard({
  tone = "brand",
  density,
  kicker,
  title,
  body,
  cta,
  className,
}: CalloutCardProps) {
  const slots = calloutCardVariants({ density });
  return (
    <section style={toneVars(tone)} className={cn(slots.root(), className)}>
      <span aria-hidden className={slots.sheen()} />
      <span aria-hidden className={slots.bar()} />
      <div className="relative z-10 flex flex-col gap-f4">
        {kicker ? <div className={slots.kicker()}>{kicker}</div> : null}
        <h2 className={slots.title()}>{title}</h2>
        {body ? <p className={slots.body()}>{body}</p> : null}
        {cta ? (
          <div className={slots.ctaRow()}>
            <Button tone="brand" shape="pill" onPress={cta.onPress} aria-label={cta.ariaLabel}>
              {cta.label}
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
