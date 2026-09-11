import { entityRoutes } from "./entities.js";
import { postgrestDb } from "./postgrest.js";
import { RouteError } from "./types.js";
import type { AppInfo, Route } from "./types.js";

/**
 * THE route table for Mobile Game Work Plans. REST (/api/v1), OpenAPI
 * (/api/openapi.json) and MCP (/api/mcp) are generated from this list.
 *
 * Read-only over the same Supabase access the SPA uses (anon key): the
 * game work plans (title, genre, gameplay, features, audience,
 * monetization, work plan, priority).
 */
export const APP: AppInfo = {
  id: "mobile-game-work-plans",
  name: "Mobile Game Work Plans",
  hosts: ["mobile-game-work-plans.maximo-seo.ai"],
  description: "Mobile game concepts and their work plans, ranked by priority.",
};

// same env the SPA is built with; unset → explicit 503 instead of a relative URL reaching fetch
const need = (name: string) => {
  const v = process.env[name] ?? "";
  if (!v) throw new RouteError(503, "not_configured", `${name} is not set`);
  return v;
};
// mgwp_plans is RLS-limited to authenticated users (the UI reads as a signed-in user); the surface reads
// server-side with the service role, never the anon key (anon sees 0 rows)
const db = () => postgrestDb(() => need("VITE_SUPABASE_URL"), () => need("SUPABASE_SERVICE_ROLE_KEY"));

export const routes: Route[] = [
  ...entityRoutes(db, { entity: "plans", table: "mgwp_plans", summary: "game work plans (title, genre, core gameplay, features, audience, monetization, work plan, priority rank)", orderBy: "priority_rank", ascending: true, searchColumns: ["title", "genre", "core_gameplay"], filters: ["genre"], groupBy: ["genre"] }),
];
