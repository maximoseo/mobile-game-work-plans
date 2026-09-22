import type { GamePlan } from "./plans";

/**
 * Engine choice for the generated plans (2026-09-22, plan game-engines-deep-improve-2026-09-22).
 * Facts here were read live from the engines' licence pages and the fleet build box on 2026-09-22;
 * the source-of-truth document is /root/docs/ops/game-engines/engine-guide-2026-09-22.md on the fleet box.
 */

export const ENGINE_IDS = ["godot", "defold", "web", "unity", "unreal"] as const;
export type EngineId = (typeof ENGINE_IDS)[number];

export interface EngineInfo {
  id: EngineId;
  name: string;
  /** short label for badges */
  short: string;
  version: string;
  licence: string;
  bestAt: string;
  connect: string;
  gate: string;
  runbook: string;
}

export const ENGINES: Record<EngineId, EngineInfo> = {
  godot: {
    id: "godot",
    name: "Godot",
    short: "Godot",
    version: "4.7.2 (MIT)",
    licence: "MIT — free, no royalties, no account.",
    bestAt: "2D and light-3D mobile games, tycoon/management UI, fast GDScript iteration; the fleet default.",
    connect:
      "Installed on the fleet build box: `godot --headless --editor --quit` (import) → `godot --headless --export-release \"Android\" build/game.aab` or `\"Web\" build/web/index.html`; MCP `godot-mcp` (headless run/export/debug).",
    gate: "none",
    runbook: "https://docs.godotengine.org/en/stable/tutorials/export/exporting_projects.html",
  },
  defold: {
    id: "defold",
    name: "Defold",
    short: "Defold",
    version: "1.13.1 (Defold License, free forever)",
    licence: "Free forever (Apache-2.0-derived Defold License): sell your game, never the engine itself.",
    bestAt: "HTML5-first games (Poki / CrazyGames partner engine, empty web build under 1 MB) and small 2D Android builds; Lua.",
    connect:
      "Installed on the fleet build box: `bob --platform=wasm-web --archive --variant=release resolve build bundle --bundle-output build/web`; Android `--platform=armv7-android --architectures=arm64-v8a --bundle-format=aab`; native extensions build on build.defold.com.",
    gate: "none",
    runbook: "https://defold.com/manuals/bob/",
  },
  web: {
    id: "web",
    name: "Web (Three.js / Phaser + WebView APK)",
    short: "Web",
    version: "Three.js / Phaser 4 (Vite build)",
    licence: "MIT libraries — free.",
    bestAt: "UI- and text-heavy games (narrative, idle/incremental) where the DOM is the best UI toolkit; the fleet's proven Kotlin WebView wrapper (charge, street-brawler).",
    connect: "Vite build → the Kotlin Compose WebView wrapper; Phaser has an official MCP (phaser.io/agent/mcp).",
    gate: "none",
    runbook: "https://developers.poki.com/guide/sdk-phaser",
  },
  unity: {
    id: "unity",
    name: "Unity",
    short: "Unity",
    version: "6.3 LTS (6000.3.x)",
    licence:
      "Personal free for games while funding/revenue < $200K; Pro required above it ($210/month or $2,310/year per seat); Enterprise > $25M.",
    bestAt: "3D-heavy mobile with mature URP/IL2CPP, console targets (Pro), the strongest ads/IAP SDK ecosystem.",
    connect:
      "Free official `unity` CLI on the fleet build box: `unity install 6000.3.x` + `unity install-modules -m android`, `unity build --target android`, `unity test`, `unity mcp` (free MCP driving a local Editor); batch builds need no GPU.",
    gate: "Unity ID sign-in or a service account, then `unity license activate` (the owner's step).",
    runbook: "https://docs.unity.com/en-us/unity-cli/use-unity-cli",
  },
  unreal: {
    id: "unreal",
    name: "Unreal Engine",
    short: "Unreal",
    version: "5.8",
    licence: "Free under $1M lifetime gross revenue per product, then a 5 % royalty; $1,850/seat/year only for non-game commercial use.",
    bestAt: "Photoreal 3D and console-first productions; not mobile casual.",
    connect: "Not installed on the fleet build box (43 GB extracted, 32 GB RAM and a display required) — decision of 2026-09-22; documented only.",
    gate: "Epic account; a separate build machine.",
    runbook: "https://dev.epicgames.com/documentation/en-us/unreal-engine/build-operations-cooking-packaging-deploying-and-running-projects-in-unreal-engine",
  },
};

export interface EngineChoice {
  primary: EngineId;
  runnerUp: EngineId;
  reason: string;
}

/** Per-plan recommendation (ids = the 15 plans in plans.ts and in mgwp_plans). */
export const PLAN_ENGINE_CHOICE: Record<string, EngineChoice> = {
  "pocket-planet-keeper": { primary: "godot", runnerUp: "unity", reason: "data-driven simulation in GDScript; Unity only if the planet needs heavy 3D terrain." },
  "one-tap-time-heist": { primary: "godot", runnerUp: "defold", reason: "grid puzzle logic in GDScript with headless export on the fleet box; Defold if it goes HTML5-first." },
  "ghost-train-tycoon": { primary: "godot", runnerUp: "web", reason: "Control-node UI and data-driven scenes for a tycoon loop; a DOM UI is the runner-up." },
  "kitchen-chaos-delivery": { primary: "godot", runnerUp: "defold", reason: "2D physics and animation tooling with a small APK; Defold for the smallest web build." },
  "tiny-mech-arena": { primary: "godot", runnerUp: "unity", reason: "TileMapLayer + Jolt physics; Unity if the arena turns 3D-heavy with ads/IAP." },
  "swipe-knight": { primary: "godot", runnerUp: "unity", reason: "procedural rooms in GDScript with fast iteration; Unity as the 3D fallback." },
  "lost-signal": { primary: "web", runnerUp: "godot", reason: "text and UI heavy — the DOM is the best UI toolkit and the WebView APK wrapper is proven; Godot with Dialogic otherwise." },
  "cloud-shepherd": { primary: "defold", runnerUp: "godot", reason: "casual puzzle that ships web-first: sub-1 MB HTML5 and the Poki partner SDK; Godot for a mobile-first cut." },
  "monster-hotel": { primary: "godot", runnerUp: "web", reason: "management UI plus collection: Control nodes and resources; DOM UI is the runner-up." },
  "reverse-tower-defense": { primary: "godot", runnerUp: "defold", reason: "tile-based strategy with GDScript; Defold if HTML5 size matters." },
  "street-food-empire": { primary: "godot", runnerUp: "web", reason: "tycoon loop with data-driven scenes; a DOM UI is the runner-up." },
  "shadow-garden": { primary: "godot", runnerUp: "defold", reason: "environmental puzzle with 2D lighting in the Mobile renderer; Defold for a web-first cut." },
  "idle-archaeologist": { primary: "web", runnerUp: "godot", reason: "pure UI and numbers with instant HMR, reusing the dashboard stack; Godot otherwise." },
  "swipe-soccer-manager": { primary: "godot", runnerUp: "unity", reason: "2D / light 3D with adequate physics; Unity if 3D rigs and animation are needed." },
  "animal-escape-room": { primary: "godot", runnerUp: "defold", reason: "point-and-tap puzzle scenes in GDScript; Defold if HTML5-first." },
};

/** Fallback by genre keywords for plans that are not in the map (e.g. rows added later to mgwp_plans). */
export function engineChoiceByGenre(genre: string): EngineChoice {
  // exact-token matches only: "Contextual" is not "text" and "puzzle-ish" is not "puzzle" (hyphenated terms stay one token)
  const tokens = genre.toLowerCase().split(/[\s/,;:()]+/).filter(Boolean);
  const has = (...words: string[]) => words.some((w) => tokens.includes(w));
  // a 3D / console / shooter genre outranks the content-style rules below (CodeRabbit)
  if (has("3d", "console", "shooter", "fps"))
    return { primary: "unity", runnerUp: "godot", reason: "3D-heavy or console target: Unity's URP/IL2CPP and console exports." };
  if (has("idle", "incremental", "clicker", "narrative", "mystery", "text"))
    return { primary: "web", runnerUp: "godot", reason: "UI- and text-heavy: the DOM is the best UI toolkit; Godot otherwise." };
  if (has("casual") && has("puzzle"))
    return { primary: "defold", runnerUp: "godot", reason: "casual puzzle, web-first: sub-1 MB HTML5 and the Poki partner SDK." };
  return { primary: "godot", runnerUp: "defold", reason: "the fleet default for 2D mobile: GDScript iteration and headless export on the build box." };
}

export function engineChoiceFor(plan: Pick<GamePlan, "id" | "genre">): EngineChoice {
  // own keys only — a DB row id such as "constructor" must not resolve to an inherited property (CodeRabbit)
  return Object.hasOwn(PLAN_ENGINE_CHOICE, plan.id) ? PLAN_ENGINE_CHOICE[plan.id] : engineChoiceByGenre(plan.genre);
}

export const ENGINE_RULES = {
  newGame:
    "New game: default to Godot; Defold when the plan is HTML5-first or build size is a KPI; Web (React/Phaser in the WebView wrapper) when the game is UI-dominant; Unity only when the plan lists console targets, heavy 3D or SDK-heavy monetisation; Unreal never on the fleet build box.",
  existingGame:
    "Existing game: stay in the game's current engine. Rewrite only when the feature is impossible or grossly expensive there AND less than ~30 % of the planned content exists AND the target engine is already installed and licensed on the build box. Foreign content enters only as an HTML5 bundle inside the existing WebView wrapper (Godot/Defold web export in an iframe) or as Unity as a Library (+30–60 MB); Unreal has no library mode.",
  fleetGames:
    "Fleet games and their engines: zip-rush (Godot 4.4 GL Compatibility — EOL branch, upgrade to 4.7 in tested hops before new elements), sunleaf-sprint (Godot 4.7 Mobile), charge (Three.js + cannon-es in a WebView APK), street-brawler (HTML5 Canvas + Kotlin Compose WebView).",
} as const;

export interface EngineSectionOptions {
  /** true = the plan extends an existing game; the section leads with the stay-in-engine rule. */
  existingGame?: boolean;
}

/** The lines of §16 "Engine choice" — pure, testable. */
export function engineSectionLines(plan: Pick<GamePlan, "id" | "genre">, opts: EngineSectionOptions = {}): string[] {
  const c = engineChoiceFor(plan);
  const p = ENGINES[c.primary];
  const r = ENGINES[c.runnerUp];
  const L: string[] = [];
  L.push("## 16. Engine choice");
  L.push("");
  if (opts.existingGame) {
    L.push(`> **Mode: adding elements to an existing game.** ${ENGINE_RULES.existingGame}`);
    L.push("");
    L.push(`- ${ENGINE_RULES.fleetGames}`);
    L.push(`- If this plan starts a **new** game instead, the recommendation is **${p.name}** (runner-up ${r.name}): ${c.reason}`);
  } else {
    L.push(`> **Mode: new game.** ${ENGINE_RULES.newGame}`);
    L.push("");
    L.push(`- **Recommended:** ${p.name} ${p.version} — ${c.reason}`);
    L.push(`- **Runner-up:** ${r.name} ${r.version} — ${r.bestAt}`);
    L.push(`- **If this becomes an add-on to an existing game:** ${ENGINE_RULES.existingGame}`);
  }
  L.push("");
  L.push("**The engines, side by side (licence · best at · how an agent connects · gate):**");
  L.push("");
  for (const id of ENGINE_IDS) {
    const e = ENGINES[id];
    const gate = e.gate.endsWith(".") ? e.gate : `${e.gate}.`; // one trailing period whether the data carries it or not (CodeRabbit)
    L.push(`- **${e.name} ${e.version}** — ${e.licence} Best at: ${e.bestAt} Connect: ${e.connect} Gate: ${gate} Runbook: ${e.runbook}`);
  }
  L.push("");
  L.push("**Build-box facts (2026-09-22):** Godot 4.7.2, Defold 1.13.1 (`bob` on JDK 25) and the Unity CLI + Editor 6.3 LTS are installed on the fleet Linux box (4 CPU, 16 GB, no GPU); Unity builds need the owner's licence step; Unreal is not installed. Installs, MCP wiring and account steps are approval-gated.");
  return L;
}
