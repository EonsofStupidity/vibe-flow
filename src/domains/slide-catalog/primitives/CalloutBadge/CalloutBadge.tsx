/**
 * CalloutBadge — small emphasis chip.
 */
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CalloutBadgeProps {
  readonly children: ReactNode;
  readonly tone?: "neutral" | "live";
}

export function CalloutBadge({ children, tone = "neutral" }: CalloutBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em]",
        tone === "neutral" && "bg-secondary text-secondary-foreground",
        tone === "live" && "bg-primary text-primary-foreground",
      )}
    >
      {tone === "live" ? <span className="h-2 w-2 rounded-full bg-primary-foreground/80" /> : null}
      {children}
    </span>
  );
}
