/**
 * Native capability types — contracts for all Tauri-backed operations.
 *
 * @remarks
 * These types describe capabilities, never implementations. The NativeBridge
 * resolves them to either real Tauri APIs or no-op browser fallbacks at
 * runtime. App code imports only from this file and native.bridge.ts.
 */

export interface NativeUpdateInfo {
  readonly version: string;
  readonly body: string | null;
}

export interface NativeCapabilities {
  /** Is the app running inside a Tauri webview? */
  readonly isNative: boolean;
  /** Open a URL in the system browser. */
  readonly openExternal: (url: string) => Promise<void>;
  /** Check whether an update is available. Returns null if none. */
  readonly checkUpdate: () => Promise<NativeUpdateInfo | null>;
  /** Download and install a pending update (restarts the app). */
  readonly installUpdate: () => Promise<void>;
  /** Write text to a file path (relative to app data dir). */
  readonly writeFile: (path: string, content: string) => Promise<void>;
  /** Read text from a file path (relative to app data dir). */
  readonly readFile: (path: string) => Promise<string | null>;
}
