/**
 * RightPanel — slide-out overlay above content. Non-modal complementary
 * region. Tabs: notes · queue · inspector · data (RAC Tabs).
 */
import { Tabs, TabList, Tab, TabPanel } from "react-aria-components";
import { X, ChevronLeft } from "lucide-react";
import { useShellStore } from "../../state/shell.store";
import type { RightTab } from "../../types/shell.types";
import { cn } from "@/domains/ui/utils/cn.util";

const TABS: readonly { id: RightTab; label: string }[] = [
  { id: "notes", label: "Notes" },
  { id: "queue", label: "Queue" },
  { id: "inspector", label: "Inspector" },
  { id: "data", label: "Data" },
];

export function RightPanel() {
  const open = useShellStore((s) => s.rightOpen);
  const setOpen = useShellStore((s) => s.setRightOpen);
  const tab = useShellStore((s) => s.rightTab);
  const setTab = useShellStore((s) => s.setRightTab);

  return (
    <>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open right panel"
          aria-expanded={false}
          className="tap-target absolute right-0 top-1/2 z-40 flex -translate-y-1/2 items-center justify-center rounded-l-f-md border border-r-0 border-hairline bg-surface-raised/80 px-f2 text-ink-muted backdrop-blur-md hover:text-ink"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      ) : null}

      <aside
        role="complementary"
        aria-label="Workspace tools"
        aria-hidden={!open}
        className={cn(
          "absolute right-0 top-0 z-40 flex h-full flex-col border-l border-hairline bg-surface-raised/95 backdrop-blur-md transition-transform duration-200",
          open ? "translate-x-0" : "translate-x-full",
        )}
        style={{ width: "var(--panel-width)" }}
      >
        <div className="flex items-center justify-between border-b border-hairline px-f4 py-f3">
          <span className="font-display text-h3 font-semibold text-ink-strong">Panel</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close panel"
            className="tap-target flex items-center justify-center rounded-f-sm text-ink-muted hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <Tabs
          selectedKey={tab}
          onSelectionChange={(k) => setTab(k as RightTab)}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <TabList
            aria-label="Panel sections"
            className="flex gap-f1 border-b border-hairline px-f2 py-f2"
          >
            {TABS.map((t) => (
              <Tab
                key={t.id}
                id={t.id}
                className={({ isSelected }) =>
                  cn(
                    "cursor-pointer rounded-f-sm px-f3 py-f1 font-mono text-eyebrow uppercase tracking-[0.2em] outline-none",
                    "data-[focus-visible]:ring-2 data-[focus-visible]:ring-focus-ring",
                    isSelected
                      ? "bg-brand text-brand-ink"
                      : "text-ink-muted hover:text-ink",
                  )
                }
              >
                {t.label}
              </Tab>
            ))}
          </TabList>
          {TABS.map((t) => (
            <TabPanel key={t.id} id={t.id} className="flex-1 overflow-auto p-f4 text-body text-ink">
              <p className="text-ink-muted">{t.label} — coming soon.</p>
            </TabPanel>
          ))}
        </Tabs>
      </aside>
    </>
  );
}
