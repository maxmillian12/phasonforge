import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { POSTS } from "@/lib/content";

export default defineTool({
  name: "list_blog_posts",
  title: "List blog posts",
  description:
    "List published insight articles from the Phason Engineering blog, newest first. Use `full: true` to include the article body.",
  inputSchema: {
    slug: z.string().optional().describe("Return only the post with this slug."),
    full: z.boolean().optional().describe("Include full article body text."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ slug, full }) => {
    const posts = (POSTS as ReadonlyArray<Record<string, unknown>>)
      .filter((p) => !slug || p.slug === slug)
      .map((p) => ({
        slug: p.slug,
        title: p.title,
        date: p.date,
        excerpt: p.excerpt,
        ...(full ? { body: p.body ?? p.content ?? null } : {}),
      }));

    return {
      content: [{ type: "text", text: JSON.stringify(posts, null, 2) }],
      structuredContent: { posts },
    };
  },
});
