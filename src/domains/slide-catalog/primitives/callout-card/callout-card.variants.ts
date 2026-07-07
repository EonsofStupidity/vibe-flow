import { tv } from "tailwind-variants";

export const calloutCardVariants = tv({
  slots: {
    root: [
      "relative isolate flex w-full flex-col overflow-hidden",
      "rounded-f-lg border border-[var(--tone-edge)] bg-[var(--tone-glass)]",
      "text-ink backdrop-blur-md",
      "[box-shadow:var(--tone-halo)]",
    ].join(" "),
    sheen: [
      "pointer-events-none absolute inset-0 bg-[image:var(--tone-sheen)] opacity-60",
      "mix-blend-screen",
    ].join(" "),
    bar: [
      "pointer-events-none absolute left-0 top-1/2 h-[72%] w-[0.1875rem]",
      "-translate-y-1/2 rounded-full bg-[var(--tone-surface)]",
      "shadow-[0_0_1rem_var(--tone-glow)]",
    ].join(" "),
    kicker: [
      "font-mono uppercase tracking-[0.24em] text-[color:var(--tone-surface)]",
      "[text-shadow:var(--tone-text-shadow)]",
    ].join(" "),
    title: [
      "font-display font-semibold leading-tight text-ink-strong",
      "[text-shadow:var(--tone-text-shadow)]",
    ].join(" "),
    body: "text-body leading-snug text-ink",
    ctaRow: "mt-f6 flex flex-wrap items-center gap-f3",
  },
  variants: {
    density: {
      comfy:   { root: "p-f7 gap-f5", title: "text-h1", kicker: "text-eyebrow mb-f2" },
      compact: { root: "p-f5 gap-f3", title: "text-h2", kicker: "text-eyebrow mb-f1" },
    },
  },
  defaultVariants: {
    density: "comfy",
  },
});
