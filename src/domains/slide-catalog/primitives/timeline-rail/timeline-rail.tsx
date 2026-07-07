/**
 * TimelineRail — ordered sequence of beats with reveal-aware state.
 *
 * @remarks
 * Steps at or before `activeIndex` are shown as "complete"; the active
 * step glows with the tone; future steps are dimmed. Wire `activeIndex`
 * to `ctx.stepIndex` in the slide render function to get reveal behaviour.
 *
 * @public
 */
import { cn } from "@/domains/ui/utils/cn.util";
import { toneVars } from "../tone-vars.util";
import { timelineRailVariants } from "./timeline-rail.variants";
import type { TimelineRailProps } from "./timeline-rail.types";

export function TimelineRail({
  steps,
  activeIndex = 0,
  tone = "neutral",
  density,
  orientation = "vertical",
  className,
}: TimelineRailProps) {
  const { root, track, line, item, dot, content, label, detail } = timelineRailVariants({ density, orientation });

  return (
    <div style={toneVars(tone)} className={cn(root(), className)}>
      <ol className={track()} role="list">
        {steps.map((step, i) => {
          const past   = i < activeIndex;
          const active = i === activeIndex;
          const future = i > activeIndex;

          const dotClass = cn(
            dot(),
            past   && "border-[var(--tone-surface)] bg-[var(--tone-surface)]",
            active && "border-[var(--tone-surface)] bg-[var(--tone-surface)] shadow-[0_0_1rem_var(--tone-glow)] scale-125",
            future && "border-[var(--tone-edge)] bg-transparent opacity-40",
          );

          return (
            <li key={step.id} className={cn(item(), "relative")}>
              {/* connector line — drawn from item N to N+1 */}
              {i < steps.length - 1 && orientation === "vertical" && (
                <span
                  aria-hidden
                  className={cn(line(), "absolute")}
                  style={{ height: "calc(100% - var(--sp-5))", top: "var(--sp-5)" }}
                />
              )}
              {i < steps.length - 1 && orientation === "horizontal" && (
                <span
                  aria-hidden
                  className={cn(line(), "absolute")}
                  style={{ width: "calc(100% - var(--sp-5))", left: "var(--sp-5)" }}
                />
              )}

              <span className={dotClass} aria-current={active ? "step" : undefined} />

              <div className={cn(content(), future && "opacity-40")}>
                <span className={label()}>{step.label}</span>
                {step.detail ? <span className={detail()}>{step.detail}</span> : null}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
