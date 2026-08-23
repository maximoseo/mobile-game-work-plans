import type { GamePlan } from "../data/plans";

// Genre-based sensible defaults for sections the source data doesn't carry.
// These are recommendations a bot can follow or override.
const GENRE_DEFAULTS: Record<
  string,
  {
    art: string;
    stack: string;
    mechanics: string;
    entities: string[];
    summer: string[];
    ui: string[];
  }
> = {
  Idle: {
    art: "Clean 2D, flat vector UI with juicy micro-animations; bright accent palette on dark surfaces; heavy use of tween/easing for satisfying taps.",
    stack: "React Native (TypeScript) + Reanimated, or Unity/C# for cross-platform; SQLite/local storage for offline progress.",
    mechanics: "Tap/click loop → earn currency → spend on upgrades → prestige/reset for multipliers. Tuning knobs: base income, upgrade cost curve (exponential), prestige multiplier.",
    entities: ["Player (currency, level, upgrades)", "Upgrade (id, cost, effect)", "PrestigeRun (multiplier, count)"],
    summer: [
      "`Root` → `Game` (logic) → `UI` (HUD) → `Background` (parallax). UI-driven; minimal physics.",
      "Assets: tap button sprite, currency icons, upgrade icons, background art, 1–2 UI fonts, tap/coin SFX.",
      "Loop: create project → place `Game` + `UI` scenes → wire tap → run → inspect errors → tune income/upgrade curves → run again.",
      "MCP tools: create scene, place object, run project, read diagnostics, edit property (tuning knobs).",
    ],
    ui: ["Button", "Card", "Progress", "Dialog", "Sheet", "Toast", "Badge", "Tabs"],
  },
  Puzzle: {
    art: "Minimal 2D, high-contrast shapes, satisfying color pops on match; subtle particles on solve.",
    stack: "Unity/C# or Godot/GDScript; grid logic in pure code, no physics needed.",
    mechanics: "Board/grid interaction → match/merge/clear → score + level progression. Tuning: move limits, combo multipliers, level difficulty curve.",
    entities: ["Board (grid, cells)", "Piece (type, state)", "Level (layout, goals)", "Score (combo, stars)"],
    summer: [
      "`Root` → `Board` (grid) → `Piece` (instances) → `UI` (score/moves) → `FX` (particles).",
      "Assets: piece sprites (per type), board background, level thumbnails, solve/win SFX.",
      "Loop: create project → place `Board` → spawn `Piece` grid → run → inspect → tune move limits/combos → run again.",
      "MCP tools: create scene, place object, run project, read diagnostics, edit property.",
    ],
    ui: ["Card", "Progress", "Dialog", "Toast", "Badge", "Button"],
  },
  Strategy: {
    art: "Isometric or top-down 2D, readable unit silhouettes, faction color-coding.",
    stack: "Unity/C# or Godot/GDScript; deterministic simulation for replayability.",
    mechanics: "Place/build → resource economy → unit combat → territory/objective control. Tuning: unit stats, resource rates, AI difficulty.",
    entities: ["Unit (stats, owner)", "Building (cost, output)", "Resource (type, amount)", "Map (tiles, ownership)"],
    summer: [
      "`Root` → `Map` (tiles) → `Unit` (instances) → `Building` (instances) → `UI` (resources/minimap).",
      "Assets: unit sprites (per faction), building sprites, tile art, resource icons, combat SFX.",
      "Loop: create project → place `Map` → spawn units/buildings → run → inspect → tune unit stats/resource rates → run again.",
      "MCP tools: create scene, place object, run project, read diagnostics, edit property.",
    ],
    ui: ["Card", "Tabs", "Progress", "Tooltip", "Dialog", "Badge", "Button"],
  },
  Roguelike: {
    art: "Pixel-art 2D, procedural tile variety, high readability for fast action.",
    stack: "Godot/GDScript or Unity/C#; seeded RNG for runs; JSON for item/room definitions.",
    mechanics: "Enter room → fight/collect → choose upgrade → die/retry with meta-progression. Tuning: enemy HP scaling, upgrade pool, run length.",
    entities: ["Player (hp, loadout)", "Room (type, enemies)", "Item (rarity, effect)", "Run (seed, floor)"],
    summer: [
      "`Root` → `Player` → `Room` (procedural) → `Enemy` (instances) → `Item` (instances) → `UI` (hp/inventory).",
      "Assets: player sprite, enemy sprites, room tiles, item icons, hit/pickup SFX.",
      "Loop: create project → place `Player` + `Room` → spawn enemies/items → run → inspect → tune enemy HP/upgrade pool → run again.",
      "MCP tools: create scene, place object, run project, read diagnostics, edit property.",
    ],
    ui: ["Card", "Dialog", "Progress", "Badge", "Button", "Toast"],
  },
};

const FALLBACK = {
  art: "Mobile-first 2D, clean readable UI, consistent palette, subtle juice (tweens, particles, haptics).",
  stack: "Unity/C# or Godot/GDScript for cross-platform mobile; JSON/config-driven content.",
  mechanics: "Core loop → reward → progression → retention hook. Tuning knobs documented per feature.",
  entities: ["Player (state, progression)", "Session (run/level state)", "Config (tunable values)"],
  summer: [
    "`Root` → `Game` (logic) → `Entities` → `UI` (HUD) → `Background`.",
    "Assets: core sprites, icons, background, font, SFX.",
    "Loop: create project → place scenes → run → inspect errors → tune → run again.",
    "MCP tools: create scene, place object, run project, read diagnostics, edit property.",
  ],
  ui: ["Button", "Card", "Progress", "Dialog", "Toast", "Badge"],
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

  L.push("## 14. Summer Engine Build Guide");
  L.push("");
  L.push("> Target engine: **Summer Engine** — a desktop game engine the agent operates via its MCP (58 tools) + CLI. Free for MCP use.");
  L.push("");
  L.push("**Scene tree**");
  for (const line of d.summer) L.push(`- ${line}`);
  L.push("");
  L.push("**Toolchain**");
  L.push("- Install the `summer-engine` CLI; it signs you in and writes MCP config for Claude Code / Cursor / Codex.");
  L.push("- The agent then: create project → place scenes/objects → run → inspect diagnostics → iterate until the core loop is playable.");
  L.push("");

  L.push("## 15. 21st.dev UI Component Spec");
  L.push("");
  L.push("> UI layer: pull production-ready React/shadcn components from **21st.dev** (MCP 35 tools + Magic builder).");
  L.push("");
  L.push("**Components to pull**");
  for (const c of d.ui) L.push(`- ${c}`);
  L.push("");
  L.push("**How**");
  L.push("- Use the 21st MCP `get_component` (by id) or the Magic builder to fetch and insert each component.");
  L.push("- Keep the game's UI in a web/React layer (menus, HUD, settings, dialogs) rendered over the engine view.");
  L.push("");

  L.push("## 16. Engine Alternatives");
  L.push("");
  L.push("- **Godot (open-source):** if you prefer a fully open 2D/3D engine, this plan maps 1:1 to Godot/GDScript — the scene tree and entity model carry over directly; use Godot's built-in Control nodes for UI instead of 21st.dev React components.");
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
