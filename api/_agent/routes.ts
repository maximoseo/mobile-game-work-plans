import { entityRoutes } from "./entities.js";
import { postgrestDb } from "./postgrest.js";
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

const db = () => postgrestDb(() => process.env.VITE_SUPABASE_URL ?? "", () => process.env.VITE_SUPABASE_ANON_KEY ?? "");

export const routes: Route[] = [
  ...entityRoutes(db, { entity: "plans", table: "mgwp_plans", summary: "game work plans (title, genre, core gameplay, features, audience, monetization, work plan, priority rank)", orderBy: "priority_rank", ascending: true, searchColumns: ["title", "genre", "core_gameplay"], filters: ["genre"], groupBy: ["genre"] }),
];
