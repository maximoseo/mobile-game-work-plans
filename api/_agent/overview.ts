import type { Db } from "./entities.js";
import { RouteError, type Route } from "./types.js";

/** Versioned native Overview for the curated game-plan catalog. */
export type OverviewStatus = "live" | "stale" | "partial" | "unavailable" | "empty";
export type FreshnessItem = {
  source: "plans";
  latest_at: string | null;
  age_seconds: number | null;
  stale: boolean;
  threshold_seconds: number;
};
type Row = Record<string, unknown>;

const MAX_ROWS = 5000;
const STALE_THRESHOLD_SECONDS = 90 * 24 * 3600;

export function freshnessItem(latestAt: string | null, nowMs: number): FreshnessItem {
  if (!latestAt || !Number.isFinite(Date.parse(latestAt))) {
    return { source: "plans", latest_at: null, age_seconds: null, stale: true, threshold_seconds: STALE_THRESHOLD_SECONDS };
  }
  const age = Math.max(0, Math.round((nowMs - Date.parse(latestAt)) / 1000));
  return { source: "plans", latest_at: latestAt, age_seconds: age, stale: age > STALE_THRESHOLD_SECONDS, threshold_seconds: STALE_THRESHOLD_SECONDS };
}

export function computeOverviewStatus(input: { total: number | null; freshness: FreshnessItem[]; truncated: boolean }): OverviewStatus {
  if (input.total === null) return "unavailable";
  if (input.total === 0) return "empty";
  if (input.truncated) return "partial";
  if (input.freshness.some((item) => item.stale)) return "stale";
  return "live";
}

export function summarizePlans(rows: Row[], total: number | null, nowMs: number, truncated: boolean) {
  const genres = new Set<string>();
  const buildOrder: { id: string; title: string; rank: number; genre: string | null }[] = [];
  let milestones = 0;
  let tasks = 0;
  let missingPriority = 0;
  let missingWorkPlan = 0;
  let latestAt: string | null = null;
  let latestMs = Number.NEGATIVE_INFINITY;

  for (const row of rows) {
    const genre = typeof row.genre === "string" && row.genre.trim() ? row.genre : null;
    if (genre) genres.add(genre);
    const rank = row.priority_rank === null || row.priority_rank === undefined || row.priority_rank === "" ? Number.NaN : Number(row.priority_rank);
    if (Number.isFinite(rank) && rank >= 0) {
      buildOrder.push({ id: String(row.id ?? ""), title: String(row.title ?? "Untitled plan"), rank, genre });
    } else {
      missingPriority += 1;
    }
    const validMilestones = Array.isArray(row.work_plan)
      ? row.work_plan.filter((milestone): milestone is Row => Boolean(milestone) && typeof milestone === "object" && !Array.isArray(milestone)
        && Array.isArray((milestone as Row).tasks) && ((milestone as Row).tasks as unknown[]).some((task) => typeof task === "string" && task.trim().length > 0))
      : [];
    if (validMilestones.length > 0) {
      milestones += validMilestones.length;
      for (const milestone of validMilestones) {
        tasks += (milestone.tasks as unknown[]).filter((task) => typeof task === "string" && task.trim().length > 0).length;
      }
    } else {
      missingWorkPlan += 1;
    }
    for (const key of ["updated_at", "created_at"]) {
      const value = row[key];
      if (typeof value !== "string") continue;
      const parsed = Date.parse(value);
      if (Number.isFinite(parsed) && parsed > latestMs) {
        latestMs = parsed;
        latestAt = value;
      }
    }
  }

  buildOrder.sort((a, b) => a.rank - b.rank || a.title.localeCompare(b.title));
  const freshness = [freshnessItem(latestAt, nowMs)];
  const status = computeOverviewStatus({ total, freshness, truncated });
  const attention = [
    { kind: "plans_missing_priority", count: missingPriority, entity: "plans" },
    { kind: "plans_missing_work_plan", count: missingWorkPlan, entity: "plans" },
    ...(freshness.some((item) => item.stale) ? [{ kind: "plans_catalog_stale", count: total, entity: "plans" }] : []),
    ...(truncated ? [{ kind: "overview_aggregate_truncated", count: null, entity: "plans" }] : []),
  ].filter((item) => item.count === null || (typeof item.count === "number" && item.count > 0));

  return {
    contract_version: 1,
    generated_at: new Date(nowMs).toISOString(),
    status,
    counts: { plans: total, genres: genres.size, ranked: buildOrder.length, milestones, tasks },
    freshness,
    attention,
    genres: [...genres].sort((a, b) => a.localeCompare(b)),
    build_order: buildOrder,
    truncated_sources: truncated ? ["plans"] : [],
  };
}

export function overviewRoute(db: () => Db): Route {
  return {
    name: "overview",
    method: "GET",
    path: "/overview",
    summary: "Native game-plan catalog overview: status, counts, freshness, attention and build order (contract_version 1).",
    nativeKind: "overview",
    input: { type: "object", properties: {}, additionalProperties: false },
    handler: async () => {
      const { data, error, count } = await db().from("mgwp_plans")
        .select("id,title,genre,work_plan,priority_rank,created_at,updated_at", { count: "exact" })
        .limit(MAX_ROWS + 1);
      if (error) throw new RouteError(502, "upstream_error", error.message);
      const rows = ((data as Row[] | null) ?? []);
      const total = typeof count === "number" ? count : null;
      const truncated = rows.length > MAX_ROWS || (total !== null && total > Math.min(rows.length, MAX_ROWS));
      return summarizePlans(rows.slice(0, MAX_ROWS), total, Date.now(), truncated);
    },
  };
}
