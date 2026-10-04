export type Lang = "en" | "he";

export const LANGS: Array<{ key: Lang; label: string; dir: "ltr" | "rtl" }> = [
  { key: "en", label: "English", dir: "ltr" },
  { key: "he", label: "עברית", dir: "rtl" },
];

export const DEFAULT_LANG: Lang = "en";

/** Changelog entries — newest first. `number` is the update number shown in the What's New popup. */
export interface ChangelogEntry {
  number: number;
  date: string;
  title: { en: string; he: string };
  items: Array<{ en: string; he: string }>;
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    number: 1,
    date: "2026-10-04",
    title: { en: "Hebrew / English UI + What's New", he: "ממשק עברית / אנגלית + מה חדש" },
    items: [
      { en: "Language switcher in the header and on the login screen (choice is remembered)", he: "מתג שפה בכותרת ובמסך הכניסה (הבחירה נשמרת)" },
      { en: "Full Hebrew translation with RTL layout — English stays the primary language", he: "תרגום מלא לעברית עם פריסת RTL — אנגלית נשארת השפה הראשית" },
      { en: "This What's New popup: every change is announced with its update number", he: "חלונית מה חדש: כל שינוי מוכרז עם מספר העדכון שלו" },
    ],
  },
];

export const LATEST_CHANGELOG_NUMBER = CHANGELOG[0].number;
