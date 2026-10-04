import { useEffect, useState, type CSSProperties } from "react";
import { CHANGELOG, LATEST_CHANGELOG_NUMBER } from "../lib/i18n/config";
import { useI18n, useT } from "../lib/i18n/provider";

const SEEN_KEY = "mgwp.lastSeenChangelog";

const overlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(2, 6, 23, 0.88)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  padding: 16,
};

/** Light-surface card so the popup pops with maximum contrast against the dark dashboard. */
const cardStyle: CSSProperties = {
  maxWidth: 600,
  width: "100%",
  maxHeight: "84vh",
  overflow: "auto",
  padding: 0,
  background: "#f8fafc",
  color: "#0f172a",
  border: "1px solid #ffffff",
  borderRadius: 16,
  boxShadow: "0 30px 90px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.12)",
};

const headerStyle: CSSProperties = {
  margin: 0,
  padding: "22px 26px 18px",
  background: "linear-gradient(120deg, #2563eb 0%, #7c3aed 100%)",
  color: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
};

const pillStyle: CSSProperties = {
  background: "rgba(255, 255, 255, 0.22)",
  border: "1px solid rgba(255, 255, 255, 0.55)",
  color: "#ffffff",
  borderRadius: 999,
  padding: "5px 13px",
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: ".03em",
  whiteSpace: "nowrap",
};

const bodyStyle: CSSProperties = { padding: "22px 26px 26px" };

/** What's New popup — shown on dashboard entry whenever a new update exists. */
export function WhatsNewModal() {
  const t = useT();
  const { lang, dir } = useI18n();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = Number(window.localStorage.getItem(SEEN_KEY) ?? "0");
    if (seen < LATEST_CHANGELOG_NUMBER) setOpen(true);
  }, []);

  if (!open) return null;

  const dismiss = () => {
    window.localStorage.setItem(SEEN_KEY, String(LATEST_CHANGELOG_NUMBER));
    setOpen(false);
  };

  return (
    <div role="dialog" aria-modal="true" aria-label={t("What's new")} style={overlayStyle} onClick={dismiss}>
      <div style={cardStyle} dir={dir} onClick={(event) => event.stopPropagation()}>
        <div style={headerStyle}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>{t("What's new")}</h2>
          <span style={pillStyle}>{t("Update")} #{LATEST_CHANGELOG_NUMBER}</span>
        </div>
        <div style={bodyStyle}>
          {CHANGELOG.map((entry) => (
            <section key={entry.number} style={{ marginBottom: 20 }}>
              <h3 style={{ margin: "0 0 6px", fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    background: "#eef2ff",
                    color: "#4338ca",
                    border: "1px solid #c7d2fe",
                    borderRadius: 8,
                    padding: "2px 10px",
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  #{entry.number}
                </span>
                <span style={{ color: "#334155" }}>{entry.date}</span>
              </h3>
              <p style={{ margin: "0 0 8px", fontWeight: 800, fontSize: 15 }}>{entry.title[lang]}</p>
              <ul style={{ margin: 0, paddingInlineStart: 22 }}>
                {entry.items.map((item) => (
                  <li key={item.en} style={{ margin: "5px 0", color: "#1e293b", fontSize: 14, lineHeight: 1.55 }}>
                    {item[lang]}
                  </li>
                ))}
              </ul>
            </section>
          ))}
          <button className="login-btn" onClick={dismiss} style={{ width: "100%" }}>
            {t("Got it")}
          </button>
        </div>
      </div>
    </div>
  );
}
