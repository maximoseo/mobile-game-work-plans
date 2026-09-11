import { buildOpenApi } from "./_agent/openapi.js";
import { originOf } from "./_agent/rest.js";
import { APP, routes } from "./_agent/routes.js";

// Public (no key): the document holds no secrets and agents/n8n/Pipedream import it.
export function GET(req: Request): Response {
  return new Response(JSON.stringify(buildOpenApi(APP, routes, originOf(req, APP)), null, 2), {
    status: 200,
    headers: { "content-type": "application/json", "cache-control": "public, max-age=300", vary: "host, x-forwarded-host, x-forwarded-proto" },
  });
}
