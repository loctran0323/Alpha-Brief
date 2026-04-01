import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/config";

export function isSupabaseConfigured(): boolean {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  return Boolean(url && key);
}
