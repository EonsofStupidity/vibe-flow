/**
 * PrimitiveCard — visual tile for one primitive in the catalog picker.
 */
import { cn } from "@/domains/ui/utils/cn.util";
import { toneVars } from "@/domains/slide-catalog/primitives/tone-vars.util";
import type { PrimitiveCatalogEntry } from "./catalog-registry";

interface PrimitiveCardProps {
  readonly entry: PrimitiveCatalogEntry;
  readonly selected?: boolean;
  readonly onSelect: (id: string) => void;
}

export function PrimitiveCard({ entry, selected = false, onSelect }: PrimitiveCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(entry.id)}
      aria-pressed={selected}
      style={toneVars(entry.defaultTone)}
      className={cn(
        "group relative flex flex-col gap-f3 rounded-f-lg p-f4 text-left outline-none",
        "border transition-[background-color,border-color,box-shadow]",
        "duration-[var(--motion-duration-base)] ease-[var(--motion-ease-emphasized)]",
        "focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        selected
          ? "border-[var(--tone-surface)] bg-[var(--tone-glass)] shadow-[var(--tone-halo-active)]"
          : "border-hairline bg-surface-raised hover:border-[var(--tone-edge)] hover:bg-[var(--tone-wash)] hover:shadow-[var(--tone-halo)]",
      )}
    >
      {/* Tone swatch */}
      <div
        className="h-f8 w-full rounded-f-md bg-[var(--tone-surface)] shadow-[0_0_1.5rem_var(--tone-glow)]"
        aria-hidden
      />

      {/* Labels */}
      <div className="flex flex-col gap-f1">
        <span className="font-display text-h3 font-semibold text-ink-strong">{entry.label}</span>
        <span className="text-eyebrow text-ink-muted">{entry.description}</span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-f1">
        {entry.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-f-sm bg-[var(--tone-wash)] px-f2 py-f1 font-mono text-eyebrow uppercase tracking-[0.2em] text-[var(--tone-surface)]"
          >
            {tag}
          </span>
        ))}
      </div>

      {selected ? (
        <div
          aria-hidden
          className="absolute right-f3 top-f3 flex h-f5 w-f5 items-center justify-center rounded-full bg-[var(--tone-surface)] text-[oklch(from_var(--tone-surface)_0.98_0_h)] text-eyebrow font-bold"
        >
          ✓
        </div>
      ) : null}
    </button>
  );
}
