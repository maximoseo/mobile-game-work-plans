import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// If env vars are missing (e.g. local dev without .env), the client is null and
// the app falls back to the hardcoded plans.ts data with no auth gate.
export const supabase =
  url && anon ? createClient(url, anon) : null;

export const isSupabaseConfigured = supabase !== null;
