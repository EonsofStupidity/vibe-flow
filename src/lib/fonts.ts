/**
 * Font loader side-effect module.
 *
 * @remarks
 * Imported once from the root route so @fontsource CSS is bundled into
 * the app rather than fetched from a CDN. Ordering follows the design
 * token priority: display, body, mono.
 */
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/inter-tight/400.css";
import "@fontsource/inter-tight/500.css";
import "@fontsource/inter-tight/600.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
