import { describe, expect, it } from "vitest";
import { gamePlans } from "../data/plans";
import { ENGINES, engineChoiceFor } from "../data/engines";
import { buildFullPlanMd } from "./fullPlanMd";

const headings = (md: string) => md.split("\n").filter((l) => l.startsWith("## "));
const md_head = (md: string) => md.slice(0, md.indexOf("## 7. Technical Stack"));

describe("buildFullPlanMd", () => {
  it("keeps the 16 numbered sections in order for every plan, with §16 renamed to Engine choice", () => {
    for (const p of gamePlans) {
      const h = headings(buildFullPlanMd(p));
      expect(h).toHaveLength(16);
      h.forEach((line, i) => expect(line.startsWith(`## ${i + 1}. `), `${p.id} section ${i + 1}: ${line}`).toBe(true));
      expect(h[13]).toBe("## 14. Summer Engine Build Guide");
      expect(h[14]).toBe("## 15. 21st.dev UI Component Spec");
      expect(h[15]).toBe("## 16. Engine choice");
    }
  });

  it("echoes the recommendation in §7 and names all five engines in §16", () => {
    for (const p of gamePlans) {
      const md = buildFullPlanMd(p);
      const c = engineChoiceFor(p);
      expect(md).toContain(`- **Engine (recommended, see §16):** ${ENGINES[c.primary].name} ${ENGINES[c.primary].version}`);
      expect(md).toContain(`- **Why this engine:** ${ENGINES[c.primary].bestAt}`);
      const s16 = md.slice(md.indexOf("## 16. Engine choice"));
      expect(s16).toContain(`**Recommended:** ${ENGINES[c.primary].name}`);
      expect(s16).toContain(`**Runner-up:** ${ENGINES[c.runnerUp].name}`);
      for (const e of Object.values(ENGINES)) expect(s16).toContain(e.name);
    }
  });

  it("marks Summer Engine as unavailable on the fleet build box", () => {
    expect(buildFullPlanMd(gamePlans[0])).toContain("Summer Engine runs on macOS/Windows only");
  });

  it("the existing-game option changes §7 (stay-in-engine + fallback) and §16, nothing else", () => {
    const p = gamePlans.find((x) => x.id === "lost-signal")!;
    const fresh = buildFullPlanMd(p);
    const existing = buildFullPlanMd(p, { existingGame: true });
    const between = (md: string) => md.slice(md.indexOf("## 8. "), md.indexOf("## 16. Engine choice"));
    expect(md_head(fresh)).toBe(md_head(existing));
    expect(between(fresh)).toBe(between(existing));
    expect(existing).toContain("- **Engine:** the game's current engine — an existing game stays in its engine (rule in §16).");
    expect(existing).toContain("- **New-game fallback (only if this were built from scratch):** Web (Three.js / Phaser + WebView APK)");
    expect(existing).not.toContain("**Engine (recommended, see §16):**");
    expect(existing).toContain("**Mode: adding elements to an existing game.**");
    expect(existing).toContain("If this plan starts a **new** game instead, the recommendation is **Web (Three.js / Phaser + WebView APK)**");
    expect(fresh).toContain("**Mode: new game.**");
  });

  it("works for a plan that is not in the static list (DB row) via the genre fallback", () => {
    const md = buildFullPlanMd({ ...gamePlans[0], id: "db-only-row", genre: "Casual / puzzle" });
    expect(md).toContain("**Recommended:** Defold");
  });
});
