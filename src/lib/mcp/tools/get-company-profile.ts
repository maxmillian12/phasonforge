import { defineTool } from "@lovable.dev/mcp-js";
import { EQUIPMENT, FAQS, PERSONNEL, STATS, VALUES } from "@/lib/content";
import { SITE } from "@/lib/site";

export default defineTool({
  name: "get_company_profile",
  title: "Get company profile",
  description:
    "Get the public company profile for Phason Engineering Works Limited: contact details, core values, key statistics, personnel and equipment capacity, and frequently asked questions.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const profile = {
      company: SITE,
      stats: STATS,
      values: VALUES,
      personnel: PERSONNEL.map(([role, count]) => ({ role, count })),
      equipment: EQUIPMENT.map(([item, count]) => ({ item, count })),
      faqs: FAQS.map(({ q, a }) => ({ question: q, answer: a })),
    };

    return {
      content: [{ type: "text", text: JSON.stringify(profile, null, 2) }],
      structuredContent: profile,
    };
  },
});
