/**
 * ComparatorPanel — side-by-side A/B panel for live demos.
 *
 * @remarks
 * Renders two named columns with a subtle center divider. Each column
 * accepts arbitrary children so a slide can drop live widgets in.
 */
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

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
        "flex h-full flex-col rounded-2xl bg-panel/70 p-10 hairline-b",
        side.accent && "ring-1 ring-primary/60",
      )}
    >
      <div className="mb-8 flex items-baseline justify-between">
        <h3 className="font-display text-3xl font-semibold text-foreground">{side.label}</h3>
        {side.sub ? (
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
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
    <div className="flex h-full w-full flex-col gap-8">
      {heading ? (
        <h2 className="font-display text-4xl font-semibold text-foreground">{heading}</h2>
      ) : null}
      <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-2">
        <Column side={left} />
        <Column side={right} />
      </div>
    </div>
  );
}
