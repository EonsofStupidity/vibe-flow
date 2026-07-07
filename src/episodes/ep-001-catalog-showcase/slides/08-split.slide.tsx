import type { SlideDefinition } from "@/domains/deck/types/slide.types";
import { SlideFrame } from "@/domains/slide-catalog/primitives/slide-frame/slide-frame";
import { SplitLayout } from "@/domains/slide-catalog/primitives/split-layout/split-layout";
import { BulletsList } from "@/domains/slide-catalog/primitives/bullets-list/bullets-list";
import { StatsGrid } from "@/domains/slide-catalog/primitives/stats-grid/stats-grid";

export const splitSlide: SlideDefinition = {
  id: "split-showcase",
  kind: "custom",
  title: "SplitLayout — 2:3, bullets + stats",
  render: () => (
    <SlideFrame align="center">
      <div className="mx-auto w-full max-w-6xl">
        <SplitLayout ratio="2:3">
          <BulletsList
            tone="magenta"
            title="Why SplitLayout?"
            bullets={[
              { id: "a", label: "Arbitrary children", detail: "Any two primitives side-by-side." },
              { id: "b", label: "5 ratio variants",   detail: "1:1 · 2:3 · 3:2 · 1:2 · 2:1" },
              { id: "c", label: "Responsive",         detail: "Stacks below the md breakpoint." },
            ]}
          />
          <StatsGrid
            tone="lime"
            stats={[
              { id: "r", label: "Ratio variants", value: "5" },
              { id: "b", label: "Breakpoints",    value: "1" },
              { id: "l", label: "Lines of CSS",   value: "0", detail: "100% Tailwind" },
            ]}
          />
        </SplitLayout>
      </div>
    </SlideFrame>
  ),
};
