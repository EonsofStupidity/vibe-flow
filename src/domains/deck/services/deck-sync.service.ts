/**
 * Deck sync — thin BroadcastChannel wrapper mirroring `{deckId, slideIndex,
 * stepIndex}` across audience and presenter surfaces in the same origin.
 *
 * @remarks
 * One channel per deck (`deck:<deckId>`). SSR-safe: on the server (or in
 * browsers without BroadcastChannel) `createDeckSyncChannel` returns a
 * no-op implementation so callers never branch. No leader election —
 * receivers apply the most recent message they see; the last surface to
 * navigate wins.
 */
export interface DeckSyncMessage {
  readonly deckId: string;
  readonly slideIndex: number;
  readonly stepIndex: number;
  readonly origin: "audience" | "presenter";
  readonly ts: number;
}

export interface DeckSyncChannel {
  post(msg: Omit<DeckSyncMessage, "ts" | "deckId">): void;
  subscribe(fn: (msg: DeckSyncMessage) => void): () => void;
  close(): void;
}

const NOOP: DeckSyncChannel = {
  post: () => {},
  subscribe: () => () => {},
  close: () => {},
};

export function createDeckSyncChannel(deckId: string): DeckSyncChannel {
  if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") {
    return NOOP;
  }
  const channel = new BroadcastChannel(`deck:${deckId}`);
  return {
    post(msg) {
      const payload: DeckSyncMessage = { ...msg, deckId, ts: Date.now() };
      channel.postMessage(payload);
    },
    subscribe(fn) {
      const handler = (e: MessageEvent<DeckSyncMessage>) => {
        if (!e.data || e.data.deckId !== deckId) return;
        fn(e.data);
      };
      channel.addEventListener("message", handler);
      return () => channel.removeEventListener("message", handler);
    },
    close() {
      channel.close();
    },
  };
}
