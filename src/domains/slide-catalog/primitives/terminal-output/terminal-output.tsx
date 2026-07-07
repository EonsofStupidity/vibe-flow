import { cn } from "@/domains/ui/utils/cn.util";
import { terminalOutputVariants } from "./terminal-output.variants";
import type { TerminalOutputProps } from "./terminal-output.types";

const KIND_PREFIX: Record<string, string> = {
  prompt:  "❯",
  stdout:  " ",
  stderr:  "✗",
  comment: "#",
};

export function TerminalOutput({
  lines,
  title = "terminal",
  prompt = "❯",
  revealCount,
  className,
}: TerminalOutputProps) {
  const v = terminalOutputVariants();

  return (
    <div className={cn(v.root(), className)} aria-label={title} role="region">
      {/* Title bar */}
      <div className={v.titleBar()}>
        <span className={cn(v.dot(), "bg-[oklch(0.65_0.18_25)]")} aria-hidden />
        <span className={cn(v.dot(), "bg-[oklch(0.75_0.18_85)]")} aria-hidden />
        <span className={cn(v.dot(), "bg-[oklch(0.65_0.18_142)]")} aria-hidden />
        <span className={v.titleText()}>{title}</span>
      </div>

      {/* Body */}
      <div className={v.body()}>
        {lines.map((line, i) => {
          const hidden = revealCount !== undefined && i >= revealCount;
          const s = terminalOutputVariants({ kind: line.kind, hidden });
          const prefix = line.kind === "prompt" ? prompt : KIND_PREFIX[line.kind] ?? " ";
          return (
            <div key={line.id} className={s.line()}>
              <span className={s.linePrefix()} aria-hidden>
                {prefix}
              </span>
              <span className={s.lineText()}>{line.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
