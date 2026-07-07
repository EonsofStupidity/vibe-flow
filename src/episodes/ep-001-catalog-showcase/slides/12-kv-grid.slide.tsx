import type { SlideDefinition } from "@/domains/deck/types/slide.types";
import { SlideFrame } from "@/domains/slide-catalog/primitives/slide-frame/slide-frame";
import { KeyValueGrid } from "@/domains/slide-catalog/primitives/key-value-grid/key-value-grid";

export const kvGridSlide: SlideDefinition = {
  id: "kv-grid-showcase",
  kind: "custom",
  title: "KeyValueGrid — info tone, 2 columns",
  render: () => (
    <SlideFrame align="center">
      <div className="mx-auto w-full max-w-4xl">
        <KeyValueGrid
          tone="info"
          columns={2}
          pairs={[
            { id: "fw",  term: "Framework",  definition: "TanStack Start · SSR React with file-based routing" },
            { id: "st",  term: "Styling",    definition: "Tailwind CSS v4 · OKLCH-first design tokens" },
            { id: "st2", term: "State",      definition: "Zustand (global) + Jotai (component-local)" },
            { id: "db",  term: "Database",   definition: "Supabase · PostgreSQL + pgvector" },
            { id: "va",  term: "Validation", definition: "ArkType v2 · runtime schema contracts" },
            { id: "ui",  term: "UI Kit",     definition: "React Aria Components · accessible by default" },
          ]}
        />
      </div>
    </SlideFrame>
  ),
};
