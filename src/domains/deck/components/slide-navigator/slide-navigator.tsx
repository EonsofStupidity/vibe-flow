/**
 * SlideNavigator — overlay grid of slide thumbnails for jump navigation.
 */
import { useNavigate } from "@tanstack/react-router";
import { X } from "lucide-react";
import { getDeck } from "@/domains/deck/services/deck-registry.service";

interface SlideNavigatorProps {
  readonly open: boolean;
  readonly deckId: string;
  readonly currentIndex: number;
  readonly onClose: () => void;
}

export function SlideNavigator({ open, deckId, currentIndex, onClose }: SlideNavigatorProps) {
  const navigate = useNavigate();
  const deck = getDeck(deckId);
  if (!open) return null;
  if (!deck) return null;
  return (
    <div
      data-no-swipe
      className="absolute inset-0 z-50 flex flex-col bg-surface/95 backdrop-blur-lg"
      role="dialog"
      aria-modal="true"
      aria-label="Slide navigator"
    >
      <div className="flex items-center justify-between px-f7 py-f5 hairline-b">
        <div>
          <div className="font-mono text-eyebrow uppercase tracking-[0.25em] text-brand">Navigator</div>
          <h2 className="font-display text-h2 text-ink-strong">{deck.title}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigator"
          className="tap-target flex items-center justify-center rounded-full bg-surface-raised text-ink"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      <div className="grid flex-1 auto-rows-min gap-f4 overflow-y-auto p-f7 [grid-template-columns:repeat(auto-fill,minmax(18rem,1fr))]">
        {deck.slides.map((slide, i) => {
          const active = i === currentIndex;
          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => {
                navigate({
                  to: "/deck/$deckId/$slideIndex/$stepIndex",
                  params: { deckId: deck.id, slideIndex: String(i), stepIndex: "0" },
                });
                onClose();
              }}
              className={`flex aspect-video flex-col justify-between rounded-f-lg p-f5 text-left transition ${
                active
                  ? "bg-brand text-brand-ink"
                  : "bg-surface-raised text-ink hover:bg-surface-overlay"
              }`}
            >
              <div className="font-mono text-eyebrow uppercase tracking-[0.2em] opacity-70">
                {String(i + 1).padStart(2, "0")} · {slide.kind}
              </div>
              <div className="font-display text-h3 leading-tight">{slide.title}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
