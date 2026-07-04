/**
 * TitleCard — episode / segment opener.
 */
import { cn } from "@/domains/ui/utils/cn.util";

interface TitleCardProps {
  readonly eyebrow?: string;
  readonly title: string;
  readonly subtitle?: string;
  readonly align?: "left" | "center";
}

export function TitleCard({ eyebrow, title, subtitle, align = "left" }: TitleCardProps) {
  return (
    <div className={cn("max-w-5xl", align === "center" && "text-center mx-auto")}>
      {eyebrow ? (
        <div className="mb-f5 font-mono text-eyebrow uppercase tracking-[0.2em] text-brand">
          {eyebrow}
        </div>
      ) : null}
      <h1 className="font-display text-display font-semibold leading-[0.95] text-ink-strong">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-f6 max-w-3xl text-h3 leading-snug text-ink-muted">{subtitle}</p>
      ) : null}
    </div>
  );
}
