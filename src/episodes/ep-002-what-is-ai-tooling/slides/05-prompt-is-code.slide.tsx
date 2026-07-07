import type { SlideDefinition } from "@/domains/deck/types/slide.types";
import { SlideFrame } from "@/domains/slide-catalog/primitives/slide-frame/slide-frame";
import { TerminalOutput } from "@/domains/slide-catalog/primitives/terminal-output/terminal-output";
import { CalloutCard } from "@/domains/slide-catalog/primitives/callout-card/callout-card";

export const promptIsCodeSlide: SlideDefinition = {
  id: "ep002-prompt-is-code",
  kind: "custom",
  title: "Prompt is Code",
  render: () => (
    <SlideFrame align="center">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-f7">
        <CalloutCard
          tone="magenta"
          title="Your prompt is the program."
          body="The model doesn't run your words — it runs a transformed version of them through billions of parameters. Every word is a weight. Vague words = vague weights = vague output."
        />
        <TerminalOutput
          title="bad prompt vs good prompt"
          lines={[
            { id: "c1", kind: "comment",  text: "# Bad: tells the model nothing" },
            { id: "p1", kind: "prompt",   text: "make a login page" },
            { id: "e1", kind: "stderr",   text: "→ 80 lines of guessed HTML with zero context" },
            { id: "c2", kind: "comment",  text: "# Good: gives the model a role, context, and constraint" },
            { id: "p2", kind: "prompt",   text: "You are a TypeScript dev. Add a Supabase email/password sign-in form to src/routes/auth.tsx. Use React Aria, no new dependencies." },
            { id: "o1", kind: "stdout",   text: "→ Targeted, reviewable, matches the codebase" },
          ]}
        />
      </div>
    </SlideFrame>
  ),
};
