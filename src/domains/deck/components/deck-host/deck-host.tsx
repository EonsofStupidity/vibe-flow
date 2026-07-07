/**
 * DeckHost — the runtime shell. Composes slide + chrome + annotate + nav.
 *
 * @remarks
 * URL-driven: `/deck/$deckId/$slideIndex/$stepIndex` is the source of truth
 * for the current position. Step-aware nav helpers live in
 * `deck-nav.service`; keyboard, swipe, edge taps, and navigator all funnel
 * through the same handlers. BroadcastChannel mirrors position to any
 * open presenter surface for the same deck.
 */
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useMemo, useRef } from "react";
import {
  advance,
  canAdvance,
  canRetreat,
  clampIndex,
  clampStep,
  nextIndex,
  prevIndex,
  retreat,
} from "@/domains/deck/services/deck-nav.service";
import { getDeck } from "@/domains/deck/services/deck-registry.service";

import { useDeckSync } from "@/domains/deck/hooks/useDeckSync";
import { useRuntimeStore } from "@/domains/deck/state/runtime.store";
import { useSwipeNav } from "@/domains/input/hooks/useSwipeNav";
import { useKeyboardNav } from "@/domains/input/hooks/useKeyboardNav";
import { EdgeNav } from "@/domains/deck/components/edge-nav/edge-nav";
import { ProgressRail } from "@/domains/deck/components/progress-rail/progress-rail";
import { RuntimeToolbar } from "@/domains/deck/components/runtime-toolbar/runtime-toolbar";
import { SlideNavigator } from "@/domains/deck/components/slide-navigator/slide-navigator";
import { AnnotationLayer } from "@/domains/annotation/components/annotation-layer/annotation-layer";

interface DeckHostProps {
  readonly deckId: string;
  readonly slideIndex: number;
  readonly stepIndex: number;
}

export function DeckHost({ deckId, slideIndex, stepIndex }: DeckHostProps) {
  const deck = getDeck(deckId);
  const navigate = useNavigate();
  const surfaceRef = useRef<HTMLDivElement | null>(null);
  if (!deck) return null;
  const total = deck.slides.length;
  const index = clampIndex(slideIndex, total);
  const slide = deck.slides[index];
  const step = clampStep(stepIndex, slide);

  const chromeHidden = useRuntimeStore((s) => s.chromeHidden);
  const annotateOn = useRuntimeStore((s) => s.annotateOn);
  const navigatorOpen = useRuntimeStore((s) => s.navigatorOpen);
  const toggleChrome = useRuntimeStore((s) => s.toggleChrome);
  const toggleAnnotate = useRuntimeStore((s) => s.toggleAnnotate);
  const toggleNavigator = useRuntimeStore((s) => s.toggleNavigator);
  const setNavigatorOpen = useRuntimeStore((s) => s.setNavigatorOpen);

  const goTo = useCallback(
    (i: number, s: number) => {
      navigate({
        to: "/deck/$deckId/$slideIndex/$stepIndex",
        params: { deckId: deck.id, slideIndex: String(i), stepIndex: String(s) },
      });
    },
    [navigate, deck.id],
  );

  const onPrev = useCallback(() => {
    const p = retreat(deck, { index, step });
    goTo(p.index, p.step);
  }, [deck, index, step, goTo]);
  const onNext = useCallback(() => {
    const p = advance(deck, { index, step });
    goTo(p.index, p.step);
  }, [deck, index, step, goTo]);
  const onSlidePrev = useCallback(() => goTo(prevIndex(index, total), 0), [goTo, index, total]);
  const onSlideNext = useCallback(() => goTo(nextIndex(index, total), 0), [goTo, index, total]);

  useSwipeNav(surfaceRef, { onSwipeLeft: onNext, onSwipeRight: onPrev });
  useKeyboardNav({
    onPrev,
    onNext,
    onSlidePrev,
    onSlideNext,
    onNavigator: toggleNavigator,
    onAnnotate: toggleAnnotate,
    onChrome: toggleChrome,
  });
  useDeckSync({ deckId: deck.id, slideIndex: index, stepIndex: step, origin: "audience" });

  const ctx = useMemo(
    () => ({ deckId: deck.id, index, total, stepIndex: step }),
    [deck.id, index, total, step],
  );
  const effectiveChromeHidden = chromeHidden || slide.chrome === "hidden";
  const allowAnnotate = slide.allowAnnotate !== false;
  const slideKey = `${slide.id}:${step}`;

  return (
    <div ref={surfaceRef} className="relative h-dvh w-dvw overflow-hidden bg-surface text-ink">
      <ProgressRail index={index} total={total} hidden={effectiveChromeHidden} />

      <div key={slide.id} className="absolute inset-0">
        {slide.render(ctx)}
      </div>

      {allowAnnotate ? <AnnotationLayer enabled={annotateOn} slideKey={slideKey} /> : null}

      <EdgeNav
        onPrev={onPrev}
        onNext={onNext}
        canPrev={canRetreat(deck, { index, step })}
        canNext={canAdvance(deck, { index, step })}
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
        deckId={deck.id}
        currentIndex={index}
        onClose={() => setNavigatorOpen(false)}
      />
    </div>
  );
}

