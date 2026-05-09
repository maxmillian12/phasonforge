// Example "safe + CORS-correct" API endpoint demonstrating the patterns in
// `src/lib/api.ts`. Use this as a template for new endpoints (admin actions,
// form submissions, webhooks, etc.).
//
// Endpoint: POST /api/contact   — accepts a contact form submission
//           OPTIONS /api/contact — CORS preflight
//
// All responses include CORS headers, even errors.
import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  errorResponse,
  jsonResponse,
  parseJson,
  preflight,
  safeHandler,
  z,
} from "@/lib/api";

const ContactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1, "Message is required").max(2000),
  // Honeypot — bots fill it, humans don't.
  website: z.string().max(0).optional(),
});

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      OPTIONS: ({ request }) => preflight(request),

      POST: safeHandler(async (request) => {
        const parsed = await parseJson(request, ContactSchema);
        if (!parsed.ok) return parsed.response;

        // Honeypot rejection — return 200 so bots don't learn anything.
        if (parsed.data.website) {
          return jsonResponse({ ok: true }, { request });
        }

        const { name, email, phone, subject, message } = parsed.data;

        // Persist with the admin client (bypasses RLS for an insert-only table).
        // Make sure a `contact_messages` table exists with matching columns.
        const { error } = await supabaseAdmin
          .from("contact_messages")
          .insert({
            name,
            email,
            phone: phone || null,
            subject,
            message,
            user_agent: request.headers.get("user-agent") ?? null,
          });

        if (error) {
          console.error("[contact] insert failed:", error);
          return errorResponse("Could not submit your message right now.", {
            status: 502,
            code: "STORAGE_ERROR",
            request,
          });
        }

        return jsonResponse(
          { ok: true, message: "Thanks — we'll be in touch shortly." },
          { status: 201, request },
        );
      }),
    },
  },
});
