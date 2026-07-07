import { tv } from "tailwind-variants";

export const terminalOutputVariants = tv({
  slots: {
    root: [
      "overflow-hidden rounded-f-lg border border-[oklch(0.3_0_0)]",
      "bg-[oklch(0.1_0_0)] font-mono text-body",
      "shadow-[0_1rem_3rem_-0.5rem_oklch(0_0_0/60%)]",
    ].join(" "),
    titleBar: [
      "flex items-center gap-f2 border-b border-[oklch(0.2_0_0)] bg-[oklch(0.14_0_0)] px-f4 py-f3",
    ].join(" "),
    dot: "h-f2 w-f2 rounded-full",
    titleText: "ml-f3 text-eyebrow uppercase tracking-[0.2em] text-[oklch(0.5_0_0)]",
    body: "flex flex-col gap-f1 p-f4",
    line: "flex items-start gap-f3 transition-opacity duration-[var(--motion-duration-base)] ease-[var(--motion-ease-standard)]",
    linePrefix: "shrink-0 select-none",
    lineText: "break-all",
  },
  variants: {
    kind: {
      prompt:  { linePrefix: "text-[oklch(0.65_0.18_142)]", lineText: "text-[oklch(0.9_0_0)]" },
      stdout:  { linePrefix: "text-[oklch(0.45_0_0)]",      lineText: "text-[oklch(0.7_0_0)]" },
      stderr:  { linePrefix: "text-[oklch(0.45_0_0)]",      lineText: "text-[oklch(0.65_0.18_25)]" },
      comment: { linePrefix: "text-[oklch(0.4_0_0)]",       lineText: "text-[oklch(0.4_0_0)] italic" },
    },
    hidden: {
      true:  { line: "opacity-0 pointer-events-none" },
      false: { line: "opacity-100" },
    },
  },
  defaultVariants: { kind: "stdout", hidden: false },
});
