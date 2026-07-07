/**
 * PresenterHost — full teleprompter surface for presenting.
 *
 * @remarks
 * Layout:
 *   Left column (3fr): scaled slide preview + prev/next nav
 *   Right column (2fr): reveals list + script beats + up-next
 *
 * The BroadcastChannel keeps the audience surface in sync. Keyboard
 * navigation works identically to the audience surface.
 *
 * Script beats are loaded from `getScript(slide.script.file)` when
 * the slide has a script link. The active beat (matching the current
 * reveal step) is highlighted and auto-scrolled into view.
 */
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Radio } from "lucide-react";
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
import { getScript } from "@/domains/deck/services/script-loader.service";
import { useDeckSync } from "@/domains/deck/hooks/useDeckSync";
import { useKeyboardNav } from "@/domains/input/hooks/useKeyboardNav";
import { cn } from "@/domains/ui/utils/cn.util";

interface PresenterHostProps {
  readonly deckId: string;
  readonly slideIndex: number;
  readonly stepIndex: number;
}

export function PresenterHost({ deckId, slideIndex, stepIndex }: PresenterHostProps) {
  const deck = getDeck(deckId);
  if (!deck) throw new Error(`[presenter-host] unknown deck id: ${deckId}`);
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

  const onPrev = useCallback(() => { const p = retreat(deck, { index, step }); goTo(p.index, p.step); }, [deck, index, step, goTo]);
  const onNext = useCallback(() => { const p = advance(deck, { index, step }); goTo(p.index, p.step); }, [deck, index, step, goTo]);
  const onSlidePrev = useCallback(() => goTo(prevIndex(index, total), 0), [goTo, index, total]);
  const onSlideNext = useCallback(() => goTo(nextIndex(index, total), 0), [goTo, index, total]);
  const noop = useCallback(() => {}, []);

  useKeyboardNav({ onPrev, onNext, onSlidePrev, onSlideNext, onNavigator: noop, onAnnotate: noop, onChrome: noop });

  const [peerConnected, setPeerConnected] = useState(false);
  const peerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useDeckSync({ deckId: deck.id, slideIndex: index, stepIndex: step, origin: "presenter" });

  // Detect audience surface liveness via a ping-pong pattern via BroadcastChannel side effect.
  useEffect(() => {
    const bc = typeof BroadcastChannel !== "undefined"
      ? new BroadcastChannel(`deck:${deck.id}`)
      : null;
    if (!bc) return;
    const onMsg = () => {
      setPeerConnected(true);
      if (peerTimeoutRef.current) clearTimeout(peerTimeoutRef.current);
      peerTimeoutRef.current = setTimeout(() => setPeerConnected(false), 4000);
    };
    bc.addEventListener("message", onMsg);
    return () => {
      bc.removeEventListener("message", onMsg);
      bc.close();
      if (peerTimeoutRef.current) clearTimeout(peerTimeoutRef.current);
    };
  }, [deck.id]);

  const ctx = useMemo(() => ({ deckId: deck.id, index, total, stepIndex: step }), [deck.id, index, total, step]);
  const nextSlide = index < total - 1 ? deck.slides[index + 1] : null;
  const reveals = slide.reveals ?? [];
  const script = slide.script ? getScript(slide.script.file) : undefined;
  const activeBeat = script?.beats[step];
  const timer = useElapsed();

  const beatRefs = useRef<(HTMLLIElement | null)[]>([]);
  useEffect(() => {
    beatRefs.current[step]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [step]);

  return (
    <div className="grid h-dvh w-dvw grid-cols-[minmax(0,3fr)_minmax(0,2fr)] bg-surface text-ink">

      {/* Left: preview + controls */}
      <div className="flex flex-col border-r border-hairline">
        <header className="flex items-center justify-between px-f6 py-f4 border-b border-hairline">
          <div className="min-w-0">
            <div className="flex items-center gap-f2 font-mono text-eyebrow uppercase tracking-[0.25em] text-brand">
              <span>Presenter</span>
              <span
                title={peerConnected ? "Audience surface connected" : "Audience surface not detected"}
                className={cn(
                  "inline-block h-2 w-2 rounded-full transition-colors",
                  peerConnected ? "bg-accent-lime shadow-[0_0_0.5rem_var(--color-accent-lime)]" : "bg-surface-overlay",
                )}
              />
              {peerConnected ? (
                <span className="text-accent-lime">Audience live</span>
              ) : (
                <span className="text-ink-muted">No audience</span>
              )}
            </div>
            <h1 className="font-display text-h2 font-semibold leading-tight text-ink-strong truncate">
              {deck.title}
            </h1>
          </div>
          <div className="flex items-center gap-f3 font-mono tabular-nums text-h3 text-ink-strong shrink-0">
            <Radio className="h-4 w-4 text-brand" aria-hidden />
            {timer}
          </div>
        </header>

        {/* Slide preview */}
        <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-surface-raised p-f6">
          <div className="relative aspect-video w-full max-w-[min(100%,64rem)] overflow-hidden rounded-f-lg bg-surface border border-hairline">
            {slide.render(ctx)}
          </div>
        </div>

        {/* Nav footer */}
        <footer className="flex items-center justify-between gap-f4 border-t border-hairline px-f6 py-f4">
          <button
            type="button"
            onClick={onPrev}
            disabled={!canRetreat(deck, { index, step })}
            className="tap-target rounded-f-md bg-surface-raised px-f5 font-mono text-eyebrow uppercase tracking-[0.2em] text-ink disabled:opacity-40 hover:bg-surface-overlay"
          >
            ← Prev
          </button>
          <div className="text-center font-mono text-eyebrow uppercase tracking-[0.2em] text-ink-muted">
            <span className="text-ink-strong">{index + 1}</span>/{total} slides
            {reveals.length > 0 && (
              <span className="ml-f3">
                beat <span className="text-ink-strong">{step + 1}</span>/{reveals.length}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onNext}
            disabled={!canAdvance(deck, { index, step })}
            className="tap-target rounded-f-md bg-brand px-f5 font-mono text-eyebrow uppercase tracking-[0.2em] text-brand-ink disabled:opacity-40 hover:brightness-110"
          >
            Next →
          </button>
        </footer>
      </div>

      {/* Right: reveals + script + up-next */}
      <div className="flex flex-col overflow-hidden">

        {/* Reveals */}
        <section className="flex flex-col border-b border-hairline p-f6 gap-f3">
          <div className="font-mono text-eyebrow uppercase tracking-[0.25em] text-ink-muted">
            Reveals — {slide.title}
          </div>
          {reveals.length === 0 ? (
            <p className="text-body text-ink-muted">No reveal beats on this slide.</p>
          ) : (
            <ol className="flex flex-col gap-f2">
              {reveals.map((r, i) => {
                const active = i === step;
                return (
                  <li key={r.id}>
                    <button
                      type="button"
                      onClick={() => goTo(index, i)}
                      className={cn(
                        "flex w-full items-center gap-f4 rounded-f-md px-f4 py-f3 text-left transition",
                        active
                          ? "bg-brand text-brand-ink"
                          : "bg-surface-raised text-ink hover:bg-surface-overlay",
                      )}
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
        </section>

        {/* Script / teleprompter */}
        <section className="flex flex-1 flex-col overflow-hidden p-f6 gap-f3">
          <div className="font-mono text-eyebrow uppercase tracking-[0.25em] text-ink-muted">
            Script
          </div>
          {!script ? (
            <p className="text-body text-ink-muted">
              {slide.script
                ? `Loading beats from "${slide.script.file}"…`
                : "No script linked for this slide."}
            </p>
          ) : (
            <ol className="flex flex-1 flex-col gap-f3 overflow-y-auto" aria-live="polite">
              {script.beats.map((beat, i) => {
                const active = i === step;
                const past   = i < step;
                return (
                  <li
                    key={beat.id}
                    ref={(el) => { beatRefs.current[i] = el; }}
                    className={cn(
                      "rounded-f-md border p-f4 transition-[background-color,border-color,opacity]",
                      active
                        ? "border-brand bg-brand/10"
                        : past
                        ? "border-transparent bg-transparent opacity-40"
                        : "border-hairline bg-surface-raised opacity-60",
                    )}
                  >
                    <div className="flex items-start gap-f3">
                      <span className="mt-0.5 font-mono text-eyebrow tabular-nums text-ink-muted">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-body leading-relaxed", active ? "text-ink-strong font-semibold" : "text-ink")}>
                          {beat.cue}
                        </p>
                        {beat.note ? (
                          <p className="mt-f2 text-eyebrow italic text-ink-muted">{beat.note}</p>
                        ) : null}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}

          {/* Active beat callout */}
          {activeBeat ? (
            <div className="shrink-0 rounded-f-lg border border-brand bg-brand/10 p-f4">
              <div className="font-mono text-eyebrow uppercase tracking-[0.2em] text-brand mb-f2">
                Now saying
              </div>
              <p className="font-display text-h3 text-ink-strong leading-snug">{activeBeat.cue}</p>
              {activeBeat.note ? (
                <p className="mt-f2 text-body italic text-ink-muted">{activeBeat.note}</p>
              ) : null}
            </div>
          ) : null}
        </section>

        {/* Up next */}
        {nextSlide ? (
          <aside className="shrink-0 border-t border-hairline p-f5">
            <div className="font-mono text-eyebrow uppercase tracking-[0.25em] text-ink-muted">
              Up next
            </div>
            <div className="mt-f2 font-display text-h3 font-semibold text-ink-strong leading-tight">
              {nextSlide.title}
            </div>
            {nextSlide.reveals && nextSlide.reveals.length > 0 ? (
              <div className="mt-f1 font-mono text-eyebrow text-ink-muted">
                {nextSlide.reveals.length} beats
              </div>
            ) : null}
          </aside>
        ) : (
          <aside className="shrink-0 border-t border-hairline p-f5">
            <div className="font-mono text-eyebrow uppercase tracking-[0.25em] text-accent-lime">
              End of deck
            </div>
          </aside>
        )}
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
