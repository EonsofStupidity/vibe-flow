import { useEffect, useState } from "react";
import { Tabs, TabList, Tab, TabPanel } from "react-aria-components";
import { X, ChevronLeft, LayoutGrid, BookOpen } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useShellStore } from "../../state/shell.store";
import type { RightTab } from "../../types/shell.types";
import { listDecks } from "@/domains/deck/services/deck-registry.service";
import { cn } from "@/domains/ui/utils/cn.util";

const TABS: readonly { id: RightTab; label: string }[] = [
  { id: "notes",     label: "Notes" },
  { id: "queue",     label: "Queue" },
  { id: "inspector", label: "Inspector" },
  { id: "data",      label: "Data" },
];

const NOTES_KEY = "devpulse:workspace-notes";

function NotesTab() {
  const [value, setValue] = useState(() => {
    try { return localStorage.getItem(NOTES_KEY) ?? ""; } catch { return ""; }
  });

  useEffect(() => {
    try { localStorage.setItem(NOTES_KEY, value); } catch { /* noop */ }
  }, [value]);

  return (
    <div className="flex h-full flex-col gap-f3">
      <p className="font-mono text-eyebrow uppercase tracking-[0.2em] text-ink-muted">
        Workspace notes · auto-saved
      </p>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type anything…"
        className="flex-1 resize-none rounded-f-md border border-hairline bg-surface p-f3 font-mono text-body text-ink placeholder:text-ink-muted/50 focus:outline-none focus:ring-2 focus:ring-brand/40"
        spellCheck={false}
      />
    </div>
  );
}

function QueueTab() {
  const decks = listDecks();
  return (
    <div className="flex flex-col gap-f3">
      <p className="font-mono text-eyebrow uppercase tracking-[0.2em] text-ink-muted">
        {decks.length} deck{decks.length !== 1 ? "s" : ""} registered
      </p>
      <ul className="flex flex-col gap-f2" role="list">
        {decks.map((deck) => (
          <li key={deck.id} className="rounded-f-md border border-hairline bg-surface p-f3">
            <div className="flex items-start justify-between gap-f2">
              <span className="font-display text-h3 font-semibold leading-tight text-ink-strong">
                {deck.title}
              </span>
              <span className="mt-[0.1em] shrink-0 font-mono text-eyebrow text-ink-muted">
                {deck.slides.length}
              </span>
            </div>
            <div className="mt-f3 flex gap-f3 font-mono text-eyebrow uppercase tracking-[0.2em]">
              <Link
                to="/deck/$deckId/$slideIndex/$stepIndex"
                params={{ deckId: deck.id, slideIndex: "0", stepIndex: "0" }}
                className="flex items-center gap-f1 text-brand hover:brightness-110"
              >
                <LayoutGrid className="h-3 w-3" aria-hidden /> Open
              </Link>
              <Link
                to="/present/$deckId/$slideIndex/$stepIndex"
                params={{ deckId: deck.id, slideIndex: "0", stepIndex: "0" }}
                className="flex items-center gap-f1 text-ink-muted hover:text-ink"
              >
                <BookOpen className="h-3 w-3" aria-hidden /> Present
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function InspectorTab() {
  const decks = listDecks();
  const totalSlides = decks.reduce((n, d) => n + d.slides.length, 0);
  const properties = [...new Set(decks.map((d) => d.eyebrow).filter(Boolean))];

  const rows: readonly [string, string][] = [
    ["Decks", String(decks.length)],
    ["Slides", String(totalSlides)],
    ["Properties", properties.join(", ") || "—"],
    ["Runtime", "TanStack Start · Vite · Tailwind v4"],
    ["Token build", "npx tsx foundry/build"],
  ];

  return (
    <dl className="flex flex-col divide-y divide-hairline">
      {rows.map(([label, value]) => (
        <div key={label} className="flex flex-col gap-f1 py-f3">
          <dt className="font-mono text-eyebrow uppercase tracking-[0.2em] text-ink-muted">{label}</dt>
          <dd className="font-mono text-body text-ink">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

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
          <span className="font-display text-h3 font-semibold text-ink-strong">Workspace</span>
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

          <TabPanel id="notes" className="flex-1 overflow-auto p-f4">
            <NotesTab />
          </TabPanel>
          <TabPanel id="queue" className="flex-1 overflow-auto p-f4">
            <QueueTab />
          </TabPanel>
          <TabPanel id="inspector" className="flex-1 overflow-auto p-f4">
            <InspectorTab />
          </TabPanel>
          <TabPanel id="data" className="flex-1 overflow-auto p-f4 text-body text-ink">
            <p className="text-ink-muted">Data bindings — coming soon.</p>
          </TabPanel>
        </Tabs>
      </aside>
    </>
  );
}
