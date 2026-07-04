/**
 * CalloutBadge — small emphasis chip.
 *
 * @remarks
 * `tone` picks either a neutral surface chip or the active brand chip. The
 * "live" tone follows whichever brand `data-brand` an ancestor set — a
 * live-air chip renders amber under EoS, cyan under News, magenta under
 * AngryVibes, all from the same component.
 */
import type { ReactNode } from "react";
import { cn } from "@/domains/ui/utils/cn.util";

interface CalloutBadgeProps {
  readonly children: ReactNode;
  readonly tone?: "neutral" | "live";
}

export function CalloutBadge({ children, tone = "neutral" }: CalloutBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-f2 rounded-full px-f4 py-f1 font-mono text-eyebrow uppercase tracking-[0.2em]",
        tone === "neutral" && "bg-surface-raised text-ink",
        tone === "live" && "bg-brand text-brand-ink",
      )}
    >
      {tone === "live" ? <span className="h-2 w-2 rounded-full bg-brand-ink/80" /> : null}
      {children}
    </span>
  );
}
