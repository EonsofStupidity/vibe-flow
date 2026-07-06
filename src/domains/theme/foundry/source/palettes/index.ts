/**
 * Palette registry — the one authoritative list of every palette. The
 * build script iterates this array to emit CSS. Add a new palette by
 * creating its `*.palette.ts` file and appending it here.
 *
 * @remarks This is the single-barrel exception permitted for foundry
 * registries; consumers still import individual palettes by name.
 */
import type { PaletteSource } from "../../foundry.types";

// Surfaces
import { inkPalette } from "./ink.palette";
import { graphitePalette } from "./graphite.palette";
import { slatePalette } from "./slate.palette";
import { mochaPalette } from "./mocha.palette";
import { midnightPalette } from "./midnight.palette";
import { porcelainPalette } from "./porcelain.palette";

// Brand primary
import { amberPalette } from "./amber.palette";
import { cyanPalette } from "./cyan.palette";
import { magentaPalette } from "./magenta.palette";
import { viridianPalette } from "./viridian.palette";
import { ceruleanPalette } from "./cerulean.palette";
import { vermilionPalette } from "./vermilion.palette";
import { saffronPalette } from "./saffron.palette";
import { electricPalette } from "./electric.palette";

// Brand alt siblings
import { amberEmberPalette } from "./amber-ember.palette";
import { cyanIcePalette } from "./cyan-ice.palette";
import { magentaOrchidPalette } from "./magenta-orchid.palette";

// Accents
import { limePalette } from "./lime.palette";
import { violetPalette } from "./violet.palette";
import { coralPalette } from "./coral.palette";
import { tealPalette } from "./teal.palette";
import { rosePalette } from "./rose.palette";
import { crimsonPalette } from "./crimson.palette";
import { orangePalette } from "./orange.palette";
import { goldPalette } from "./gold.palette";
import { chartreusePalette } from "./chartreuse.palette";
import { emeraldPalette } from "./emerald.palette";
import { jadePalette } from "./jade.palette";
import { skyPalette } from "./sky.palette";
import { azurePalette } from "./azure.palette";
import { indigoPalette } from "./indigo.palette";
import { purplePalette } from "./purple.palette";
import { plumPalette } from "./plum.palette";
import { fuchsiaPalette } from "./fuchsia.palette";
import { pinkPalette } from "./pink.palette";
import { botanicalPalette } from "./botanical.palette";
import { oxbloodPalette } from "./oxblood.palette";
import { sagePalette } from "./sage.palette";
import { terracottaPalette } from "./terracotta.palette";
import { lavenderPalette } from "./lavender.palette";
import { mintPalette } from "./mint.palette";
import { auberginePalette } from "./aubergine.palette";

// Utility
import { warningPalette } from "./warning.palette";
import { dangerPalette } from "./danger.palette";
import { infoPalette } from "./info.palette";
import { dangerSoftPalette } from "./danger-soft.palette";
import { warningSoftPalette } from "./warning-soft.palette";
import { infoSoftPalette } from "./info-soft.palette";

export const palettes: readonly PaletteSource[] = [
  inkPalette, graphitePalette, slatePalette, mochaPalette, midnightPalette, porcelainPalette,
  amberPalette, cyanPalette, magentaPalette,
  viridianPalette, ceruleanPalette, vermilionPalette, saffronPalette, electricPalette,
  amberEmberPalette, cyanIcePalette, magentaOrchidPalette,
  limePalette, violetPalette, coralPalette, tealPalette, rosePalette,
  crimsonPalette, orangePalette, goldPalette, chartreusePalette,
  emeraldPalette, jadePalette, skyPalette, azurePalette, indigoPalette,
  purplePalette, plumPalette, fuchsiaPalette, pinkPalette,
  botanicalPalette, oxbloodPalette, sagePalette, terracottaPalette,
  lavenderPalette, mintPalette, auberginePalette,
  warningPalette, dangerPalette, infoPalette,
  dangerSoftPalette, warningSoftPalette, infoSoftPalette,
];
