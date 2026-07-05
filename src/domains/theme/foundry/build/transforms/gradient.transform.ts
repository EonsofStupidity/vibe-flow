/**
 * Gradient recipe transform. Emits linear/radial/conic/mesh gradient tokens
 * derived from palette ladders — no hand-picked stops.
 */
import type { Ladder, LadderStep, GradientPairing } from "../../foundry.types";
import { oklchString } from "./oklch-ladder.transform";

export interface GradientToken {
  readonly name: string;
  readonly value: string;
}

/** Single-palette recipes — emitted for every brand + accent palette. */
export function buildGradients(paletteName: string, ladder: Ladder): readonly GradientToken[] {
  const stop = (step: LadderStep) => oklchString(ladder[step]);
  return [
    { name: `${paletteName}-linear`,      value: `linear-gradient(135deg, ${stop(400)} 0%, ${stop(700)} 100%)` },
    { name: `${paletteName}-linear-soft`, value: `linear-gradient(135deg, ${stop(200)} 0%, ${stop(500)} 100%)` },
    { name: `${paletteName}-linear-vivid`,value: `linear-gradient(135deg, ${stop(300)} 0%, ${stop(600)} 100%)` },
    { name: `${paletteName}-radial`,      value: `radial-gradient(circle at 30% 20%, ${stop(500)} 0%, ${stop(900)} 100%)` },
    { name: `${paletteName}-radial-spot`, value: `radial-gradient(ellipse at 50% 0%, ${stop(300)} 0%, ${stop(700)} 60%, ${stop(950)} 100%)` },
    { name: `${paletteName}-conic`,       value: `conic-gradient(from 120deg at 50% 50%, ${stop(500)}, ${stop(300)}, ${stop(500)})` },
    { name: `${paletteName}-conic-sweep`, value: `conic-gradient(from 0deg at 50% 50%, ${stop(700)}, ${stop(400)}, ${stop(200)}, ${stop(400)}, ${stop(700)})` },
    { name: `${paletteName}-sheen`,       value: `linear-gradient(105deg, ${stop(800)} 0%, ${stop(500)} 45%, ${stop(200)} 55%, ${stop(500)} 65%, ${stop(800)} 100%)` },
    { name: `${paletteName}-aurora`,      value: `linear-gradient(135deg in oklch, ${stop(950)} 0%, ${stop(700)} 25%, ${stop(400)} 55%, ${stop(200)} 80%, ${stop(50)} 100%)` },
    { name: `${paletteName}-duotone`,     value: `linear-gradient(135deg, ${stop(700)} 0%, ${stop(300)} 100%)` },
  ];
}

/** Multi-palette meshes — emitted only for explicitly registered pairings. */
export function buildMeshes(
  pairings: readonly GradientPairing[],
  ladders: ReadonlyMap<string, Ladder>,
): readonly GradientToken[] {
  const out: GradientToken[] = [];
  const seen = new Set<string>();
  const push = (t: GradientToken) => {
    if (seen.has(t.name)) return;
    seen.add(t.name);
    out.push(t);
  };
  for (const p of pairings) {
    const a = ladders.get(p.a);
    const b = ladders.get(p.b);
    if (!a || !b) throw new Error(`[foundry] mesh pairing references unknown palette: ${p.a} × ${p.b}`);
    const stop = (l: Ladder, s: LadderStep) => oklchString(l[s]);
    push({
      name: `${p.a}-${p.b}-mesh-2`,
      value: `radial-gradient(at 20% 20%, ${stop(a, 400)} 0%, transparent 55%), radial-gradient(at 80% 30%, ${stop(b, 500)} 0%, transparent 60%), radial-gradient(at 40% 90%, ${stop(a, 700)} 0%, transparent 65%), ${stop(a, 900)}`,
    });
    if (p.c) {
      const cLad = ladders.get(p.c);
      if (!cLad) throw new Error(`[foundry] mesh pairing references unknown palette: ${p.c}`);
      push({
        name: `${p.a}-${p.b}-${p.c}-mesh-3`,
        value: `radial-gradient(at 15% 15%, ${stop(a, 400)} 0%, transparent 55%), radial-gradient(at 85% 20%, ${stop(b, 400)} 0%, transparent 55%), radial-gradient(at 50% 90%, ${stop(cLad, 500)} 0%, transparent 60%), ${stop(a, 950)}`,
      });
    }
  }
  return out;
}
