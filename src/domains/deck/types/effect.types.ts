/**
 * SlideEffect — configurable enter/exit/between transition for a slide
 * or an entire deck.
 *
 * @remarks
 * Duration and easing reference the motion token primitives defined in
 * `src/domains/theme/foundry/source/semantic/motion.semantic.ts` so every
 * transition respects `prefers-reduced-motion` automatically.
 *
 * Slides may declare their own `effect` to override the deck default.
 * `"none"` explicitly disables any inherited default.
 */

export type SlideEffectName =
  | "fade"
  | "slide-left"
  | "slide-right"
  | "scale-up"
  | "scale-down"
  | "blur-in"
  | "wipe-left"
  | "wipe-right"
  | "none";

export type SlideEffectPhase = "enter" | "exit" | "between";

export interface SlideEffect {
  readonly name: SlideEffectName;
  /**
   * CSS duration string. Defaults to `var(--motion-duration-base)`.
   * Use the token surface: `"var(--motion-duration-slow)"` etc.
   */
  readonly duration?: string;
  /**
   * CSS easing string. Defaults to `var(--motion-ease-emphasized)`.
   * Use the token surface: `"var(--motion-ease-decelerate)"` etc.
   */
  readonly easing?: string;
}

export const SLIDE_EFFECTS: readonly { name: SlideEffectName; label: string; description: string }[] = [
  { name: "fade",        label: "Fade",         description: "Dissolve between slides" },
  { name: "slide-left",  label: "Slide Left",   description: "Translate in from the right" },
  { name: "slide-right", label: "Slide Right",  description: "Translate in from the left" },
  { name: "scale-up",    label: "Scale Up",     description: "Zoom in from slightly smaller" },
  { name: "scale-down",  label: "Scale Down",   description: "Zoom in from slightly larger" },
  { name: "blur-in",     label: "Blur In",      description: "Unblur and fade in" },
  { name: "wipe-left",   label: "Wipe Left",    description: "Clip reveal moving left to right" },
  { name: "wipe-right",  label: "Wipe Right",   description: "Clip reveal moving right to left" },
  { name: "none",        label: "None",         description: "Cut with no transition" },
];
