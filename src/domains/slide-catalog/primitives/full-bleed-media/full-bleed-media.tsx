/**
 * FullBleedMedia — edge-to-edge image with gradient overlay and child slots.
 *
 * @remarks
 * Tone applies to the overlay gradient tint and to any child content that
 * reads `--tone-*` vars. The image itself is unstyled beyond object-fit.
 *
 * @public
 */
import { cn } from "@/domains/ui/utils/cn.util";
import { toneVars } from "../tone-vars.util";
import type { FullBleedMediaProps } from "./full-bleed-media.types";

const OVERLAY_CLASSES = {
  none:   "",
  top:    "bg-gradient-to-b from-[var(--tone-glass-strong)] via-transparent to-transparent",
  bottom: "bg-gradient-to-t from-[var(--tone-glass-strong)] via-transparent to-transparent",
  full:   "bg-[var(--tone-glass)]",
};

const STRENGTH_OPACITY = {
  light:  "opacity-40",
  medium: "opacity-65",
  heavy:  "opacity-85",
};

export function FullBleedMedia({
  src,
  alt,
  overlay = "bottom",
  overlayStrength = "medium",
  tone = "neutral",
  children,
  fit = "cover",
  className,
}: FullBleedMediaProps) {
  return (
    <div
      style={toneVars(tone)}
      className={cn("relative isolate h-full w-full overflow-hidden", className)}
    >
      <img
        src={src}
        alt={alt}
        className={cn(
          "absolute inset-0 h-full w-full",
          fit === "cover"   && "object-cover",
          fit === "contain" && "object-contain",
          fit === "fill"    && "object-fill",
        )}
        draggable={false}
      />

      {overlay !== "none" ? (
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0",
            OVERLAY_CLASSES[overlay],
            STRENGTH_OPACITY[overlayStrength],
          )}
        />
      ) : null}

      {children ? (
        <div className="relative z-10 flex h-full w-full flex-col justify-end p-f8">
          {children}
        </div>
      ) : null}
    </div>
  );
}
