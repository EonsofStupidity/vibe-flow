/**
 * BulletsList — content-driven bullet reveal.
 *
 * @remarks
 * Renders a titled list where each bullet is focusable, taps as a toggle,
 * and animates through the tone's effects-matrix column (`--fx-*-<tone>`).
 * Keyboard: Tab through bullets, Space / Enter to toggle a bullet.
 *
 * Tone is a plain data prop — no per-instance color logic in the primitive.
 * A slide passes `tone="cyan"` and every hover / focus / selected state
 * animates through `--fx-glass-cyan` / `--fx-edge-cyan` /
 * `--fx-halo-cyan` / etc. automatically.
 *
 * @public
 */
import { useCallback, useState } from "react";
import { Focusable } from "react-aria-components";
import { cn } from "@/domains/ui/utils/cn.util";
import { toneVars } from "../tone-vars.util";
import { bulletsListVariants } from "./bullets-list.variants";
import type { BulletsListProps } from "./bullets-list.types";

export function BulletsList({
  title,
  tone = "neutral",
  density,
  bullets,
  selectedIds,
  onSelectionChange,
  multi = true,
  className,
}: BulletsListProps) {
  const isControlled = selectedIds !== undefined;
  const [internal, setInternal] = useState<readonly string[]>([]);
  const selected = isControlled ? selectedIds : internal;

  const toggle = useCallback(
    (id: string) => {
      const has = selected.includes(id);
      const next = multi
        ? has
          ? selected.filter((x) => x !== id)
          : [...selected, id]
        : has
        ? []
        : [id];
      if (!isControlled) setInternal(next);
      onSelectionChange?.(next);
    },
    [selected, multi, isControlled, onSelectionChange],
  );

  const { root, heading, list, item, bullet, label, detail } = bulletsListVariants({ density });

  return (
    <div style={toneVars(tone)} className={cn(root(), className)}>
      {title ? <h2 className={heading()}>{title}</h2> : null}
      <ul
        className={list()}
        role={multi ? "listbox" : "radiogroup"}
        aria-multiselectable={multi || undefined}
      >
        {bullets.map((b) => {
          const isSelected = selected.includes(b.id);
          return (
            <li key={b.id} className="contents">
              <Focusable>
                <button
                  type="button"
                  role={multi ? "option" : "radio"}
                  aria-selected={multi ? isSelected : undefined}
                  aria-checked={!multi ? isSelected : undefined}
                  data-selected={isSelected}
                  onClick={() => toggle(b.id)}
                  className={item()}
                >
                  <span aria-hidden className={bullet()} />
                  <span className="min-w-0 flex-1">
                    <span className={label()}>{b.label}</span>
                    {b.detail ? <span className={cn(detail(), "block")}>{b.detail}</span> : null}
                  </span>
                </button>
              </Focusable>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
