/**
 * MediaHotspots showcase slide — inline SVG art + tone-varied hotspots.
 *
 * @remarks
 * Uses an inline data-URI SVG so the showcase has no image asset dependency.
 */
import type { SlideDefinition } from "@/domains/deck/types/slide.types";
import { SlideFrame } from "@/domains/slide-catalog/primitives/slide-frame/slide-frame";
import { MediaHotspots } from "@/domains/slide-catalog/primitives/media-hotspots/media-hotspots";

const SVG = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%230e1230'/><stop offset='1' stop-color='%231a0a2e'/></linearGradient></defs><rect width='100%25' height='100%25' fill='url(%23g)'/><circle cx='260' cy='200' r='70' fill='none' stroke='%237bd5ff' stroke-width='2' opacity='0.6'/><circle cx='540' cy='140' r='58' fill='none' stroke='%23ff7bd5' stroke-width='2' opacity='0.6'/><circle cx='420' cy='340' r='90' fill='none' stroke='%23d5ff7b' stroke-width='2' opacity='0.6'/><path d='M260 200 L540 140 L420 340 Z' fill='none' stroke='%23888' stroke-width='1' stroke-dasharray='4 4' opacity='0.4'/></svg>`;

export const mediaSlide: SlideDefinition = {
  id: "media-showcase",
  kind: "custom",
  title: "MediaHotspots — three tones on one image",
  render: () => (
    <SlideFrame align="center">
      <div className="mx-auto flex h-full w-full max-w-6xl">
        <MediaHotspots
          tone="cyan"
          src={SVG}
          alt="Abstract topology with three tone-tinted anchors"
          caption="Each hotspot picks its own tone from the matrix."
          hotspots={[
            { id: "a", x: 32, y: 44, tone: "cyan",    label: "Cyan anchor" },
            { id: "b", x: 67, y: 30, tone: "magenta", label: "Magenta anchor" },
            { id: "c", x: 52, y: 75, tone: "lime",    label: "Lime anchor" },
          ]}
        />
      </div>
    </SlideFrame>
  ),
};
