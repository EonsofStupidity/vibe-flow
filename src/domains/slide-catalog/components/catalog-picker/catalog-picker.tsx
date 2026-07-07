/**
 * CatalogPicker — searchable grid of available slide primitives with
 * an integrated effect picker.
 *
 * @remarks
 * Renders as a panel or full-screen overlay depending on the host.
 * When the user confirms a selection, `onConfirm` receives the primitive
 * id and the chosen effect name.
 *
 * @public
 */
import { useState, useMemo } from "react";
import { X, Search } from "lucide-react";
import { cn } from "@/domains/ui/utils/cn.util";
import { PrimitiveCard } from "./primitive-card";
import { EffectPicker } from "./effect-picker";
import { PRIMITIVE_CATALOG, ALL_TAGS } from "./catalog-registry";
import type { SlideEffectName } from "@/domains/deck/types/effect.types";

interface CatalogPickerProps {
  readonly onClose: () => void;
  readonly onConfirm: (primitiveId: string, effectName: SlideEffectName) => void;
}

export function CatalogPicker({ onClose, onConfirm }: CatalogPickerProps) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [effect, setEffect] = useState<SlideEffectName>("fade");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return PRIMITIVE_CATALOG.filter((p) => {
      const matchesTag = !activeTag || p.tags.includes(activeTag);
      const matchesQuery = !q ||
        p.label.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q));
      return matchesTag && matchesQuery;
    });
  }, [query, activeTag]);

  return (
    <div
      data-no-swipe
      role="dialog"
      aria-modal="true"
      aria-label="Slide catalog"
      className="fixed inset-0 z-50 flex flex-col bg-surface text-ink"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-hairline px-f6 py-f4">
        <div>
          <div className="font-mono text-eyebrow uppercase tracking-[0.3em] text-brand">
            Slide catalog
          </div>
          <h2 className="font-display text-h2 font-semibold text-ink-strong">
            Choose a primitive
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close catalog"
          className="tap-target flex items-center justify-center rounded-full bg-surface-raised text-ink-muted hover:text-ink"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Main: search + grid */}
        <div className="flex min-h-0 flex-1 flex-col gap-f4 overflow-hidden p-f6">
          {/* Search */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-f4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden />
            <input
              type="search"
              placeholder="Search primitives…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={cn(
                "w-full rounded-f-md border border-hairline bg-surface-raised pl-f8 pr-f4 py-f3",
                "font-mono text-body text-ink outline-none placeholder:text-ink-muted",
                "focus:border-brand focus:ring-1 focus:ring-brand",
              )}
            />
          </div>

          {/* Tag filter */}
          <div className="flex flex-wrap gap-f2">
            <button
              type="button"
              onClick={() => setActiveTag(null)}
              className={cn(
                "rounded-full border px-f3 py-f1 font-mono text-eyebrow uppercase tracking-[0.15em] transition",
                !activeTag
                  ? "border-brand bg-brand text-brand-ink"
                  : "border-hairline bg-surface-raised text-ink-muted hover:text-ink",
              )}
            >
              All
            </button>
            {ALL_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                className={cn(
                  "rounded-full border px-f3 py-f1 font-mono text-eyebrow uppercase tracking-[0.15em] transition",
                  activeTag === tag
                    ? "border-brand bg-brand text-brand-ink"
                    : "border-hairline bg-surface-raised text-ink-muted hover:text-ink",
                )}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid min-h-0 flex-1 auto-rows-min gap-f4 overflow-y-auto [grid-template-columns:repeat(auto-fill,minmax(14rem,1fr))]">
            {filtered.map((entry) => (
              <PrimitiveCard
                key={entry.id}
                entry={entry}
                selected={selectedId === entry.id}
                onSelect={setSelectedId}
              />
            ))}
            {filtered.length === 0 ? (
              <p className="col-span-full py-f8 text-center text-body text-ink-muted">
                No primitives match &ldquo;{query}&rdquo;
              </p>
            ) : null}
          </div>
        </div>

        {/* Sidebar: effect picker + confirm */}
        <aside className="flex w-[22rem] shrink-0 flex-col gap-f6 border-l border-hairline p-f6">
          <EffectPicker value={effect} onChange={setEffect} />

          <div className="mt-auto flex flex-col gap-f3">
            {selectedId ? (
              <div className="rounded-f-md bg-surface-raised p-f4">
                <div className="font-mono text-eyebrow uppercase tracking-[0.2em] text-ink-muted">
                  Selected
                </div>
                <div className="mt-f2 font-display text-h3 text-ink-strong">
                  {PRIMITIVE_CATALOG.find((p) => p.id === selectedId)?.label}
                </div>
              </div>
            ) : null}

            <button
              type="button"
              disabled={!selectedId}
              onClick={() => selectedId && onConfirm(selectedId, effect)}
              className={cn(
                "tap-target w-full rounded-full py-f3 font-mono text-eyebrow uppercase tracking-[0.2em] transition",
                selectedId
                  ? "bg-brand text-brand-ink hover:brightness-110"
                  : "cursor-not-allowed bg-surface-raised text-ink-muted opacity-50",
              )}
            >
              Add slide →
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
