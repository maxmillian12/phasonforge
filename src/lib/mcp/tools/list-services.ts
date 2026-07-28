import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { SERVICES } from "@/lib/content";

export default defineTool({
  name: "list_services",
  title: "List services",
  description:
    "List the engineering and supply services offered by Phason Engineering Works Limited, optionally filtered by category.",
  inputSchema: {
    category: z
      .enum(["Engineering", "Supply"])
      .optional()
      .describe("Optional category filter."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ category }) => {
    const services = SERVICES.filter((s) => !category || s.category === category).map(
      ({ slug, title, category: cat, short, features }) => ({
        slug,
        title,
        category: cat,
        summary: short,
        features,
      }),
    );

    return {
      content: [{ type: "text", text: JSON.stringify(services, null, 2) }],
      structuredContent: { services },
    };
  },
});
