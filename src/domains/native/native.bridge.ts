/**
 * NativeBridge — resolves Tauri APIs to real or browser-fallback
 * implementations at runtime.
 *
 * @remarks
 * All other app code calls NativeBridge. No module outside this file
 * imports from `@tauri-apps/api` directly. This keeps tree-shaking clean
 * and makes the app safe to render in a regular browser for dev/preview.
 *
 * Detection: Tauri injects `window.__TAURI_INTERNALS__` before the app
 * script runs, so `isNative` is synchronously reliable.
 */
import type { NativeCapabilities, NativeUpdateInfo } from "./native.types";

function isTauri(): boolean {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

async function buildTauriBridge(): Promise<NativeCapabilities> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const load = (id: string): Promise<any> => import(/* @vite-ignore */ id);
  const [shellMod, updaterMod, fsMod] = await Promise.all([
    load("@tauri-apps/plugin-shell"),
    load("@tauri-apps/plugin-updater"),
    load("@tauri-apps/plugin-fs"),
  ]);

  const { open } = shellMod;
  const { check } = updaterMod;
  const { writeTextFile, readTextFile, BaseDirectory } = fsMod;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let pendingUpdate: any = null;

  return {
    isNative: true,
    openExternal: (url) => open(url),
    checkUpdate: async (): Promise<NativeUpdateInfo | null> => {
      const update = await check();
      if (!update?.available) return null;
      pendingUpdate = update;
      return { version: update.version, body: update.body ?? null };
    },
    installUpdate: async () => {
      if (pendingUpdate) {
        await pendingUpdate.downloadAndInstall();
      }
    },
    writeFile: (path, content) =>
      writeTextFile(path, content, { baseDir: BaseDirectory.AppData }),
    readFile: async (path) => {
      try {
        return await readTextFile(path, { baseDir: BaseDirectory.AppData });
      } catch {
        return null;
      }
    },
  };
}

function buildBrowserBridge(): NativeCapabilities {
  return {
    isNative: false,
    openExternal: async (url) => { window.open(url, "_blank", "noopener,noreferrer"); },
    checkUpdate: async () => null,
    installUpdate: async () => {},
    writeFile: async () => {},
    readFile: async () => null,
  };
}

let _bridge: NativeCapabilities | null = null;
let _initPromise: Promise<NativeCapabilities> | null = null;

async function init(): Promise<NativeCapabilities> {
  if (_bridge) return _bridge;
  if (_initPromise) return _initPromise;
  _initPromise = (async () => {
    if (isTauri()) {
      _bridge = await buildTauriBridge();
    } else {
      _bridge = buildBrowserBridge();
    }
    return _bridge;
  })();
  return _initPromise;
}

init().catch(() => {
  _bridge = buildBrowserBridge();
});

export const NativeBridge = {
  /** Synchronously true when running inside Tauri. */
  get isNative(): boolean { return isTauri(); },

  async openExternal(url: string): Promise<void> {
    return (await init()).openExternal(url);
  },
  async checkUpdate(): Promise<NativeUpdateInfo | null> {
    return (await init()).checkUpdate();
  },
  async installUpdate(): Promise<void> {
    return (await init()).installUpdate();
  },
  async writeFile(path: string, content: string): Promise<void> {
    return (await init()).writeFile(path, content);
  },
  async readFile(path: string): Promise<string | null> {
    return (await init()).readFile(path);
  },
};
