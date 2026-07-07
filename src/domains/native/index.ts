/**
 * useNative — hook for consuming NativeBridge in React components.
 *
 * @remarks
 * Returns the bridge directly — all methods are async and safe to call
 * in both Tauri and browser environments. Check `NativeBridge.isNative`
 * to conditionally show Tauri-only UI (e.g. update banners).
 */
export { NativeBridge } from "./native.bridge";
export type { NativeCapabilities, NativeUpdateInfo } from "./native.types";
