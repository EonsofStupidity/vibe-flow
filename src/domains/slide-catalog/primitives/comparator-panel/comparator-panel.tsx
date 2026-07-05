/**
 * ComparatorPanel — side-by-side A/B panel for live demos.
 *
 * @remarks
 * Renders two named columns with a subtle center divider. Each column
 * accepts arbitrary children so a slide can drop live widgets in.
 */
import type { ReactNode } from "react";
import { cn } from "@/domains/ui/utils/cn.util";

interface Side {
  readonly label: string;
  readonly sub?: string;
  readonly accent?: boolean;
  readonly children: ReactNode;
}

interface ComparatorPanelProps {
  readonly heading?: string;
  readonly left: Side;
  readonly right: Side;
}

function Column({ side }: { side: Side }) {
  return (
    <div
      data-no-swipe
      className={cn(
        "flex h-full flex-col rounded-f-lg bg-surface-raised/70 p-f7 hairline-b",
        side.accent && "ring-1 ring-brand/60",
      )}
    >
      <div className="mb-f6 flex items-baseline justify-between">
        <h3 className="font-display text-h2 font-semibold text-ink-strong">{side.label}</h3>
        {side.sub ? (
          <span className="font-mono text-eyebrow uppercase tracking-[0.2em] text-ink-muted">
            {side.sub}
          </span>
        ) : null}
      </div>
      <div className="flex-1">{side.children}</div>
    </div>
  );
}

export function ComparatorPanel({ heading, left, right }: ComparatorPanelProps) {
  return (
    <div className="flex h-full w-full flex-col gap-f6">
      {heading ? (
        <h2 className="font-display text-h1 font-semibold text-ink-strong">{heading}</h2>
      ) : null}
      <div className="grid flex-1 gap-f5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,var(--size-16)),1fr))]">
        <Column side={left} />
        <Column side={right} />
      </div>
    </div>
  );
}
