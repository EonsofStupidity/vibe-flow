/**
 * LeftRail — collapsible navigation rail. Width driven by the fluid XY
 * foundation: collapsed 3.5→4.25rem, expanded 8.5→10.3125rem
 * (hard-capped at 165px). See `src/domains/theme/foundry/source/fluid/shell.fluid.ts`.
 */
import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Radio, Flame, GraduationCap, ChevronLeft, ChevronRight } from "lucide-react";
import { Tooltip, TooltipTrigger } from "@/domains/ui/tooltip/tooltip";
import type { TooltipTone } from "@/domains/ui/tooltip/tooltip.types";

interface NavItem {
  readonly to: string;
  readonly label: string;
  readonly Icon: typeof Home;
  readonly tone: TooltipTone;
}

const NAV: readonly NavItem[] = [
  { to: "/", label: "Home",  Icon: Home,          tone: "cyan" },
  { to: "/", label: "News",  Icon: Radio,         tone: "magenta" },
  { to: "/", label: "Vibes", Icon: Flame,         tone: "coral" },
  { to: "/", label: "EoS",   Icon: GraduationCap, tone: "lime" },
];

export function LeftRail() {
  const leftMode = useShellStore((s) => s.leftMode);
  const toggleLeft = useShellStore((s) => s.toggleLeft);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const expanded = leftMode === "expanded";

  return (
    <aside
      role="navigation"
      aria-label="Primary"
      className="relative flex shrink-0 flex-col border-r border-hairline bg-surface-raised/60 py-f3 backdrop-blur-md transition-[width] duration-200"
      style={{
        width: expanded ? "var(--rail-expanded)" : "var(--rail-collapsed)",
      }}
    >
      <nav className="flex flex-1 flex-col gap-f2 px-f2">
        {NAV.map((item) => {
          const active = pathname === item.to;
          return (
            <TooltipTrigger key={item.label} delay={220} closeDelay={80}>
              <Link
                to={item.to}
                className={cn(
                  "tap-target flex items-center gap-f3 rounded-f-md px-f3 font-mono text-eyebrow uppercase tracking-[0.2em] transition",
                  active ? "bg-surface text-brand" : "text-ink-muted hover:bg-surface hover:text-ink",
                  expanded ? "justify-start" : "justify-center",
                )}
              >
                <item.Icon className="h-5 w-5 shrink-0" aria-hidden />
                {expanded ? <span className="truncate">{item.label}</span> : null}
              </Link>
              <Tooltip tone={item.tone} placement="right" size="md">
                {item.label}
              </Tooltip>
            </TooltipTrigger>
          );
        })}
      </nav>

      <TooltipTrigger delay={220} closeDelay={80}>
        <button
          type="button"
          onClick={toggleLeft}
          aria-label={expanded ? "Collapse rail" : "Expand rail"}
          aria-expanded={expanded}
          className="tap-target mx-f2 flex items-center justify-center rounded-f-md text-ink-muted hover:bg-surface hover:text-ink"
        >
          {expanded ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </button>
        <Tooltip tone="brand" placement="right" size="sm">
          {expanded ? "Collapse rail" : "Expand rail"}
        </Tooltip>
      </TooltipTrigger>
    </aside>
  );
}
