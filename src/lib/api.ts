// Reusable CORS + safe response helpers for server routes (Netlify Functions
// and TanStack Start SSR). Import from `@/lib/api` in any `src/routes/api/*`
// handler so every endpoint behaves consistently in production.

import { z, type ZodSchema, type ZodError } from "zod";

// ---------- CORS ----------

// Origin allow-list. Add your production + preview domains here.
// `*` works for fully public, credential-less endpoints; if you ever need
// `Access-Control-Allow-Credentials: true`, switch to an explicit list.
const ALLOWED_ORIGINS = new Set<string>([
  "https://phasonforge.lovable.app",
  "https://phasonforge.netlify.app",
  "http://localhost:8080",
  "http://localhost:3000",
]);

const ALLOWED_METHODS = "GET, POST, PUT, PATCH, DELETE, OPTIONS";
const ALLOWED_HEADERS =
  "Content-Type, Authorization, X-Requested-With, Accept, Origin";

function resolveOrigin(request: Request): string {
  const origin = request.headers.get("origin");
  if (origin && ALLOWED_ORIGINS.has(origin)) return origin;
  // Safe default for non-credentialed APIs.
  return "*";
}

export function corsHeaders(request: Request): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": resolveOrigin(request),
    "Access-Control-Allow-Methods": ALLOWED_METHODS,
    "Access-Control-Allow-Headers": ALLOWED_HEADERS,
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

export function preflight(request: Request): Response {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

// ---------- Safe JSON responses ----------

export function jsonResponse(
  body: unknown,
  init: { status?: number; request: Request; headers?: Record<string, string> },
): Response {
  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...corsHeaders(init.request),
      ...(init.headers ?? {}),
    },
  });
}

export function errorResponse(
  message: string,
  init: {
    status: number;
    request: Request;
    code?: string;
    details?: unknown;
  },
): Response {
  return jsonResponse(
    {
      error: { message, code: init.code ?? "ERROR", details: init.details },
    },
    { status: init.status, request: init.request },
  );
}

// ---------- Safe input parsing ----------

const MAX_BODY_BYTES = 100 * 1024; // 100 KB

export async function parseJson<T>(
  request: Request,
  schema: ZodSchema<T>,
): Promise<{ ok: true; data: T } | { ok: false; response: Response }> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return {
      ok: false,
      response: errorResponse("Expected application/json body", {
        status: 415,
        code: "UNSUPPORTED_MEDIA_TYPE",
        request,
      }),
    };
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return {
      ok: false,
      response: errorResponse("Could not read request body", {
        status: 400,
        code: "INVALID_BODY",
        request,
      }),
    };
  }

  if (raw.length > MAX_BODY_BYTES) {
    return {
      ok: false,
      response: errorResponse("Request body too large", {
        status: 413,
        code: "PAYLOAD_TOO_LARGE",
        request,
      }),
    };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {
      ok: false,
      response: errorResponse("Body is not valid JSON", {
        status: 400,
        code: "INVALID_JSON",
        request,
      }),
    };
  }

  const result = schema.safeParse(parsed);
  if (!result.success) {
    return {
      ok: false,
      response: errorResponse("Validation failed", {
        status: 400,
        code: "VALIDATION_ERROR",
        request,
        details: flattenZodError(result.error),
      }),
    };
  }

  return { ok: true, data: result.data };
}

function flattenZodError(error: ZodError) {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
}

// ---------- Wrapper for safe handlers ----------

type Handler = (request: Request) => Promise<Response> | Response;

/**
 * Wrap a handler so that any uncaught error becomes a CORS-aware 500
 * (instead of leaking a stack trace or breaking CORS on the client).
 */
export function safeHandler(handler: Handler): Handler {
  return async (request: Request) => {
    try {
      return await handler(request);
    } catch (error) {
      console.error("[api] unhandled error:", error);
      return errorResponse("Internal server error", {
        status: 500,
        code: "INTERNAL_ERROR",
        request,
      });
    }
  };
}

// Re-export zod for convenience in route files.
export { z };
