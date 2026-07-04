/**
 * Sample comparator slide — demonstrates ComparatorPanel with live widgets.
 */
import { useAtom } from "jotai";
import { atom } from "jotai";
import type { SlideDefinition } from "@/domains/deck/types/slide.types";
import { SlideFrame } from "@/domains/slide-catalog/primitives/SlideFrame/SlideFrame";
import { ComparatorPanel } from "@/domains/slide-catalog/primitives/ComparatorPanel/ComparatorPanel";

/** Slide-local Jotai atom per workspace guidance: feature-workflow UI state. */
const latencyAtom = atom(60);

function LatencySlider() {
  const [ms, setMs] = useAtom(latencyAtom);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Simulated first-token latency
        </span>
        <span className="font-display text-4xl tabular-nums text-primary">{ms}ms</span>
      </div>
      <input
        type="range"
        min={20}
        max={2000}
        step={10}
        value={ms}
        onChange={(e) => setMs(Number(e.target.value))}
        aria-label="Latency simulator"
        className="h-3 w-full appearance-none rounded-full bg-secondary accent-[color:var(--primary)]"
      />
      <ul className="grid grid-cols-3 gap-3 text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
        <li className="rounded-md bg-secondary/60 py-2">Snappy</li>
        <li className="rounded-md bg-secondary/60 py-2">Human</li>
        <li className="rounded-md bg-secondary/60 py-2">Painful</li>
      </ul>
    </div>
  );
}

function CostReadout() {
  return (
    <div className="flex flex-col gap-4">
      <div className="font-display text-6xl leading-none text-foreground">$0.00</div>
      <div className="text-lg text-muted-foreground">
        Marginal cost per token. Your electric bill is a separate conversation.
      </div>
      <ul className="mt-2 space-y-2 font-mono text-sm text-muted-foreground">
        <li>· No provider account</li>
        <li>· No rate limit</li>
        <li>· Bring your own VRAM</li>
      </ul>
    </div>
  );
}

export const comparatorSlide: SlideDefinition = {
  id: "comparator",
  kind: "comparator",
  title: "Frontier vs local — live",
  render: () => (
    <SlideFrame align="stretch">
      <ComparatorPanel
        heading="Where do you actually want the model to live?"
        left={{
          label: "Frontier web AI",
          sub: "Hosted",
          accent: true,
          children: <LatencySlider />,
        }}
        right={{
          label: "Local LLM",
          sub: "On device",
          children: <CostReadout />,
        }}
      />
    </SlideFrame>
  ),
};
