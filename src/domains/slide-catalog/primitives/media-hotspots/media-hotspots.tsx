/**
 * MediaHotspots — tone-driven image with pulsing hotspots.
 *
 * @remarks
 * Each hotspot is a `TooltipTrigger` wrapping a focusable `<button>` (via
 * `<Focusable>`), so pointer hover, touch tap, and keyboard focus all
 * reveal the label via the owned RAC `Tooltip`. Positions are percentages
 * of the image box (`x`, `y` in 0..100) so the layout stays fluid.
 *
 * @public
 */
import { Focusable } from "react-aria-components";
import { Tooltip, TooltipTrigger } from "@/domains/ui/tooltip/tooltip";
import { cn } from "@/domains/ui/utils/cn.util";
import { toneVars } from "../tone-vars.util";
import { mediaHotspotsVariants } from "./media-hotspots.variants";
import type { MediaHotspotsProps } from "./media-hotspots.types";

export function MediaHotspots({
  src,
  alt,
  caption,
  tone = "neutral",
  hotspots,
  className,
}: MediaHotspotsProps) {
  const slots = mediaHotspotsVariants();
  return (
    <figure style={toneVars(tone)} className={cn(slots.root(), className)}>
      <div data-no-swipe className={slots.frame()}>
        <img src={src} alt={alt} draggable={false} className={slots.image()} />
        {hotspots.map((h) => {
          const style = {
            left: `${h.x}%`,
            top: `${h.y}%`,
            width: "3rem",
            height: "3rem",
            ...toneVars(h.tone ?? tone),
          } as React.CSSProperties;
          return (
            <TooltipTrigger key={h.id} delay={120} closeDelay={80}>
              <Focusable>
                <button
                  type="button"
                  aria-label={typeof h.label === "string" ? h.label : "Hotspot"}
                  style={style}
                  className={slots.hotspot()}
                >
                  <span aria-hidden className={slots.dot()} />
                </button>
              </Focusable>
              <Tooltip tone={h.tone ?? tone} placement="top" size="md">
                {h.label}
              </Tooltip>
            </TooltipTrigger>
          );
        })}
      </div>
      {caption ? <figcaption className={slots.caption()}>{caption}</figcaption> : null}
    </figure>
  );
}
