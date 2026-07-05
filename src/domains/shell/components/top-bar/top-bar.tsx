/**
 * TopBar — global banner: brand switcher, workspace title, full-bleed toggle.
 */
import { Link, useRouterState } from "@tanstack/react-router";
import { Maximize2 } from "lucide-react";
import type { BrandId } from "@/domains/theme/foundry/foundry.tokens";
import { brands } from "@/domains/theme/foundry/foundry.tokens";
import { useShellStore } from "../../state/shell.store";
import { Button } from "@/domains/ui/button/button";
import { cn } from "@/domains/ui/utils/cn.util";

const BRAND_LIST = Object.keys(brands) as readonly BrandId[];

export function TopBar() {
  const brand = useShellStore((s) => s.brand);
  const setBrand = useShellStore((s) => s.setBrand);
  const toggleFullBleed = useShellStore((s) => s.toggleFullBleed);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header
      role="banner"
      className="flex items-center justify-between gap-f4 border-b border-hairline bg-surface-raised/80 px-f4 backdrop-blur-md"
      style={{ height: "var(--topbar-height)" }}
    >
      <div className="flex min-w-0 items-center gap-f4">
        <Link
          to="/"
          className="font-display text-h3 font-semibold tracking-tight text-ink-strong"
        >
          DevPULSE <span className="text-brand">Labs</span>
        </Link>
        <span className="hidden truncate font-mono text-eyebrow uppercase tracking-[0.25em] text-ink-muted sm:inline">
          {pathname}
        </span>
      </div>

      <div className="flex items-center gap-f2">
        <div
          role="radiogroup"
          aria-label="Active brand"
          className="flex items-center gap-f1 rounded-f-md bg-surface p-f1"
        >
          {BRAND_LIST.map((id) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={brand === id}
              onClick={() => setBrand(id)}
              className={cn(
                "rounded-f-sm px-f3 py-f1 font-mono text-eyebrow uppercase tracking-[0.2em] transition",
                brand === id
                  ? "bg-brand text-brand-ink"
                  : "text-ink-muted hover:text-ink",
              )}
            >
              {id}
            </button>
          ))}
        </div>
        <Button
          shape="icon"
          onPress={toggleFullBleed}
          aria-label="Enter full-bleed mode"
        >
          <Maximize2 className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
