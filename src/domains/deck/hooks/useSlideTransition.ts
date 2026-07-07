/**
 * useSlideTransition — returns the CSS class name to apply to a slide
 * container during enter/exit phases based on the active SlideEffect.
 *
 * @remarks
 * Resolves the slide's own `effect` first, then the deck's `defaultEffect`,
 * then falls back to `"fade"`. A slide that explicitly sets `effect.name =
 * "none"` opts out entirely. All durations/easings reference CSS motion
 * tokens so `prefers-reduced-motion` is honoured automatically.
 */
import type { Deck } from "../types/deck.types";
import type { SlideDefinition } from "../types/slide.types";
import type { SlideEffect, SlideEffectName } from "../types/effect.types";

const DURATION_DEFAULT = "var(--motion-duration-base)";
const EASING_DEFAULT   = "var(--motion-ease-emphasized)";

export function resolveEffect(slide: SlideDefinition, deck: Deck): SlideEffect {
  return slide.effect ?? deck.defaultEffect ?? { name: "fade" };
}

export function effectEnterClass(name: SlideEffectName): string {
  switch (name) {
    case "fade":        return "slide-enter-fade";
    case "slide-left":  return "slide-enter-slide-left";
    case "slide-right": return "slide-enter-slide-right";
    case "scale-up":    return "slide-enter-scale-up";
    case "scale-down":  return "slide-enter-scale-down";
    case "blur-in":     return "slide-enter-blur-in";
    case "wipe-left":   return "slide-enter-wipe-left";
    case "wipe-right":  return "slide-enter-wipe-right";
    case "none":        return "";
    default:            return "slide-enter-fade";
  }
}

export function effectCssVars(effect: SlideEffect): Record<string, string> {
  return {
    "--slide-transition-duration": effect.duration ?? DURATION_DEFAULT,
    "--slide-transition-easing":   effect.easing   ?? EASING_DEFAULT,
  };
}
