/**
 * LeftRail — collapsible navigation rail (4rem ↔ 8.4375rem/135px).
 */
import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Radio, Flame, GraduationCap, ChevronLeft, ChevronRight } from "lucide-react";
import { useShellStore } from "../../state/shell.store";
import { cn } from "@/domains/ui/utils/cn.util";

interface NavItem {
  readonly to: string;
  readonly label: string;
  readonly Icon: typeof Home;
}

const NAV: readonly NavItem[] = [
  { to: "/", label: "Home", Icon: Home },
  { to: "/", label: "News", Icon: Radio },
  { to: "/", label: "Vibes", Icon: Flame },
  { to: "/", label: "EoS", Icon: GraduationCap },
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
            <Link
              key={item.label}
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
          );
        })}
      </nav>

      <button
        type="button"
        onClick={toggleLeft}
        aria-label={expanded ? "Collapse rail" : "Expand rail"}
        aria-expanded={expanded}
        className="tap-target mx-f2 flex items-center justify-center rounded-f-md text-ink-muted hover:bg-surface hover:text-ink"
      >
        {expanded ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
      </button>
    </aside>
  );
}
