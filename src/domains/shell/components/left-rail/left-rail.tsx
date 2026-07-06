/**
 * LeftRail — collapsible navigation rail. Width driven by the fluid XY
 * foundation: collapsed 3.5→4.25rem, expanded 8.5→10.3125rem
 * (hard-capped at 165px). See `src/domains/theme/foundry/source/fluid/shell.fluid.ts`.
 *
 * @remarks
 * Each row publishes its own tone as `--rail-tone` so the tooltip color,
 * icon color, halo, and left tone bar all read the same variable. The row
 * is wrapped in `<Focusable>` because RAC `TooltipTrigger` needs to attach
 * hover/focus handlers via `useFocusable` — TanStack `<Link>` and native
 * `<button>` alone don't receive those props.
 */
import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Radio, Flame, GraduationCap, ChevronLeft, ChevronRight } from "lucide-react";
import { Focusable } from "react-aria-components";
import type { CSSProperties } from "react";
import { Tooltip, TooltipTrigger } from "@/domains/ui/tooltip/tooltip";
import type { TooltipTone } from "@/domains/ui/tooltip/tooltip.types";
import { useShellStore } from "../../state/shell.store";
import { cn } from "@/domains/ui/utils/cn.util";

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

/**
 * Composed interaction stack applied to every rail row. Reads `--rail-tone`
 * so the same class works for every item, and every hover / focus / active
 * / press state animates via motion tokens (never raw ms values).
 */
const ROW_BASE = [
  // layout + tap
  "group relative isolate tap-target flex items-center gap-f3 rounded-f-md px-f3",
  "font-mono text-eyebrow uppercase tracking-[0.2em] text-ink-muted",
  // outline/focus
  "outline-none",
  "focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
  // motion baseline
  "transition-[background-color,color,box-shadow,transform] duration-[var(--motion-duration-base)] ease-[var(--motion-ease-emphasized)]",
  // halo via box-shadow (no pseudo, keeps SSR clean)
  "shadow-[0_0_0_0_transparent]",
  // hover / focus-visible / RAC data states
  "hover:text-[var(--rail-tone)] focus-visible:text-[var(--rail-tone)]",
  "data-[hovered]:text-[var(--rail-tone)] data-[focus-visible]:text-[var(--rail-tone)]",
  "hover:bg-[color-mix(in_oklch,var(--rail-tone)_10%,transparent)]",
  "hover:shadow-[0_0_0_0.25rem_color-mix(in_oklch,var(--rail-tone)_18%,transparent)]",
  "focus-visible:shadow-[0_0_0_0.25rem_color-mix(in_oklch,var(--rail-tone)_22%,transparent)]",
  // press
  "active:scale-[0.98] data-[pressed]:scale-[0.98]",
  // left tone bar via ::before
  "before:pointer-events-none before:absolute before:left-0 before:top-1/2 before:h-[60%] before:w-[0.1875rem]",
  "before:-translate-y-1/2 before:origin-center before:scale-y-0 before:rounded-full",
  "before:bg-[var(--rail-tone)] before:opacity-0",
  "before:transition-[transform,opacity] before:duration-[var(--motion-duration-base)] before:ease-[var(--motion-ease-emphasized)]",
  "hover:before:scale-y-100 hover:before:opacity-100",
  "focus-visible:before:scale-y-100 focus-visible:before:opacity-100",
  // reduced motion
  "motion-reduce:transition-none motion-reduce:before:transition-none motion-reduce:hover:transform-none",
].join(" ");

const ROW_ACTIVE = [
  "bg-[color-mix(in_oklch,var(--rail-tone)_14%,transparent)]",
  "text-[var(--rail-tone)]",
  "before:scale-y-100 before:opacity-100",
].join(" ");

const ICON_FX = [
  "h-5 w-5 shrink-0 transition-transform duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-emphasized)]",
  "group-hover:translate-x-[0.125rem] group-hover:scale-110",
  "group-focus-visible:translate-x-[0.125rem] group-focus-visible:scale-110",
  "motion-reduce:transform-none group-hover:motion-reduce:transform-none",
].join(" ");

const LABEL_FX = [
  "truncate transition-[letter-spacing] duration-[var(--motion-duration-base)] ease-[var(--motion-ease-standard)]",
  "group-hover:tracking-[0.24em] group-focus-visible:tracking-[0.24em]",
  "motion-reduce:transition-none",
].join(" ");

function toneStyle(tone: TooltipTone): CSSProperties {
  return { ["--rail-tone" as string]: `var(--tooltip-bg-${tone})` } as CSSProperties;
}

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
      style={{ width: expanded ? "var(--rail-expanded)" : "var(--rail-collapsed)" }}
    >
      <nav className="flex flex-1 flex-col gap-f2 px-f2">
        {NAV.map((item) => {
          const active = pathname === item.to;
          return (
            <TooltipTrigger key={item.label} delay={220} closeDelay={80}>
              <Focusable>
                <Link
                  to={item.to}
                  style={toneStyle(item.tone)}
                  className={cn(
                    ROW_BASE,
                    expanded ? "justify-start" : "justify-center",
                    active && ROW_ACTIVE,
                  )}
                >
                  <item.Icon className={ICON_FX} aria-hidden />
                  {expanded ? <span className={LABEL_FX}>{item.label}</span> : null}
                </Link>
              </Focusable>
              <Tooltip tone={item.tone} placement="right" size="md">
                {item.label}
              </Tooltip>
            </TooltipTrigger>
          );
        })}
      </nav>

      <TooltipTrigger delay={220} closeDelay={80}>
        <Focusable>
          <button
            type="button"
            onClick={toggleLeft}
            aria-label={expanded ? "Collapse rail" : "Expand rail"}
            aria-expanded={expanded}
            style={toneStyle("brand")}
            className={cn(ROW_BASE, "mx-f2 justify-center")}
          >
            {expanded
              ? <ChevronLeft className={ICON_FX} aria-hidden />
              : <ChevronRight className={ICON_FX} aria-hidden />}
          </button>
        </Focusable>
        <Tooltip tone="brand" placement="right" size="sm">
          {expanded ? "Collapse rail" : "Expand rail"}
        </Tooltip>
      </TooltipTrigger>
    </aside>
  );
}
