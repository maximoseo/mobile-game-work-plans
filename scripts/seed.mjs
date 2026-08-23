// Seed mgwp_plans from the canonical plans.ts data.
// Run: node scripts/seed.mjs   (reads BRAIN Supabase creds from env)
import { gamePlans, priorityList } from "../src/data/plans.ts";

const URL = process.env.BRAIN_SUPABASE_URL;
const SRK = process.env.BRAIN_SUPABASE_SERVICE_ROLE_KEY;

if (!URL || !SRK) {
  console.error("Missing BRAIN_SUPABASE_URL / BRAIN_SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const priorityByTitle = new Map(priorityList.map((p) => [p.title, p.rank]));

const rows = gamePlans.map((p) => ({
  id: p.id,
  title: p.title,
  genre: p.genre,
  core_gameplay: p.coreGameplay,
  features: p.features,
  audience: p.audience,
  monetization: p.monetization,
  work_plan: p.workPlan,
  priority_rank: priorityByTitle.get(p.title) ?? null,
}));

const res = await fetch(`${URL}/rest/v1/mgwp_plans?on_conflict=id`, {
  method: "POST",
  headers: {
    apikey: SRK,
    Authorization: `Bearer ${SRK}`,
    "Content-Type": "application/json",
    Prefer: "resolution=merge-duplicates",
  },
  body: JSON.stringify(rows),
});

const text = await res.text();
console.log("seed status:", res.status);
console.log(text.slice(0, 400));
console.log("rows seeded:", rows.length);
