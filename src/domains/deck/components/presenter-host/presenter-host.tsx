/**
 * PresenterHost — teleprompter surface. Renders a scaled preview of the
 * current slide, an upcoming-reveals list, a script placeholder column,
 * and a running mm:ss timer. Mirrors the audience via BroadcastChannel.
 *
 * @remarks
 * Step 2 ships the shell only. Script beats (MDX) land in step 5;
 * slide-preview hover cards in step 6. Keyboard nav here is intentionally
 * identical to the audience so a presenter can drive either surface.
 */
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Deck } from "@/domains/deck/types/deck.types";
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
import { useDeckSync } from "@/domains/deck/hooks/useDeckSync";
import { useKeyboardNav } from "@/domains/input/hooks/useKeyboardNav";

interface PresenterHostProps {
  readonly deck: Deck;
  readonly slideIndex: number;
  readonly stepIndex: number;
}

export function PresenterHost({ deck, slideIndex, stepIndex }: PresenterHostProps) {
  const navigate = useNavigate();
  const total = deck.slides.length;
  const index = clampIndex(slideIndex, total);
  const slide = deck.slides[index];
  const step = clampStep(stepIndex, slide);

  const goTo = useCallback(
    (i: number, s: number) =>
      navigate({
        to: "/present/$deckId/$slideIndex/$stepIndex",
        params: { deckId: deck.id, slideIndex: String(i), stepIndex: String(s) },
      }),
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
  const noop = useCallback(() => {}, []);

  useKeyboardNav({
    onPrev,
    onNext,
    onSlidePrev,
    onSlideNext,
    onNavigator: noop,
    onAnnotate: noop,
    onChrome: noop,
  });
  useDeckSync({ deckId: deck.id, slideIndex: index, stepIndex: step, origin: "presenter" });

  const ctx = useMemo(
    () => ({ deckId: deck.id, index, total, stepIndex: step }),
    [deck.id, index, total, step],
  );
  const nextSlide = index < total - 1 ? deck.slides[index + 1] : null;
  const reveals = slide.reveals ?? [];
  const timer = useElapsed();

  return (
    <div className="grid h-dvh w-dvw grid-cols-[minmax(0,3fr)_minmax(0,2fr)] bg-surface text-ink">
      {/* Left column: scaled preview + controls */}
      <div className="flex flex-col hairline-e">
        <header className="flex items-center justify-between px-f6 py-f4 hairline-b">
          <div>
            <div className="font-mono text-eyebrow uppercase tracking-[0.25em] text-brand">
              Presenter
            </div>
            <h1 className="font-display text-h2 text-ink-strong">{deck.title}</h1>
          </div>
          <div className="font-mono text-h3 tabular-nums text-ink-strong">{timer}</div>
        </header>

        <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-surface-raised p-f6">
          <div className="relative aspect-video w-full max-w-[min(100%,60rem)] overflow-hidden rounded-f-lg bg-surface hairline-b">
            {slide.render(ctx)}
          </div>
        </div>

        <footer className="flex items-center justify-between gap-f4 px-f6 py-f4 hairline-t">
          <button
            type="button"
            onClick={onPrev}
            disabled={!canRetreat(deck, { index, step })}
            className="tap-target rounded-f-md bg-surface-raised px-f5 font-mono text-eyebrow uppercase tracking-[0.2em] text-ink disabled:opacity-40"
          >
            ← Prev
          </button>
          <div className="font-mono text-eyebrow uppercase tracking-[0.2em] text-ink-muted">
            Slide {index + 1}/{total} · Step {step + 1}/{Math.max(reveals.length, 1)}
          </div>
          <button
            type="button"
            onClick={onNext}
            disabled={!canAdvance(deck, { index, step })}
            className="tap-target rounded-f-md bg-brand px-f5 font-mono text-eyebrow uppercase tracking-[0.2em] text-brand-ink disabled:opacity-40"
          >
            Next →
          </button>
        </footer>
      </div>

      {/* Right column: reveals + script + next-up */}
      <div className="flex flex-col overflow-hidden">
        <section className="flex-1 overflow-y-auto p-f6">
          <div className="font-mono text-eyebrow uppercase tracking-[0.25em] text-ink-muted">
            Reveals
          </div>
          <h2 className="mt-f2 font-display text-h3 text-ink-strong">{slide.title}</h2>
          {reveals.length === 0 ? (
            <p className="mt-f4 text-body text-ink-muted">This slide has no reveal beats.</p>
          ) : (
            <ol className="mt-f4 flex flex-col gap-f2">
              {reveals.map((r, i) => {
                const active = i === step;
                return (
                  <li key={r.id}>
                    <button
                      type="button"
                      onClick={() => goTo(index, i)}
                      className={`flex w-full items-center gap-f4 rounded-f-md px-f4 py-f3 text-left transition ${
                        active
                          ? "bg-brand text-brand-ink"
                          : "bg-surface-raised text-ink hover:bg-surface-overlay"
                      }`}
                    >
                      <span className="font-mono text-eyebrow tabular-nums opacity-70">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display text-body">{r.label}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          )}

          <div className="mt-f7 font-mono text-eyebrow uppercase tracking-[0.25em] text-ink-muted">
            Script
          </div>
          <p className="mt-f2 text-body text-ink-muted">
            {slide.script
              ? `Beats from ${slide.script.file} — teleprompter renders in step 5.`
              : "No script linked for this slide."}
          </p>
        </section>

        {nextSlide ? (
          <aside className="p-f6 hairline-t">
            <div className="font-mono text-eyebrow uppercase tracking-[0.25em] text-ink-muted">
              Up next
            </div>
            <div className="mt-f2 font-display text-h3 text-ink-strong">{nextSlide.title}</div>
          </aside>
        ) : null}
      </div>
    </div>
  );
}

function useElapsed(): string {
  const [start] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const secs = Math.max(0, Math.floor((now - start) / 1000));
  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}
