import { LANGS } from "../lib/i18n/config";
import { useI18n, useT } from "../lib/i18n/provider";

/** One-click English ⇄ עברית toggle. English is primary; Hebrew flips to RTL.
 *  The choice persists in localStorage. */
export function LanguageToggle() {
  const { lang, setLang } = useI18n();
  const t = useT();
  const next = lang === "en" ? "he" : "en";
  const nextLabel = LANGS.find((l) => l.key === next)?.label ?? "עברית";
  return (
    <button
      type="button"
      className="signout-btn lang-toggle"
      onClick={() => setLang(next)}
      aria-label={`${t("Language")}: ${LANGS.find((l) => l.key === lang)?.label} → ${nextLabel}`}
      title={`${t("Language")} · ${nextLabel}`}
    >
      {lang === "en" ? "עב" : "EN"}
    </button>
  );
}
