export interface TerminalLine {
  readonly id: string;
  readonly kind: "prompt" | "stdout" | "stderr" | "comment";
  readonly text: string;
}

export interface TerminalOutputProps {
  readonly lines: readonly TerminalLine[];
  readonly title?: string;
  /** Shell prompt prefix shown on prompt lines. Defaults to "❯". */
  readonly prompt?: string;
  /** Reveal count — lines up to this index (1-based) are visible. Wire to ctx.stepIndex + 1 for progressive reveal. */
  readonly revealCount?: number;
  readonly className?: string;
}
