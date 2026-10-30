import { describe, expect, it } from "vitest";
import { buildOpenApi } from "../api/_agent/openapi.ts";
import { computeOverviewStatus, freshnessItem, overviewRoute, summarizePlans } from "../api/_agent/overview.ts";
import { APP, routes } from "../api/_agent/routes.ts";
import type { Db } from "../api/_agent/entities.ts";

describe("native plans overview contract", () => {
  it("publishes a marked overview operation without adding an entity or write", () => {
    const doc = buildOpenApi(APP, routes, "https://example.test") as {
      paths: Record<string, Record<string, Record<string, unknown>>>;
    };
    expect(doc.paths["/overview"].get["x-native-kind"]).toBe("overview");
    expect(doc.paths["/overview"].get.operationId).toBe("overview");
    expect(doc.paths["/overview"].get["x-write"]).toBe(false);
    expect(routes.filter((route) => route.path === "/overview")).toHaveLength(1);
  });

  it("computes freshness from producer timestamps, not fetch time", () => {
    const now = Date.parse("2026-10-30T15:00:00Z");
    const fresh = freshnessItem("2026-10-03T14:58:38Z", now);
    expect(fresh.latest_at).toBe("2026-10-03T14:58:38Z");
    expect(fresh.age_seconds).toBeGreaterThan(0);
    expect(fresh.stale).toBe(false);
    expect(freshnessItem(null, now)).toMatchObject({ latest_at: null, age_seconds: null, stale: true });
    expect(freshnessItem("2026-01-01T00:00:00Z", now).stale).toBe(true);
  });

  it("distinguishes live, empty, stale, partial and unavailable aggregates", () => {
    const now = Date.parse("2026-10-30T15:00:00Z");
    const fresh = [freshnessItem("2026-10-03T14:58:38Z", now)];
    expect(computeOverviewStatus({ total: 27, freshness: fresh, truncated: false })).toBe("live");
    expect(computeOverviewStatus({ total: 0, freshness: [freshnessItem(null, now)], truncated: false })).toBe("empty");
    expect(computeOverviewStatus({ total: 27, freshness: [freshnessItem(null, now)], truncated: false })).toBe("stale");
    expect(computeOverviewStatus({ total: 27, freshness: fresh, truncated: true })).toBe("partial");
    expect(computeOverviewStatus({ total: null, freshness: [freshnessItem(null, now)], truncated: false })).toBe("unavailable");
  });

  it("summarizes natural plan rows and keeps malformed values honest", () => {
    const now = Date.parse("2026-10-30T15:00:00Z");
    const result = summarizePlans([
      { id: "a", title: "Alpha", genre: "Puzzle", priority_rank: 2, work_plan: [{ tasks: ["one", "two"] }], updated_at: "2026-10-03T14:58:38Z" },
      { id: "b", title: "Beta", genre: "Puzzle", priority_rank: null, work_plan: "corrupt", created_at: "2026-10-02T00:00:00Z" },
    ], 2, now, false);
    expect(result.status).toBe("live");
    expect(result.counts).toEqual({ plans: 2, genres: 1, ranked: 1, milestones: 1, tasks: 2 });
    expect(result.attention).toEqual([
      { kind: "plans_missing_priority", count: 1, entity: "plans" },
      { kind: "plans_missing_work_plan", count: 1, entity: "plans" },
    ]);
    expect(result.build_order).toEqual([{ id: "a", title: "Alpha", rank: 2, genre: "Puzzle" }]);
  });

  it("marks the aggregate partial when PostgREST returns fewer rows than the authoritative count", async () => {
    const row = { id: "a", title: "Alpha", genre: "Puzzle", priority_rank: 1, work_plan: [{ tasks: ["one"] }], updated_at: "2026-10-03T14:58:38Z" };
    const query = {
      select: () => query,
      limit: () => Promise.resolve({ data: [row], error: null, count: 2 }),
    };
    const db = () => ({ from: () => query }) as unknown as Db;
    const result = await overviewRoute(db).handler({}, { keyId: "test", surface: "rest", origin: "https://example.test" }) as any;
    expect(result.status).toBe("partial");
    expect(result.counts.plans).toBe(2);
    expect(result.truncated_sources).toEqual(["plans"]);
    expect(result.attention).toContainEqual({ kind: "overview_aggregate_truncated", count: null, entity: "plans" });
  });

  it("serves the aggregate through the authenticated route handler", async () => {
    const row = { id: "a", title: "Alpha", genre: "Puzzle", priority_rank: 1, work_plan: [{ tasks: ["one"] }], updated_at: "2026-10-03T14:58:38Z" };
    const query = {
      select: () => query,
      limit: () => Promise.resolve({ data: [row], error: null, count: 1 }),
    };
    const db = () => ({ from: (table: string) => {
      expect(table).toBe("mgwp_plans");
      return query;
    } }) as unknown as Db;
    const result = await overviewRoute(db).handler({}, { keyId: "test", surface: "rest", origin: "https://example.test" }) as Record<string, unknown>;
    expect(result.contract_version).toBe(1);
    expect(result.counts).toMatchObject({ plans: 1, ranked: 1, tasks: 1 });
    expect(result.freshness).toEqual(expect.any(Array));
    expect(result.attention).toEqual([]);
  });
});
