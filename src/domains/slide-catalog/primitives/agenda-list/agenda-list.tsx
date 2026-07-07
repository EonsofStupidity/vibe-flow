import type { CSSProperties } from "react";
import { cn } from "@/domains/ui/utils/cn.util";
import { toneVars } from "../tone-vars.util";
import { agendaListVariants } from "./agenda-list.variants";
import type { AgendaListProps } from "./agenda-list.types";

export function AgendaList({
  chapterLabel,
  items,
  activeIndex,
  tone = "brand",
  density = "comfy",
  className,
}: AgendaListProps) {
  const v = agendaListVariants({ density });

  return (
    <div
      className={cn(v.root(), className)}
      style={toneVars(tone) as CSSProperties}
    >
      {chapterLabel ? (
        <div className={v.chapter()}>{chapterLabel}</div>
      ) : null}

      <ol className={v.list()} role="list">
        {items.map((item, i) => {
          const isActive = activeIndex === i;
          const s = agendaListVariants({ density, active: isActive });
          return (
            <li key={item.id} className={s.item()}>
              <span className={s.marker()} aria-hidden />
              <div className={s.content()}>
                <span className={s.label()}>{item.label}</span>
                {item.detail ? (
                  <span className={s.detail()}>{item.detail}</span>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
