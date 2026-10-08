import { useEffect, useMemo, useState } from "react";
import {
  gamePlans as fallbackPlans,
  priorityList,
  firstProject,
  type GamePlan,
} from "./data/plans";
import { supabase, isSupabaseConfigured } from "./lib/supabase";
import { buildFullPlanMd, downloadPlanMd } from "./lib/fullPlanMd";
import { ENGINES, engineChoiceFor } from "./data/engines";
import Login from "./Login";
import { useT } from "./lib/i18n/provider";
import { LanguageToggle } from "./components/LanguageToggle";
import { WhatsNewModal } from "./components/WhatsNewModal";

/** "Godot · runner-up Defold" — the plan's engine recommendation, from src/data/engines.ts. */
function EngineBadge({ plan }: { plan: GamePlan }) {
  const c = engineChoiceFor(plan);
  return (
    <span className="engine-badge" title={c.reason} data-engine={c.primary}>
      {ENGINES[c.primary].short} · runner-up {ENGINES[c.runnerUp].short}
    </span>
  );
}

function MilestoneTable({ plan }: { plan: GamePlan }) {
  const t = useT();
  return (
    <div className="milestones">
      {plan.workPlan.map((m) => (
        <div className="milestone" key={m.name}>
          <div className="milestone-head">
            <span className="milestone-name">{m.name}</span>
            <span className="milestone-duration">{m.duration}</span>
          </div>
          {m.dependencies && <div className="milestone-dep">↳ {t("depends on:")} {m.dependencies}</div>}
          <ul className="milestone-tasks">
            {m.tasks.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function PlanCard({
  plan,
  onPreview,
}: {
  plan: GamePlan;
  onPreview: (p: GamePlan) => void;
}) {
  const [open, setOpen] = useState(false);
  const t = useT();
  return (
    <article className="card">
      <button className="card-head" onClick={() => setOpen((o) => !o)}>
        <span className="card-title">{plan.title}</span>
        <span className="card-genre">{plan.genre}</span>
        <span className="card-toggle">{open ? "−" : "+"}</span>
      </button>
      <p className="card-core">{plan.coreGameplay}</p>
      <p className="card-engine">
        <span className="card-engine-label">{t("Engine")}</span> <EngineBadge plan={plan} />
      </p>
      <div className="card-meta">
        <div>
          <h4>{t("Target audience")}</h4>
          <p>{plan.audience}</p>
        </div>
        <div>
          <h4>{t("Monetization")}</h4>
          <p>{plan.monetization}</p>
        </div>
      </div>
      <div className="card-features">
        <h4>{t("Main features")}</h4>
        <ul>
          {plan.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>
      {open && (
        <div className="card-plan">
          <h4>{t("Work plan")}</h4>
          <MilestoneTable plan={plan} />
        </div>
      )}
      <div className="card-actions">
        <button className="md-btn" onClick={() => onPreview(plan)}>
          {t("Full Plan (MD)")}
        </button>
      </div>
    </article>
  );
}

function MarkdownModal({
  plan,
  onClose,
}: {
  plan: GamePlan;
  onClose: () => void;
}) {
  // "Existing game?" flips §16 to the stay-in-engine rule; the toggle is per modal, never persisted.
  const [existingGame, setExistingGame] = useState(false);
  const md = useMemo(() => buildFullPlanMd(plan, { existingGame }), [plan, existingGame]);
  const [copied, setCopied] = useState(false);
  const t = useT();

  async function copy() {
    let ok = false;
    try {
      await navigator.clipboard.writeText(md);
      ok = true;
    } catch {
      const ta = document.createElement("textarea");
      ta.value = md;
      document.body.appendChild(ta);
      ta.select();
      ok = document.execCommand("copy");
      document.body.removeChild(ta);
    }
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{plan.title} — {t("Full Plan (Markdown)")}</h3>
          <button className="modal-close" onClick={onClose} aria-label={t("Close")}>
            ×
          </button>
        </div>
        <div className="modal-options">
          <EngineBadge plan={plan} />
          <label className="modal-toggle">
            <input
              type="checkbox"
              checked={existingGame}
              onChange={(e) => setExistingGame(e.target.checked)}
              data-testid="existing-game-toggle"
            />
            {t("Existing game (adding elements — §16 leads with the stay-in-engine rule)")}
          </label>
        </div>
        <pre className="modal-md" dir="ltr">{md}</pre>
        <div className="modal-actions">
          <button className="md-btn" onClick={copy}>
            {copied ? t("Copied ✓") : t("Copy")}
          </button>
          <button className="md-btn" onClick={() => downloadPlanMd(plan, { existingGame })}>
            {t("Download .md")}
          </button>
        </div>
      </div>
    </div>
  );
}

function Dashboard({
  plans,
  dbMode,
  onSignOut,
}: {
  plans: GamePlan[];
  dbMode: boolean;
  onSignOut: () => void;
}) {
  const [query, setQuery] = useState("");
  const [preview, setPreview] = useState<GamePlan | null>(null);
  const t = useT();
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return plans;
    return plans.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.genre.toLowerCase().includes(q) ||
        p.coreGameplay.toLowerCase().includes(q)
    );
  }, [query, plans]);

  return (
    <div className="shell">
      <header className="header">
        <div className="header-inner">
          <div>
            <h1>{t("Mobile Game Work Plans")}</h1>
            <p className="subtitle">
              {t("Planning-only work plans for mobile game concepts · MaximoSEO")}
            </p>
          </div>
          <div className="header-actions">
            <input
              className="search"
              placeholder={t("Search ideas…")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <LanguageToggle />
            <button className="signout-btn" onClick={onSignOut}>
              {t("Sign out")}
            </button>
          </div>
        </div>
        <div className="source-badge" title={t("Data source")}>
          {dbMode ? t("● Database-backed (Supabase)") : t("○ Static fallback")}
        </div>
      </header>

      <main className="main">
        <section className="section">
          <h2>{t("Priority Development List")}</h2>
          <ol className="priority">
            {priorityList.map((p) => (
              <li key={p.rank} className="priority-item">
                <span className="priority-rank">{p.rank}</span>
                <div>
                  <strong>{p.title}</strong>
                  <p>{p.why}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="section first">
          <h2>{t("Recommended First Project")}</h2>
          <div className="first-card">
            <div className="first-head">
              <h3>{firstProject.title}</h3>
              <span className="badge">{firstProject.genre}</span>
            </div>
            <p className="first-core">{firstProject.coreGameplay}</p>
            <div className="first-grid">
              <div>
                <h4>{t("Main features")}</h4>
                <ul>
                  {firstProject.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4>{t("Target audience")}</h4>
                <p>{firstProject.audience}</p>
                <h4>{t("Monetization ideas")}</h4>
                <ul>
                  {firstProject.monetization.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <h2>
            {t("All {n} Work Plans").replace("{n}", String(plans.length))}{" "}
            <span className="count">
              {filtered.length}/{plans.length}
            </span>
          </h2>
          <div className="grid">
            {filtered.map((p) => (
              <PlanCard key={p.id} plan={p} onPreview={setPreview} />
            ))}
          </div>
        </section>
      </main>

      {preview && (
        <MarkdownModal plan={preview} onClose={() => setPreview(null)} />
      )}

      <footer className="footer">
        {t("Planning only — no execution. Generated by Hermes Agent")} · {new Date().getFullYear()}
      </footer>
      <WhatsNewModal />
    </div>
  );
}

// Map a snake_case Supabase row back to the camelCase GamePlan shape.
type DbRow = {
  id: string;
  title: string;
  genre: string | null;
  core_gameplay: string | null;
  features: string[];
  audience: string | null;
  monetization: string | null;
  work_plan: { name: string; tasks: string[]; duration: string; dependencies?: string }[];
  priority_rank: number | null;
};

function toGamePlan(r: DbRow): GamePlan {
  return {
    id: r.id,
    title: r.title,
    genre: r.genre ?? "",
    coreGameplay: r.core_gameplay ?? "",
    features: r.features ?? [],
    audience: r.audience ?? "",
    monetization: r.monetization ?? "",
    workPlan: (r.work_plan ?? []).map((m) => ({
      name: m.name,
      tasks: m.tasks ?? [],
      duration: m.duration,
      dependencies: m.dependencies,
    })),
  };
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [plans, setPlans] = useState<GamePlan[]>(fallbackPlans);
  const [dbMode, setDbMode] = useState(false);

  useEffect(() => {
    if (!supabase) {
      // No backend configured: show the dashboard unlocked with static data.
      setLoading(false);
      setAuthed(true);
      return;
    }

    let mounted = true;
    // Fleet SSO: a panel-issued fleet_session cookie unlocks the dashboard
    // (static data view — live rows still require a Supabase session). Kept
    // separate so a null session event never clobbers a fleet unlock, and an
    // explicit sign-out (flagged below) is not re-unlocked on reload.
    let fleetAuthed = false;
    let sessionSeen = false;
    const signedOut = () => sessionStorage.getItem("mgwp_signed_out") === "1";
    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      sessionSeen = Boolean(data.session);
      if (data.session) {
        setAuthed(true);
        setLoading(false);
        return;
      }
      fleetAuthed = !signedOut()
        ? await fetch("/api/fleet-session")
            .then((r) => r.ok)
            .catch(() => false)
        : false;
      if (mounted) {
        // A Supabase sign-in that raced the fleet probe wins.
        setAuthed(sessionSeen || fleetAuthed);
        setLoading(false);
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      sessionSeen = Boolean(session);
      if (event === "SIGNED_IN") sessionStorage.removeItem("mgwp_signed_out");
      if (mounted) setAuthed(sessionSeen || fleetAuthed);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!supabase || !authed) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase.from("mgwp_plans").select("*");
      if (!cancelled && !error && data && data.length) {
        const rows = data as DbRow[];
        // Deterministic client-side sort: priority first (rank asc), then nulls by title.
        const sorted = [...rows].sort((a, b) => {
          const ra = a.priority_rank;
          const rb = b.priority_rank;
          if (ra == null && rb != null) return 1;
          if (ra != null && rb == null) return -1;
          if (ra != null && rb != null && ra !== rb) return ra - rb;
          return (a.title ?? "").localeCompare(b.title ?? "");
        });
        setPlans(sorted.map(toGamePlan));
        setDbMode(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [authed]);

  async function handleSignOut() {
    // Suppress the fleet unlock for this tab: the domain cookie belongs to the
    // panel (deleting it would sign the operator out of every dashboard).
    sessionStorage.setItem("mgwp_signed_out", "1");
    if (supabase) await supabase.auth.signOut();
    setAuthed(false);
  }

  if (loading) {
    return (
      <div className="shell">
        <main className="loader-wrap">
          <span className="loader" />
        </main>
      </div>
    );
  }

  if (!authed) {
    return <Login />;
  }

  return <Dashboard plans={plans} dbMode={dbMode} onSignOut={handleSignOut} />;
}