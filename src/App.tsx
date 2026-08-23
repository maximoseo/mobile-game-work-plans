import { useEffect, useMemo, useState } from "react";
import {
  gamePlans as fallbackPlans,
  priorityList,
  firstProject,
  type GamePlan,
} from "./data/plans";
import { supabase, isSupabaseConfigured } from "./lib/supabase";
import Login from "./Login";

function MilestoneTable({ plan }: { plan: GamePlan }) {
  return (
    <div className="milestones">
      {plan.workPlan.map((m) => (
        <div className="milestone" key={m.name}>
          <div className="milestone-head">
            <span className="milestone-name">{m.name}</span>
            <span className="milestone-duration">{m.duration}</span>
          </div>
          {m.dependencies && <div className="milestone-dep">↳ depends on: {m.dependencies}</div>}
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

function PlanCard({ plan }: { plan: GamePlan }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="card">
      <button className="card-head" onClick={() => setOpen((o) => !o)}>
        <span className="card-title">{plan.title}</span>
        <span className="card-genre">{plan.genre}</span>
        <span className="card-toggle">{open ? "−" : "+"}</span>
      </button>
      <p className="card-core">{plan.coreGameplay}</p>
      <div className="card-meta">
        <div>
          <h4>Target audience</h4>
          <p>{plan.audience}</p>
        </div>
        <div>
          <h4>Monetization</h4>
          <p>{plan.monetization}</p>
        </div>
      </div>
      <div className="card-features">
        <h4>Main features</h4>
        <ul>
          {plan.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>
      {open && (
        <div className="card-plan">
          <h4>Work plan</h4>
          <MilestoneTable plan={plan} />
        </div>
      )}
    </article>
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
            <h1>Mobile Game Work Plans</h1>
            <p className="subtitle">
              Planning-only work plans for 15 mobile game concepts · MaximoSEO
            </p>
          </div>
          <div className="header-actions">
            <input
              className="search"
              placeholder="Search ideas…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="signout-btn" onClick={onSignOut}>
              Sign out
            </button>
          </div>
        </div>
        <div className="source-badge" title="Data source">
          {dbMode ? "● Database-backed (Supabase)" : "○ Static fallback"}
        </div>
      </header>

      <main className="main">
        <section className="section">
          <h2>Priority Development List</h2>
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
          <h2>Recommended First Project</h2>
          <div className="first-card">
            <div className="first-head">
              <h3>{firstProject.title}</h3>
              <span className="badge">{firstProject.genre}</span>
            </div>
            <p className="first-core">{firstProject.coreGameplay}</p>
            <div className="first-grid">
              <div>
                <h4>Main features</h4>
                <ul>
                  {firstProject.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4>Target audience</h4>
                <p>{firstProject.audience}</p>
                <h4>Monetization ideas</h4>
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
            All 15 Work Plans{" "}
            <span className="count">
              {filtered.length}/{plans.length}
            </span>
          </h2>
          <div className="grid">
            {filtered.map((p) => (
              <PlanCard key={p.id} plan={p} />
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        Planning only — no execution. Generated by Hermes Agent · {new Date().getFullYear()}
      </footer>
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
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setAuthed(Boolean(data.session));
        setLoading(false);
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setAuthed(Boolean(session));
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
      const { data, error } = await supabase
        .from("mgwp_plans")
        .select("*")
        .order("priority_rank", { ascending: true, nullsFirst: false })
        .order("title", { ascending: true });
      if (!cancelled && !error && data && data.length) {
        setPlans(data.map(toGamePlan));
        setDbMode(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [authed]);

  async function handleSignOut() {
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