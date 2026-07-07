/**
 * SplitLayout — two-column arbitrary content wrapper.
 *
 * @remarks
 * Ratio variants cover the most common asymmetric layouts for slides.
 * A vertical hairline divider is optional.
 *
 * @public
 */
import { cn } from "@/domains/ui/utils/cn.util";
import type { SplitLayoutProps } from "./split-layout.types";

const RATIO_CLASSES: Record<NonNullable<SplitLayoutProps["ratio"]>, [string, string]> = {
  "1:1": ["flex-1", "flex-1"],
  "2:3": ["flex-[2]", "flex-[3]"],
  "3:2": ["flex-[3]", "flex-[2]"],
  "1:2": ["flex-[1]", "flex-[2]"],
  "2:1": ["flex-[2]", "flex-[1]"],
};

const ALIGN_CLASSES: Record<NonNullable<SplitLayoutProps["align"]>, string> = {
  start:   "items-start",
  center:  "items-center",
  end:     "items-end",
  stretch: "items-stretch",
};

const GAP_CLASSES: Record<NonNullable<SplitLayoutProps["gap"]>, string> = {
  sm: "gap-f5",
  md: "gap-f7",
  lg: "gap-f8",
};

export function SplitLayout({
  left,
  right,
  ratio = "1:1",
  align = "center",
  gap = "md",
  divider = false,
  className,
}: SplitLayoutProps) {
  const [leftFlex, rightFlex] = RATIO_CLASSES[ratio];

  return (
    <div className={cn("relative flex h-full w-full", ALIGN_CLASSES[align], GAP_CLASSES[gap], className)}>
      <div className={cn("min-w-0", leftFlex)}>{left}</div>
      {divider ? (
        <div aria-hidden className="w-px self-stretch bg-hairline" />
      ) : null}
      <div className={cn("min-w-0", rightFlex)}>{right}</div>
    </div>
  );
}
