/**
 * useDeckSync — mirror the current `{slideIndex, stepIndex}` across sibling
 * deck surfaces (audience ↔ presenter) via BroadcastChannel.
 *
 * @remarks
 * - Posts on every position change (from this surface).
 * - Subscribes and navigates when a peer surface (different `origin`)
 *   reports a different position. Uses `replace: true` so back/forward
 *   history stays sane.
 * - Ignores echoes of the local origin.
 */
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import {
  createDeckSyncChannel,
  type DeckSyncChannel,
} from "@/domains/deck/services/deck-sync.service";

interface UseDeckSyncArgs {
  readonly deckId: string;
  readonly slideIndex: number;
  readonly stepIndex: number;
  readonly origin: "audience" | "presenter";
}

export function useDeckSync({ deckId, slideIndex, stepIndex, origin }: UseDeckSyncArgs): void {
  const navigate = useNavigate();
  const channelRef = useRef<DeckSyncChannel | null>(null);

  // One channel per deck for the lifetime of the surface.
  useEffect(() => {
    const channel = createDeckSyncChannel(deckId);
    channelRef.current = channel;
    return () => {
      channel.close();
      channelRef.current = null;
    };
  }, [deckId]);

  // Post whenever our position changes.
  useEffect(() => {
    channelRef.current?.post({ slideIndex, stepIndex, origin });
  }, [slideIndex, stepIndex, origin]);

  // Subscribe to peer messages.
  useEffect(() => {
    const channel = channelRef.current;
    if (!channel) return;
    const to = origin === "audience" ? "/deck/$deckId/$slideIndex/$stepIndex" : "/present/$deckId/$slideIndex/$stepIndex";
    return channel.subscribe((msg) => {
      if (msg.origin === origin) return;
      if (msg.slideIndex === slideIndex && msg.stepIndex === stepIndex) return;
      navigate({
        to,
        params: {
          deckId,
          slideIndex: String(msg.slideIndex),
          stepIndex: String(msg.stepIndex),
        },
        replace: true,
      });
    });
  }, [deckId, slideIndex, stepIndex, origin, navigate]);
}
