/**
 * Motion tokens — durations, easings, and named transition recipes.
 */
export interface MotionEntry { readonly name: string; readonly value: string; }

export const durations: readonly MotionEntry[] = [
  { name: "duration-instant", value: "75ms" },
  { name: "duration-fast",    value: "120ms" },
  { name: "duration-base",    value: "200ms" },
  { name: "duration-slow",    value: "320ms" },
  { name: "duration-slower",  value: "480ms" },
  { name: "duration-glacial", value: "720ms" },
];

export const easings: readonly MotionEntry[] = [
  { name: "ease-standard",     value: "cubic-bezier(0.2, 0, 0, 1)" },
  { name: "ease-emphasized",   value: "cubic-bezier(0.3, 0, 0, 1)" },
  { name: "ease-decelerate",   value: "cubic-bezier(0, 0, 0, 1)" },
  { name: "ease-accelerate",   value: "cubic-bezier(0.3, 0, 1, 1)" },
  { name: "ease-bounce",       value: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
  { name: "ease-spring-soft",  value: "cubic-bezier(0.5, 1.25, 0.75, 1.25)" },
  { name: "ease-spring-crisp", value: "cubic-bezier(0.2, 1.6, 0.4, 1)" },
];

export const transitions: readonly MotionEntry[] = [
  { name: "transition-hover", value: "all 120ms cubic-bezier(0.2, 0, 0, 1)" },
  { name: "transition-panel", value: "transform 320ms cubic-bezier(0.3, 0, 0, 1), opacity 200ms linear" },
  { name: "transition-modal", value: "transform 480ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 200ms linear" },
  { name: "transition-page",  value: "opacity 320ms cubic-bezier(0.2, 0, 0, 1)" },
];
