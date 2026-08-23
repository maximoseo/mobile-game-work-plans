import type { GamePlan } from "../data/plans";

// Genre-based sensible defaults for sections the source data doesn't carry.
// These are recommendations a bot can follow or override.
const GENRE_DEFAULTS: Record<
  string,
  { art: string; stack: string; mechanics: string; entities: string[] }
> = {
  Idle: {
    art: "Clean 2D, flat vector UI with juicy micro-animations; bright accent palette on dark surfaces; heavy use of tween/easing for satisfying taps.",
    stack: "React Native (TypeScript) + Reanimated, or Unity/C# for cross-platform; SQLite/local storage for offline progress.",
    mechanics: "Tap/click loop → earn currency → spend on upgrades → prestige/reset for multipliers. Tuning knobs: base income, upgrade cost curve (exponential), prestige multiplier.",
    entities: ["Player (currency, level, upgrades)", "Upgrade (id, cost, effect)", "PrestigeRun (multiplier, count)"],
  },
  Puzzle: {
    art: "Minimal 2D, high-contrast shapes, satisfying color pops on match; subtle particles on solve.",
    stack: "Unity/C# or Godot/GDScript; grid logic in pure code, no physics needed.",
    mechanics: "Board/grid interaction → match/merge/clear → score + level progression. Tuning: move limits, combo multipliers, level difficulty curve.",
    entities: ["Board (grid, cells)", "Piece (type, state)", "Level (layout, goals)", "Score (combo, stars)"],
  },
  Strategy: {
    art: "Isometric or top-down 2D, readable unit silhouettes, faction color-coding.",
    stack: "Unity/C# or Godot/GDScript; deterministic simulation for replayability.",
    mechanics: "Place/build → resource economy → unit combat → territory/objective control. Tuning: unit stats, resource rates, AI difficulty.",
    entities: ["Unit (stats, owner)", "Building (cost, output)", "Resource (type, amount)", "Map (tiles, ownership)"],
  },
  Roguelike: {
    art: "Pixel-art 2D, procedural tile variety, high readability for fast action.",
    stack: "Godot/GDScript or Unity/C#; seeded RNG for runs; JSON for item/room definitions.",
    mechanics: "Enter room → fight/collect → choose upgrade → die/retry with meta-progression. Tuning: enemy HP scaling, upgrade pool, run length.",
    entities: ["Player (hp, loadout)", "Room (type, enemies)", "Item (rarity, effect)", "Run (seed, floor)"],
  },
};

const FALLBACK = {
  art: "Mobile-first 2D, clean readable UI, consistent palette, subtle juice (tweens, particles, haptics).",
  stack: "Unity/C# or Godot/GDScript for cross-platform mobile; JSON/config-driven content.",
  mechanics: "Core loop → reward → progression → retention hook. Tuning knobs documented per feature.",
  entities: ["Player (state, progression)", "Session (run/level state)", "Config (tunable values)"],
};

function pickGenre(genre: string) {
  const g = genre.toLowerCase();
  if (g.includes("idle") || g.includes("clicker") || g.includes("tap")) return GENRE_DEFAULTS.Idle;
  if (g.includes("puzzle") || g.includes("match")) return GENRE_DEFAULTS.Puzzle;
  if (g.includes("strategy") || g.includes("tower") || g.includes("td")) return GENRE_DEFAULTS.Strategy;
  if (g.includes("rogue") || g.includes("roguelike")) return GENRE_DEFAULTS.Roguelike;
  return FALLBACK;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function buildFullPlanMd(plan: GamePlan): string {
  const d = pickGenre(plan.genre);
  const slug = slugify(plan.id || plan.title);
  const L: string[] = [];

  L.push(`# ${plan.title} — Full Build Plan`);
  L.push("");
  L.push(`**Genre:** ${plan.genre}`);
  L.push(`**Slug:** \`${slug}\``);
  L.push("");
  L.push(`> ${plan.coreGameplay}`);
  L.push("");

  L.push("## 1. Elevator Pitch");
  L.push("");
  L.push(`${plan.coreGameplay} Built for ${plan.audience}. Monetized via ${plan.monetization}.`);
  L.push("");

  L.push("## 2. Core Gameplay Loop");
  L.push("");
  L.push(`The minute-to-minute loop: ${plan.coreGameplay}`);
  L.push("");
  L.push("1. Player opens the game and is dropped into the core action within 10 seconds.");
  L.push("2. Player performs the primary interaction (see §9 Core Mechanics).");
  L.push("3. Immediate, satisfying feedback (score, currency, progression).");
  L.push("4. A short-term goal pulls the player to the next action.");
  L.push("5. A longer-term progression system (upgrades/levels) drives retention.");
  L.push("");

  L.push("## 3. Full Feature List");
  L.push("");
  for (const f of plan.features) {
    L.push(`- **${f}** — implement as a self-contained, testable module with clear input/output and a toggle to enable/disable.`);
  }
  L.push("");

  L.push("## 4. Target Audience & Platform");
  L.push("");
  L.push(`- **Audience:** ${plan.audience}`);
  L.push("- **Platform:** Mobile (iOS + Android), portrait-first, touch input.");
  L.push("- **Session length:** 2–5 minute sessions, resumable at any point.");
  L.push("");

  L.push("## 5. Monetization");
  L.push("");
  L.push(`${plan.monetization}. Implement as opt-in, non-intrusive, and never gating core gameplay.`);
  L.push("");

  L.push("## 6. Art & Visual Direction");
  L.push("");
  L.push(d.art);
  L.push("");

  L.push("## 7. Technical Stack");
  L.push("");
  L.push(d.stack);
  L.push("- Content/data is config-driven (JSON) so designers can tune without code changes.");
  L.push("- Target 60fps on mid-range devices; keep the bundle lean.");
  L.push("");

  L.push("## 8. Data Model / Entities");
  L.push("");
  for (const e of d.entities) {
    L.push(`- ${e}`);
  }
  L.push("");

  L.push("## 9. Core Mechanics Spec");
  L.push("");
  L.push(d.mechanics);
  L.push("");

  L.push("## 10. Controls & UX");
  L.push("");
  L.push("- **Input:** single-tap / tap-and-drag only (no virtual joystick unless required).");
  L.push("- **Onboarding:** 30-second interactive tutorial that teaches the core loop by doing.");
  L.push("- **Screens:** Splash → Tutorial → Main → (optional) Settings/Shop.");
  L.push("- **Accessibility:** scalable text, colorblind-safe palette, no time-pressure-only mechanics.");
  L.push("");

  L.push("## 11. Milestone Work Plan");
  L.push("");
  plan.workPlan.forEach((m, i) => {
    L.push(`### M${i + 1}. ${m.name} (${m.duration})`);
    if (m.dependencies) L.push(`_Depends on: ${m.dependencies}_`);
    L.push("");
    for (const t of m.tasks) {
      L.push(`- [ ] ${t}`);
    }
    L.push("");
  });

  L.push("## 12. MVP Scope vs. Stretch Goals");
  L.push("");
  L.push("**MVP (ship first):** the core loop + the first 2–3 features + one monetization touchpoint + basic onboarding.");
  L.push("");
  L.push("**Stretch:** remaining features, meta-progression depth, social/leaderboards, live-ops events.");
  L.push("");

  L.push("## 13. Success Metrics");
  L.push("");
  L.push("- D1 retention ≥ 40%, D7 ≥ 15%.");
  L.push("- Average session length ≥ 3 minutes.");
  L.push("- Tutorial completion ≥ 80%.");
  L.push("- Crash-free sessions ≥ 99.5%.");
  L.push("- (Optional) D30 ARPDAU positive vs. UA cost.");
  L.push("");

  L.push("---");
  L.push(`_Generated from the Mobile Game Work Plans dashboard. Adjust defaults to taste before handing to a build bot._`);
  L.push("");

  return L.join("\n");
}

export function downloadMarkdown(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadPlanMd(plan: GamePlan) {
  const filename = `${slugify(plan.id || plan.title)}-full-plan.md`;
  downloadMarkdown(filename, buildFullPlanMd(plan));
}
