import type { SlideDefinition } from "@/domains/deck/types/slide.types";
import { FullBleedMedia } from "@/domains/slide-catalog/primitives/full-bleed-media/full-bleed-media";

const SVG = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 675'><defs><radialGradient id='r' cx='50%25' cy='50%25' r='70%25'><stop offset='0' stop-color='%230a0f2e'/><stop offset='1' stop-color='%23000'/></radialGradient></defs><rect width='100%25' height='100%25' fill='url(%23r)'/><g opacity='0.3'><line x1='0' y1='337' x2='1200' y2='337' stroke='%231e3a8a' stroke-width='1'/><line x1='600' y1='0' x2='600' y2='675' stroke='%231e3a8a' stroke-width='1'/></g><circle cx='600' cy='337' r='200' fill='none' stroke='%233b82f6' stroke-width='1.5' opacity='0.5'/><circle cx='600' cy='337' r='120' fill='none' stroke='%236366f1' stroke-width='1' opacity='0.4'/></svg>`;

export const fullBleedSlide: SlideDefinition = {
  id: "full-bleed-showcase",
  kind: "custom",
  title: "FullBleedMedia — bottom overlay, brand tone",
  render: () => (
    <FullBleedMedia
      src={SVG}
      alt="Abstract blueprint grid"
      overlay="bottom"
      overlayStrength="heavy"
      tone="brand"
    >
      <div className="absolute bottom-0 left-0 w-full px-f8 pb-f8">
        <div className="font-mono text-eyebrow uppercase tracking-[0.3em] text-brand">
          Full Bleed Media
        </div>
        <h2 className="mt-f3 font-display text-display font-bold leading-tight text-ink-strong">
          Edge-to-edge presence.
        </h2>
        <p className="mt-f4 max-w-xl text-h3 text-ink-muted">
          Your image fills every pixel. The gradient overlay protects your type. The tone tints the glow.
        </p>
      </div>
    </FullBleedMedia>
  ),
};
