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
  "group relative isolate tap-target flex items-center gap-f3 overflow-hidden rounded-f-md px-f3",
  "font-mono text-eyebrow uppercase tracking-[0.2em] text-ink-muted",
  // outline/focus
  "outline-none",
  "focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
  // motion baseline
  "transition-[background-color,color,box-shadow,transform,filter] duration-[var(--motion-duration-base)] ease-[var(--motion-ease-emphasized)]",
  // halo via box-shadow (no pseudo, keeps SSR clean)
  "shadow-[0_0_0_0_transparent]",
  // hover / focus-visible / RAC data states
  "hover:text-[var(--rail-tone)] focus-visible:text-[var(--rail-tone)]",
  "data-[hovered]:text-[var(--rail-tone)] data-[focus-visible]:text-[var(--rail-tone)]",
  "hover:bg-[var(--rail-glass)] focus-visible:bg-[var(--rail-glass)] data-[hovered]:bg-[var(--rail-glass)]",
  "hover:[box-shadow:var(--rail-shadow)] focus-visible:[box-shadow:var(--rail-focus-shadow)] data-[hovered]:[box-shadow:var(--rail-shadow)]",
  "hover:backdrop-blur-md focus-visible:backdrop-blur-md",
  // press
  "active:scale-[0.98] data-[pressed]:scale-[0.98]",
  // left tone bar via ::before
  "before:pointer-events-none before:absolute before:left-0 before:top-1/2 before:z-10 before:h-[64%] before:w-[0.1875rem]",
  "before:-translate-y-1/2 before:origin-center before:scale-y-0 before:rounded-full",
  "before:bg-[var(--rail-tone)] before:opacity-0 before:shadow-[0_0_1rem_var(--rail-tone)]",
  "before:transition-[transform,opacity,box-shadow] before:duration-[var(--motion-duration-base)] before:ease-[var(--motion-ease-emphasized)]",
  "hover:before:scale-y-100 hover:before:opacity-100 focus-visible:before:scale-y-100 focus-visible:before:opacity-100",
  "data-[hovered]:before:scale-y-100 data-[hovered]:before:opacity-100",
  // tonal glass sweep via ::after
  "after:pointer-events-none after:absolute after:inset-[0.125rem] after:rounded-f-sm after:bg-[image:var(--rail-sheen)] after:opacity-0",
  "after:transition-opacity after:duration-[var(--motion-duration-base)] after:ease-[var(--motion-ease-standard)]",
  "hover:after:opacity-100 focus-visible:after:opacity-100 data-[hovered]:after:opacity-100",
  // reduced motion
  "motion-reduce:transition-none motion-reduce:before:transition-none motion-reduce:after:transition-none motion-reduce:hover:transform-none",
].join(" ");

const ROW_ACTIVE = [
  "bg-[var(--rail-active-glass)] [box-shadow:var(--rail-active-shadow)]",
  "text-[var(--rail-tone)]",
  "before:scale-y-100 before:opacity-100",
].join(" ");

const ICON_FX = [
  "relative z-20 h-5 w-5 shrink-0 transition-[color,filter,transform] duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-emphasized)]",
  "group-hover:translate-x-[0.125rem] group-hover:scale-110 group-hover:drop-shadow-[0_0_0.75rem_var(--rail-tone)]",
  "group-focus-visible:translate-x-[0.125rem] group-focus-visible:scale-110 group-focus-visible:drop-shadow-[0_0_0.75rem_var(--rail-tone)]",
  "motion-reduce:transform-none motion-reduce:filter-none group-hover:motion-reduce:transform-none",
].join(" ");

const LABEL_FX = [
  "relative z-20 truncate transition-[letter-spacing,text-shadow] duration-[var(--motion-duration-base)] ease-[var(--motion-ease-standard)]",
  "group-hover:tracking-[0.24em] group-focus-visible:tracking-[0.24em]",
  "group-hover:[text-shadow:0_0_0.75rem_var(--rail-tone)] group-focus-visible:[text-shadow:0_0_0.75rem_var(--rail-tone)]",
  "motion-reduce:transition-none",
].join(" ");

/**
 * Publish the row-local `--rail-*` vars as pass-throughs of the effects
 * matrix column for this tone. The rail declares no color logic itself —
 * swap a tone (or add a new one to `effects.matrix.ts`) and every hover /
 * focus / active / press state re-tints automatically.
 */
function toneStyle(tone: TooltipTone): CSSProperties {
  return {
    ["--rail-tone" as string]: `var(--fx-surface-${tone})`,
    ["--rail-glass" as string]: `var(--fx-wash-${tone})`,
    ["--rail-active-glass" as string]: `var(--fx-glass-${tone})`,
    ["--rail-sheen" as string]: `var(--fx-sheen-${tone})`,
    ["--rail-shadow" as string]: `var(--fx-halo-${tone})`,
    ["--rail-focus-shadow" as string]: `var(--fx-halo-focus-${tone})`,
    ["--rail-active-shadow" as string]: `var(--fx-halo-active-${tone})`,
  } as CSSProperties;
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
            <TooltipTrigger key={item.label} delay={120} closeDelay={80}>
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

      <TooltipTrigger delay={120} closeDelay={80}>
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
