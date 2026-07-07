/**
 * StatsGrid — tap-to-flip stat cards.
 *
 * @remarks
 * Renders responsive stat tiles at any container width via
 * `auto-fit / minmax`, no breakpoints. Each card that carries a `detail`
 * flips to reveal it (owned `ToggleButton` under the hood). Every visual
 * state reads the tone's effects-matrix column.
 *
 * @public
 */
import { ToggleButton } from "@/domains/ui/toggle-button/toggle-button";
import { cn } from "@/domains/ui/utils/cn.util";
import { toneVars } from "../tone-vars.util";
import { statsGridVariants } from "./stats-grid.variants";
import type { StatItem, StatsGridProps } from "./stats-grid.types";

function StatCard({
  stat,
  tone,
  flippable,
  slots,
}: {
  readonly stat: StatItem;
  readonly tone: NonNullable<StatsGridProps["tone"]>;
  readonly flippable: boolean;
  readonly slots: ReturnType<typeof statsGridVariants>;
}) {
  const activeTone = stat.tone ?? tone;
  const canFlip = flippable && !!stat.detail;
  const front = (
    <>
      <span aria-hidden className={slots.sheen()} />
      <div className={slots.face()}>
        <span className={slots.value()}>{stat.value}</span>
        <span className={cn(slots.label(), "mt-f4")}>{stat.label}</span>
      </div>
      {stat.detail ? (
        <div className={slots.back()} aria-hidden={!canFlip ? undefined : undefined}>
          <span className={slots.hint()}>Detail</span>
          <p className={slots.detail()}>{stat.detail}</p>
          <span className={slots.label()}>{stat.label}</span>
        </div>
      ) : null}
    </>
  );

  if (canFlip) {
    return (
      <div style={toneVars(activeTone)} className="contents">
        <ToggleButton
          aria-label={typeof stat.label === "string" ? `${stat.label} — flip for detail` : "Flip for detail"}
          className={slots.card()}
        >
          {front}
        </ToggleButton>
      </div>
    );
  }
  return (
    <div className={slots.card()} style={toneVars(activeTone)}>
      {front}
    </div>
  );
}

export function StatsGrid({
  title,
  tone = "neutral",
  density,
  stats,
  flippable = true,
  className,
}: StatsGridProps) {
  const slots = statsGridVariants({ density });
  return (
    <div style={toneVars(tone)} className={cn(slots.root(), className)}>
      {title ? <h2 className={slots.heading()}>{title}</h2> : null}
      <div className={slots.grid()}>
        {stats.map((s) => (
          <StatCard key={s.id} stat={s} tone={tone} flippable={flippable} slots={slots} />
        ))}
      </div>
    </div>
  );
}
