/**
 * Sample comparator slide — demonstrates ComparatorPanel with live widgets.
 */
import { useAtom } from "jotai";
import { atom } from "jotai";
import type { SlideDefinition } from "@/domains/deck/types/slide.types";
import { SlideFrame } from "@/domains/slide-catalog/primitives/slide-frame/slide-frame";
import { ComparatorPanel } from "@/domains/slide-catalog/primitives/comparator-panel/comparator-panel";

/** Slide-local Jotai atom per workspace guidance: feature-workflow UI state. */
const latencyAtom = atom(60);

function LatencySlider() {
  const [ms, setMs] = useAtom(latencyAtom);
  return (
    <div className="flex flex-col gap-f5">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-eyebrow uppercase tracking-[0.2em] text-ink-muted">
          Simulated first-token latency
        </span>
        <span className="font-display text-h1 tabular-nums text-brand">{ms}ms</span>
      </div>
      <input
        type="range"
        min={20}
        max={2000}
        step={10}
        value={ms}
        onChange={(e) => setMs(Number(e.target.value))}
        aria-label="Latency simulator"
        className="h-3 w-full appearance-none rounded-full bg-surface-raised accent-[color:var(--brand)]"
      />
      <ul className="grid grid-cols-3 gap-f2 text-center font-mono text-eyebrow uppercase tracking-widest text-ink-muted">
        <li className="rounded-f-md bg-surface-raised/60 py-f2">Snappy</li>
        <li className="rounded-f-md bg-surface-raised/60 py-f2">Human</li>
        <li className="rounded-f-md bg-surface-raised/60 py-f2">Painful</li>
      </ul>
    </div>
  );
}

function CostReadout() {
  return (
    <div className="flex flex-col gap-f4">
      <div className="font-display text-display leading-none text-ink-strong">$0.00</div>
      <div className="text-h3 text-ink-muted">
        Marginal cost per token. Your electric bill is a separate conversation.
      </div>
      <ul className="mt-f2 space-y-f2 font-mono text-body text-ink-muted">
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
