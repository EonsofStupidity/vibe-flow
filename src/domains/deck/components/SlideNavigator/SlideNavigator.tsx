/**
 * SlideNavigator — overlay grid of slide thumbnails for jump navigation.
 */
import { useNavigate } from "@tanstack/react-router";
import { X } from "lucide-react";
import type { Deck } from "@/domains/deck/types/deck.types";

interface SlideNavigatorProps {
  readonly open: boolean;
  readonly deck: Deck;
  readonly currentIndex: number;
  readonly onClose: () => void;
}

export function SlideNavigator({ open, deck, currentIndex, onClose }: SlideNavigatorProps) {
  const navigate = useNavigate();
  if (!open) return null;
  return (
    <div
      data-no-swipe
      className="absolute inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-lg"
      role="dialog"
      aria-modal="true"
      aria-label="Slide navigator"
    >
      <div className="flex items-center justify-between px-8 py-6 hairline-b">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.25em] text-primary">Navigator</div>
          <h2 className="font-display text-2xl text-foreground">{deck.title}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigator"
          className="tap-target flex items-center justify-center rounded-full bg-secondary text-secondary-foreground"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto p-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {deck.slides.map((slide, i) => {
          const active = i === currentIndex;
          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => {
                navigate({
                  to: "/deck/$deckId/$slideIndex",
                  params: { deckId: deck.id, slideIndex: String(i) },
                });
                onClose();
              }}
              className={`flex aspect-video flex-col justify-between rounded-xl p-5 text-left transition ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-panel text-foreground hover:bg-secondary"
              }`}
            >
              <div className="font-mono text-xs uppercase tracking-[0.2em] opacity-70">
                {String(i + 1).padStart(2, "0")} · {slide.kind}
              </div>
              <div className="font-display text-xl leading-tight">{slide.title}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
