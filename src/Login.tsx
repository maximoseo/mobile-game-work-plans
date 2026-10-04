import { useState, type FormEvent } from "react";
import { supabase } from "./lib/supabase";
import { useT } from "./lib/i18n/provider";
import { LanguageToggle } from "./components/LanguageToggle";

import { PasswordInput } from "./PasswordInput";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const t = useT();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!supabase) {
      setError(t("Database backend is not configured."));
      return;
    }
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setError(error.message);
  }

  return (
    <div className="shell login-shell">
      <main className="login-wrap">
        <form className="login-card" onSubmit={onSubmit}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
            <LanguageToggle />
          </div>
          <h1>{t("Mobile Game Work Plans")}</h1>
          <p className="subtitle">{t("Sign in to view the game-concept work plans.")}</p>

          <label className="field">
            <span>{t("Email")}</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@maximo-seo.com"
              autoComplete="email"
              required
            />
          </label>

          {/* div, not label: the show/hide button must not be nested inside a label */}
          <div className="field">
            <label htmlFor="login-password">{t("Password")}</label>
            <PasswordInput
              id="login-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button className="login-btn" type="submit" disabled={busy}>
            {busy ? t("Signing in…") : t("Sign in")}
          </button>
        </form>
      </main>
    </div>
  );
}