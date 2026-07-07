/**
 * Bullets showcase slide — exercises the tone × selection × keyboard
 * matrix on the owned BulletsList primitive.
 */
import type { SlideDefinition } from "@/domains/deck/types/slide.types";
import { SlideFrame } from "@/domains/slide-catalog/primitives/slide-frame/slide-frame";
import { BulletsList } from "@/domains/slide-catalog/primitives/bullets-list/bullets-list";

export const bulletsSlide: SlideDefinition = {
  id: "bullets-showcase",
  kind: "custom",
  title: "BulletsList — cyan tone, multi-select",
  render: () => (
    <SlideFrame align="center">
      <div className="mx-auto w-full max-w-5xl">
        <BulletsList
          tone="cyan"
          title="What lands in v1"
          bullets={[
            { id: "matrix",  label: "Effects matrix (tone × category)",  detail: "180 CSS vars, one file to grow horizontally." },
            { id: "tooltip", label: "RAC Tooltip with glass motion",     detail: "Placement-aware slide + sheen sweep + edge breathe." },
            { id: "rail",    label: "LeftRail wired to the matrix",       detail: "Per-item tone; hover / focus / press animate from `--fx-*-<tone>`." },
            { id: "content", label: "Content-driven slide primitives",   detail: "Bullets · Stats · Callout · Media hotspots · Code." },
          ]}
        />
      </div>
    </SlideFrame>
  ),
};
