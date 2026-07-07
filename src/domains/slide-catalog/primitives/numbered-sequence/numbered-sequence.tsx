/**
 * NumberedSequence — step-by-step process cards with reveal-per-step.
 *
 * @remarks
 * Pass `revealCount={ctx.stepIndex + 1}` to reveal one step per beat.
 * Steps beyond revealCount are rendered dimmed so the layout stays stable.
 *
 * @public
 */
import { cn } from "@/domains/ui/utils/cn.util";
import { toneVars } from "../tone-vars.util";
import { numberedSequenceVariants } from "./numbered-sequence.variants";
import type { NumberedSequenceProps } from "./numbered-sequence.types";

export function NumberedSequence({
  steps,
  revealCount,
  tone = "neutral",
  density,
  className,
}: NumberedSequenceProps) {
  const revealed = revealCount ?? steps.length;
  const { root, item, number, connector, content, label, detail } = numberedSequenceVariants({ density });

  return (
    <ol style={toneVars(tone)} className={cn(root(), className)} role="list">
      {steps.map((step, i) => {
        const visible = i < revealed;
        const active  = i === revealed - 1;

        return (
          <li key={step.id} className={cn(item(), !visible && "opacity-25 select-none")}>
            {/* Vertical connector to next item */}
            {i < steps.length - 1 ? (
              <span
                aria-hidden
                className={cn(connector(), "absolute")}
                style={{ top: "var(--sp-8)", height: "calc(100% + var(--sp-6) - var(--sp-8))", left: "calc(var(--sp-8)/2 - 0.0625rem)" }}
              />
            ) : null}

            <span
              className={cn(
                number(),
                active
                  ? "border-[var(--tone-surface)] bg-[var(--tone-surface)] text-[oklch(from_var(--tone-surface)_0.98_0_h)] shadow-[0_0_1.5rem_var(--tone-glow)]"
                  : visible
                  ? "border-[var(--tone-surface)] bg-[var(--tone-glass)] text-[var(--tone-surface)]"
                  : "border-[var(--tone-edge)] bg-transparent text-ink-muted",
              )}
              aria-hidden
            >
              {String(i + 1).padStart(2, "0")}
            </span>

            <div className={content()}>
              <span className={label()}>{step.label}</span>
              {step.detail ? <span className={detail()}>{step.detail}</span> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
