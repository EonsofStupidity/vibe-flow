import type { SlideDefinition } from "@/domains/deck/types/slide.types";
import { SlideFrame } from "@/domains/slide-catalog/primitives/slide-frame/slide-frame";
import { AgendaList } from "@/domains/slide-catalog/primitives/agenda-list/agenda-list";

export const agendaSlide: SlideDefinition = {
  id: "ep002-agenda",
  kind: "custom",
  title: "Agenda",
  render: () => (
    <SlideFrame align="center">
      <div className="mx-auto w-full max-w-3xl">
        <AgendaList
          tone="lime"
          chapterLabel="What we're covering today"
          items={[
            { id: "a1", label: "What does AI Tooling mean?",   detail: "A working definition, not marketing copy" },
            { id: "a2", label: "The three layers",              detail: "Model · Runtime · Interface" },
            { id: "a3", label: "Where it actually lives",       detail: "IDE plugins, CLIs, web apps, agents" },
            { id: "a4", label: "Prompt is code",                detail: "Why your words are the program" },
            { id: "a5", label: "The trap: vibe coding",         detail: "Ship fast and learn nothing vs. learn fast and ship" },
            { id: "a6", label: "Your move",                     detail: "One thing to try before next episode" },
          ]}
        />
      </div>
    </SlideFrame>
  ),
};
