/**
 * ProgressRail — thin top-edge indicator of position in the deck.
 */
interface ProgressRailProps {
  readonly index: number;
  readonly total: number;
  readonly hidden: boolean;
}

export function ProgressRail({ index, total, hidden }: ProgressRailProps) {
  const pct = total <= 1 ? 100 : ((index + 1) / total) * 100;
  return (
    <div
      className={`absolute inset-x-0 top-0 z-40 h-1 bg-surface-raised/60 transition-opacity duration-200 ${hidden ? "opacity-0" : "opacity-100"}`}
    >
      <div
        className="h-full bg-brand transition-[width] duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
