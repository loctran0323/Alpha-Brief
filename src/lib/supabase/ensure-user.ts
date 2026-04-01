import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Ensures a profile row and default watchlist exist (e.g. if trigger did not run).
 * Requires `002_profiles_insert_policy.sql` for profile insert via RLS.
 */
export async function ensureUserProfileAndWatchlist(
  supabase: SupabaseClient,
  userId: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const { data: profile, error: pErr } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (pErr) {
    return { ok: false, message: formatQueryError(pErr, "profiles") };
  }

  if (!profile) {
    const { error: insErr } = await supabase.from("profiles").insert({ id: userId });
    if (insErr) {
      return {
        ok: false,
        message: formatQueryError(insErr, "profiles (insert)"),
      };
    }
  }

  const { data: lists, error: wErr } = await supabase
    .from("watchlists")
    .select("id")
    .eq("user_id", userId)
    .limit(1);

  if (wErr) {
    return { ok: false, message: formatQueryError(wErr, "watchlists") };
  }

  if (!lists?.length) {
    const { error: wlErr } = await supabase
      .from("watchlists")
      .insert({ user_id: userId, name: "My watchlist" });
    if (wlErr) {
      return { ok: false, message: formatQueryError(wlErr, "watchlists (insert)") };
    }
  }

  return { ok: true };
}

function formatQueryError(
  err: { message?: string; code?: string; details?: string | null },
  context: string,
): string {
  const base = err.message ?? "Unknown error";
  const code = err.code ? ` [${err.code}]` : "";
  if (isMissingSchemaError(err)) {
    return `Database tables are missing (${context}). Run supabase/migrations/001_initial.sql in the Supabase SQL Editor, then refresh.`;
  }
  const lower = base.toLowerCase();
  if (lower.includes("row-level security") || lower.includes("rls")) {
    return `${context}: ${base}${code}. If you already ran 001_initial.sql, also run 002_profiles_insert_policy.sql (lets the app create your profile if the signup trigger missed).`;
  }
  return `${context}: ${base}${code}`;
}

function isMissingSchemaError(err: { message?: string; code?: string }): boolean {
  const m = (err.message ?? "").toLowerCase();
  return (
    (m.includes("relation") && m.includes("does not exist")) ||
    m.includes("could not find the table") ||
    err.code === "42P01"
  );
}
