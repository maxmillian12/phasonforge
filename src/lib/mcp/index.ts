import { defineMcp } from "@lovable.dev/mcp-js";
import listServices from "./tools/list-services";
import listProjects from "./tools/list-projects";
import listBlogPosts from "./tools/list-blog-posts";
import getCompanyProfile from "./tools/get-company-profile";

export default defineMcp({
  name: "phason-engineering-mcp",
  title: "Phason Engineering Works",
  version: "0.1.0",
  instructions:
    "Public tools for Phason Engineering Works Limited, a civil, electrical and building contractor in Dar es Salaam, Tanzania. Use `get_company_profile` for contact details, capacity and FAQs; `list_services` for service offerings; `list_projects` for the portfolio; and `list_blog_posts` for published insight articles. All data is read-only public marketing content.",
  tools: [getCompanyProfile, listServices, listProjects, listBlogPosts],
});
