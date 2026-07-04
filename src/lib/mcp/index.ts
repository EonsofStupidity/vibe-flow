import { defineMcp } from "@lovable.dev/mcp-js";
import echoTool from "./tools/echo";
import listPropertiesTool from "./tools/list-properties";

/**
 * DevPULSE Labs MCP server definition.
 *
 * @remarks
 * Exposes the local shell to remote MCP clients (Claude, Codex, ChatGPT).
 * No auth: the app is local-only per project scope. Keep this entry
 * import-safe — no env reads, I/O, or throws at module top level.
 *
 * @public
 */
export default defineMcp({
  name: "devpulse-labs-mcp",
  title: "DevPULSE Labs",
  version: "0.1.0",
  instructions:
    "Tools for the DevPULSE Labs shell. Use `list_properties` to discover News, AngryVibes, and EoS. Use `echo` to verify connectivity.",
  tools: [echoTool, listPropertiesTool],
});
