/**
 * Episode enumerator — the ONLY barrel in this app.
 *
 * @remarks
 * Its single job is to import each episode module so its top-level
 * registerDeck() side effect runs. It intentionally re-exports nothing.
 * When you add a new episode, add exactly one import line here.
 */
import "./ep-000-template/episode";
