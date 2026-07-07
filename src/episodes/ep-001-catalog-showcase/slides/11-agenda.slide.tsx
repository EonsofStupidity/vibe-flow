import type { SlideDefinition } from "@/domains/deck/types/slide.types";
import { SlideFrame } from "@/domains/slide-catalog/primitives/slide-frame/slide-frame";
import { AgendaList } from "@/domains/slide-catalog/primitives/agenda-list/agenda-list";

export const agendaSlide: SlideDefinition = {
  id: "agenda-showcase",
  kind: "custom",
  title: "AgendaList — brand tone, item 2 active",
  render: () => (
    <SlideFrame align="center">
      <div className="mx-auto w-full max-w-3xl">
        <AgendaList
          tone="brand"
          chapterLabel="Episode 001 · Agenda"
          activeIndex={1}
          items={[
            { id: "a1", label: "Design System Foundations",  detail: "Tokens, effects matrix, OKLCH colors" },
            { id: "a2", label: "Content Primitives",          detail: "BulletsList → AgendaList, all tone-driven" },
            { id: "a3", label: "Episode Contract",            detail: "Manifest + deck structure rules" },
            { id: "a4", label: "Presenter Host",              detail: "Teleprompter, timer, beat callouts" },
          ]}
        />
      </div>
    </SlideFrame>
  ),
};
