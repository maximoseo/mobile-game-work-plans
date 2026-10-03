import { describe, expect, it } from "vitest";
import { gamePlans } from "./plans";
import {
  ENGINES,
  ENGINE_IDS,
  ENGINE_RULES,
  PLAN_ENGINE_CHOICE,
  engineChoiceByGenre,
  engineChoiceFor,
  engineSectionLines,
} from "./engines";

describe("engine catalog", () => {
  it("describes every engine id with licence, connect, gate and runbook", () => {
    for (const id of ENGINE_IDS) {
      const e = ENGINES[id];
      expect(e.id).toBe(id);
      expect(e.version.length, `${id}.version`).toBeGreaterThanOrEqual(3); // "5.8" is the shortest
      for (const k of ["name", "licence", "bestAt", "connect", "gate", "runbook"] as const) {
        expect(e[k].length, `${id}.${k}`).toBeGreaterThan(3);
      }
      expect(e.runbook).toMatch(/^https:\/\//);
    }
  });

  it("keeps Unreal documented but not installed, and Unity behind the owner's licence step", () => {
    expect(ENGINES.unreal.connect).toMatch(/Not installed/);
    expect(ENGINES.unity.gate).toMatch(/Unity ID|service account/);
    expect(ENGINES.godot.gate).toBe("none");
    expect(ENGINES.defold.gate).toBe("none");
  });
});

describe("per-plan engine choice", () => {
  it("covers all 27 static plans by id, with primary ≠ runner-up and a reason", () => {
    expect(gamePlans).toHaveLength(27);
    for (const p of gamePlans) {
      const c = PLAN_ENGINE_CHOICE[p.id];
      expect(c, p.id).toBeDefined();
      expect(ENGINE_IDS).toContain(c.primary);
      expect(ENGINE_IDS).toContain(c.runnerUp);
      expect(c.primary).not.toBe(c.runnerUp);
      expect(c.reason.length).toBeGreaterThan(20);
      expect(c.primary, `${p.id} must never recommend Unreal`).not.toBe("unreal");
    }
  });

  it("follows the fleet rules: Godot default, Defold for casual web-first, Web for narrative and idle", () => {
    expect(engineChoiceFor({ id: "lost-signal", genre: "Mystery / narrative" }).primary).toBe("web");
    expect(engineChoiceFor({ id: "idle-archaeologist", genre: "Idle / incremental" }).primary).toBe("web");
    expect(engineChoiceFor({ id: "cloud-shepherd", genre: "Casual / puzzle" }).primary).toBe("defold");
    expect(engineChoiceFor({ id: "one-tap-time-heist", genre: "Puzzle / strategy / adventure" }).primary).toBe("godot");
    const godotCount = gamePlans.filter((p) => engineChoiceFor(p).primary === "godot").length;
    expect(godotCount).toBeGreaterThanOrEqual(10);
  });

  it("falls back by genre for plans that are not in the map (rows added later)", () => {
    expect(engineChoiceFor({ id: "brand-new-row", genre: "Idle / clicker" }).primary).toBe("web");
    expect(engineChoiceFor({ id: "brand-new-row", genre: "Casual / puzzle" }).primary).toBe("defold");
    expect(engineChoiceFor({ id: "brand-new-row", genre: "3D racing" }).primary).toBe("unity");
    expect(engineChoiceFor({ id: "brand-new-row", genre: "Tower defense" }).primary).toBe("godot");
    expect(engineChoiceByGenre("").primary).toBe("godot");
    expect(engineChoiceByGenre("Contextual puzzle").primary, "'context' is not 'text'").toBe("godot");
    expect(engineChoiceByGenre("3D narrative adventure").primary, "3D outranks the content-style rules").toBe("unity");
    expect(engineChoiceByGenre("casual puzzle-ish").primary, "hyphenated terms stay one token").toBe("godot");
    expect(engineChoiceFor({ id: "constructor", genre: "Casual / puzzle" }).primary, "inherited keys never resolve").toBe("defold");
    expect(engineChoiceFor({ id: "toString", genre: "Tower defense" }).primary).toBe("godot");
  });
});

describe("engine section", () => {
  it("leads with the new-game rule and names the recommendation by default", () => {
    const lines = engineSectionLines({ id: "lost-signal", genre: "Mystery / narrative" });
    expect(lines[0]).toBe("## 16. Engine choice");
    expect(lines.join("\n")).toContain("**Mode: new game.**");
    expect(lines.join("\n")).toContain("**Recommended:** Web (Three.js / Phaser + WebView APK)");
    expect(lines.join("\n")).toContain("**Runner-up:** Godot");
    for (const id of ENGINE_IDS) expect(lines.join("\n")).toContain(`**${ENGINES[id].name} ${ENGINES[id].version}**`);
    expect(lines.join("\n")).not.toMatch(/\.\. Runbook:/); // no double period after a gate that already ends with one
  });

  it("flips to the stay-in-engine rule for an existing game", () => {
    const text = engineSectionLines({ id: "swipe-knight", genre: "Action roguelike" }, { existingGame: true }).join("\n");
    expect(text).toContain("**Mode: adding elements to an existing game.**");
    expect(text).toContain(ENGINE_RULES.existingGame);
    expect(text).toContain("zip-rush (Godot 4.4");
    expect(text).not.toContain("**Mode: new game.**");
  });
});
