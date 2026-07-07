import type { ReactNode } from "react";

export interface SplitLayoutProps {
  readonly left: ReactNode;
  readonly right: ReactNode;
  /** Weight ratio. "1:1" (default), "2:3", "3:2", "1:2", "2:1" */
  readonly ratio?: "1:1" | "2:3" | "3:2" | "1:2" | "2:1";
  readonly align?: "start" | "center" | "end" | "stretch";
  readonly gap?: "sm" | "md" | "lg";
  readonly divider?: boolean;
  readonly className?: string;
}
