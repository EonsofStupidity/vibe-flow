import type { CSSProperties } from "react";
import { cn } from "@/domains/ui/utils/cn.util";
import { toneVars } from "../tone-vars.util";
import { keyValueGridVariants } from "./key-value-grid.variants";
import type { KeyValueGridProps } from "./key-value-grid.types";

export function KeyValueGrid({
  pairs,
  tone = "brand",
  columns = 2,
  className,
}: KeyValueGridProps) {
  const v = keyValueGridVariants({ columns });

  return (
    <dl
      className={cn(v.root(), className)}
      style={toneVars(tone) as CSSProperties}
    >
      {pairs.map((pair) => (
        <div key={pair.id} className={v.pair()}>
          <dt className={v.term()}>{pair.term}</dt>
          <dd className={v.definition()}>{pair.definition}</dd>
        </div>
      ))}
    </dl>
  );
}
