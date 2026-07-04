/**
 * DeckHost — the runtime shell. Composes slide + chrome + annotate + nav.
 *
 * @remarks
 * URL-driven: /deck/$deckId/$slideIndex is the source of truth for
 * current slide. Local UI state (chrome, annotate, navigator) lives in
 * useRuntimeStore. Wraps navigation so keyboard, swipe, edge taps, and
 * navigator all funnel through the same handlers.
 */
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useMemo, useRef } from "react";
import type { Deck } from "@/domains/deck/types/deck.types";
import { clampIndex, nextIndex, prevIndex } from "@/domains/deck/services/deck-navigation.service";
import { useRuntimeStore } from "@/domains/deck/state/runtime.store";
import { useSwipeNav } from "@/domains/input/hooks/useSwipeNav.hook";
import { useKeyboardNav } from "@/domains/input/hooks/useKeyboardNav.hook";
import { EdgeNav } from "@/domains/deck/components/EdgeNav/EdgeNav";
import { ProgressRail } from "@/domains/deck/components/ProgressRail/ProgressRail";
import { RuntimeToolbar } from "@/domains/deck/components/RuntimeToolbar/RuntimeToolbar";
import { SlideNavigator } from "@/domains/deck/components/SlideNavigator/SlideNavigator";
import { AnnotationLayer } from "@/domains/annotation/components/AnnotationLayer/AnnotationLayer";

interface DeckHostProps {
  readonly deck: Deck;
  readonly slideIndex: number;
}

export function DeckHost({ deck, slideIndex }: DeckHostProps) {
  const navigate = useNavigate();
  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const total = deck.slides.length;
  const index = clampIndex(slideIndex, total);
  const slide = deck.slides[index];

  const chromeHidden = useRuntimeStore((s) => s.chromeHidden);
  const annotateOn = useRuntimeStore((s) => s.annotateOn);
  const navigatorOpen = useRuntimeStore((s) => s.navigatorOpen);
  const toggleChrome = useRuntimeStore((s) => s.toggleChrome);
  const toggleAnnotate = useRuntimeStore((s) => s.toggleAnnotate);
  const toggleNavigator = useRuntimeStore((s) => s.toggleNavigator);
  const setNavigatorOpen = useRuntimeStore((s) => s.setNavigatorOpen);

  const go = useCallback(
    (i: number) => {
      navigate({
        to: "/deck/$deckId/$slideIndex",
        params: { deckId: deck.id, slideIndex: String(i) },
      });
    },
    [navigate, deck.id],
  );

  const onPrev = useCallback(() => go(prevIndex(index, total)), [go, index, total]);
  const onNext = useCallback(() => go(nextIndex(index, total)), [go, index, total]);

  useSwipeNav(surfaceRef, { onSwipeLeft: onNext, onSwipeRight: onPrev });
  useKeyboardNav({
    onPrev,
    onNext,
    onNavigator: toggleNavigator,
    onAnnotate: toggleAnnotate,
    onChrome: toggleChrome,
  });

  const ctx = useMemo(() => ({ deckId: deck.id, index, total }), [deck.id, index, total]);
  const effectiveChromeHidden = chromeHidden || slide.chrome === "hidden";
  const allowAnnotate = slide.allowAnnotate !== false;

  return (
    <div ref={surfaceRef} className="relative h-dvh w-dvw overflow-hidden bg-background text-foreground">
      <ProgressRail index={index} total={total} hidden={effectiveChromeHidden} />

      <div key={slide.id} className="absolute inset-0 animate-fade-in">
        {slide.render(ctx)}
      </div>

      {allowAnnotate ? <AnnotationLayer enabled={annotateOn} slideKey={slide.id} /> : null}

      <EdgeNav
        onPrev={onPrev}
        onNext={onNext}
        canPrev={index > 0}
        canNext={index < total - 1}
        hidden={effectiveChromeHidden || annotateOn}
      />

      <RuntimeToolbar
        onNavigator={toggleNavigator}
        onAnnotate={toggleAnnotate}
        onChrome={toggleChrome}
        annotateOn={annotateOn}
        chromeHidden={effectiveChromeHidden}
        index={index}
        total={total}
        deckTitle={deck.title}
        slideTitle={slide.title}
      />

      <SlideNavigator
        open={navigatorOpen}
        deck={deck}
        currentIndex={index}
        onClose={() => setNavigatorOpen(false)}
      />
    </div>
  );
}
