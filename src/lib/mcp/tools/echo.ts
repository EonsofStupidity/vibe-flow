import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

/**
 * Echoes input text back to the caller.
 *
 * @remarks
 * Connectivity probe for remote MCP clients (Claude, Codex). Pure, no I/O.
 * @public
 */
export default defineTool({
  name: "echo",
  title: "Echo",
  description: "Echo the input text back to the caller. Useful for connectivity checks.",
  inputSchema: { text: z.string().min(1).describe("Text to echo back.") },
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: ({ text }) => ({ content: [{ type: "text", text }] }),
});
