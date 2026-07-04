/**
 * SlideFrame — standard outer container for every slide.
 *
 * @remarks
 * Provides safe-area padding, min-height sizing, and a subtle background
 * band. Slides render inside this so the runtime chrome always has a
 * predictable canvas to anchor against.
 */
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SlideFrameProps {
  readonly children: ReactNode;
  readonly align?: "center" | "top" | "stretch";
  readonly bleed?: boolean;
  readonly className?: string;
}

export function SlideFrame({ children, align = "center", bleed = false, className }: SlideFrameProps) {
  return (
    <section
      className={cn(
        "relative isolate flex h-full w-full",
        align === "center" && "items-center justify-center",
        align === "top" && "items-start justify-center",
        align === "stretch" && "items-stretch justify-stretch",
        !bleed && "px-16 py-20",
        className,
      )}
    >
      {children}
    </section>
  );
}
