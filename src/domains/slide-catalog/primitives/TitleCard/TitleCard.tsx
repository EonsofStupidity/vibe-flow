/**
 * TitleCard — episode / segment opener.
 */
import { cn } from "@/lib/utils";

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
        <div className="mb-6 font-mono text-sm uppercase tracking-[0.2em] text-primary">
          {eyebrow}
        </div>
      ) : null}
      <h1 className="font-display text-6xl md:text-8xl font-semibold leading-[0.95] text-foreground">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-8 max-w-3xl text-2xl leading-snug text-muted-foreground">{subtitle}</p>
      ) : null}
    </div>
  );
}
