import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { PROJECTS } from "@/lib/content";

export default defineTool({
  name: "list_projects",
  title: "List projects",
  description:
    "List completed and ongoing projects in the Phason Engineering portfolio, optionally filtered by category or year.",
  inputSchema: {
    category: z.string().optional().describe("Optional category filter, e.g. Roads, Buildings, Water, Civil."),
    year: z.number().int().optional().describe("Optional year filter."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ category, year }) => {
    const projects = PROJECTS.filter(
      (p) =>
        (!category || p.category.toLowerCase() === category.toLowerCase()) &&
        (!year || p.year === year),
    ).map(({ slug, title, category: cat, location, year: y, description }) => ({
      slug,
      title,
      category: cat,
      location,
      year: y,
      description,
    }));

    return {
      content: [{ type: "text", text: JSON.stringify(projects, null, 2) }],
      structuredContent: { projects },
    };
  },
});
