import type { SlideDefinition } from "@/domains/deck/types/slide.types";
import { SlideFrame } from "@/domains/slide-catalog/primitives/slide-frame/slide-frame";
import { TerminalOutput } from "@/domains/slide-catalog/primitives/terminal-output/terminal-output";

export const terminalSlide: SlideDefinition = {
  id: "terminal-showcase",
  kind: "custom",
  title: "TerminalOutput — prompt/stdout/stderr",
  render: () => (
    <SlideFrame align="center">
      <div className="mx-auto w-full max-w-3xl">
        <TerminalOutput
          title="devpulse-labs ~ bootstrap"
          lines={[
            { id: "c1", kind: "comment", text: "# Clone and bootstrap DevPULSE Labs" },
            { id: "p1", kind: "prompt",  text: "git clone git@github.com:devpulse/labs.git" },
            { id: "o1", kind: "stdout",  text: "Cloning into 'labs'..." },
            { id: "o2", kind: "stdout",  text: "Resolving deltas: 100% (2847/2847), done." },
            { id: "p2", kind: "prompt",  text: "cd labs && npm install" },
            { id: "o3", kind: "stdout",  text: "added 312 packages in 4.2s" },
            { id: "p3", kind: "prompt",  text: "npm run dev" },
            { id: "o4", kind: "stdout",  text: "  VITE v8  ready in 312 ms" },
            { id: "o5", kind: "stdout",  text: "  → Local:   http://localhost:3000/" },
            { id: "e1", kind: "stderr",  text: "warn: tokens not found, running foundry…" },
            { id: "o6", kind: "stdout",  text: "  ✔ tokens built (143ms)" },
          ]}
        />
      </div>
    </SlideFrame>
  ),
};
