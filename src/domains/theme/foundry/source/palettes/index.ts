/**
 * Palette registry — the one authoritative list of every palette. The
 * build script iterates this array to emit CSS. Add a new palette by
 * creating its `*.palette.ts` file and appending it here.
 *
 * @remarks This is the single-barrel exception permitted for foundry
 * registries; consumers still import individual palettes by name.
 */
import type { PaletteSource } from "../../foundry.types";
import { inkPalette } from "./ink.palette";
import { amberPalette } from "./amber.palette";
import { cyanPalette } from "./cyan.palette";
import { magentaPalette } from "./magenta.palette";
import { limePalette } from "./lime.palette";
import { violetPalette } from "./violet.palette";
import { coralPalette } from "./coral.palette";
import { tealPalette } from "./teal.palette";
import { rosePalette } from "./rose.palette";
import { warningPalette } from "./warning.palette";
import { dangerPalette } from "./danger.palette";
import { infoPalette } from "./info.palette";

export const palettes: readonly PaletteSource[] = [
  inkPalette,
  amberPalette,
  cyanPalette,
  magentaPalette,
  limePalette,
  violetPalette,
  coralPalette,
  tealPalette,
  rosePalette,
  warningPalette,
  dangerPalette,
  infoPalette,
];
