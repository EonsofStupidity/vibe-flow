/**
 * EffectPicker — inline selector for slide transition effects.
 */
import { cn } from "@/domains/ui/utils/cn.util";
import { SLIDE_EFFECTS } from "@/domains/deck/types/effect.types";
import type { SlideEffectName } from "@/domains/deck/types/effect.types";

interface EffectPickerProps {
  readonly value: SlideEffectName;
  readonly onChange: (name: SlideEffectName) => void;
}

export function EffectPicker({ value, onChange }: EffectPickerProps) {
  return (
    <div className="flex flex-col gap-f2">
      <span className="font-mono text-eyebrow uppercase tracking-[0.25em] text-ink-muted">
        Slide transition
      </span>
      <div
        role="radiogroup"
        aria-label="Slide transition effect"
        className="grid grid-cols-2 gap-f2"
      >
        {SLIDE_EFFECTS.map((fx) => {
          const isSelected = value === fx.name;
          return (
            <button
              key={fx.name}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(fx.name)}
              className={cn(
                "flex flex-col gap-f1 rounded-f-md border p-f3 text-left outline-none",
                "transition-[background-color,border-color] duration-[var(--motion-duration-fast)]",
                "focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1 focus-visible:ring-offset-surface",
                isSelected
                  ? "border-brand bg-brand/10 text-ink"
                  : "border-hairline bg-surface-raised text-ink-muted hover:bg-surface-overlay hover:text-ink",
              )}
            >
              <span className="font-mono text-eyebrow uppercase tracking-[0.15em]">{fx.label}</span>
              <span className="text-eyebrow opacity-70">{fx.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
