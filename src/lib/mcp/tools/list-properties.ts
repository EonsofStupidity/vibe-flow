import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

/**
 * Lists the three DevPULSE Labs properties hosted in the shell.
 *
 * @remarks
 * Read-only reference tool so remote clients (Claude, Codex, ChatGPT) can
 * discover what workspaces the shell manages before calling more specific
 * tools. Static content — no I/O, no env reads.
 *
 * @returns MCP content with a JSON list of `{ id, name, description }`.
 * @public
 */
export default defineTool({
  name: "list_properties",
  title: "List DevPULSE properties",
  description:
    "List the DevPULSE Labs properties (News, AngryVibes, EoS) hosted in this local shell.",
  inputSchema: {},
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: () => {
    const properties = [
      {
        id: "news",
        name: "DevPULSE News",
        description:
          "Dynamic news show co-hosted with Clyffy, powered by a GB10 cluster.",
      },
      {
        id: "angryvibes",
        name: "AngryVibes",
        description: "Episodic show.",
      },
      {
        id: "eos",
        name: "Eons of Stupidity",
        description:
          "Lessons and presentations leveraging a large touchscreen as a major prop.",
      },
    ];
    return {
      content: [{ type: "text", text: JSON.stringify(properties, null, 2) }],
      structuredContent: { properties },
    };
  },
});
