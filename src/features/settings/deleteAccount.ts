import { supabase } from "@/lib/supabase";

// Calls the `delete_my_account` Postgres RPC (owned by Dev A — see
// docs/HANDOFF.md §E migrations + Slack #motoil 2026-05-28). The RPC is
// SECURITY DEFINER; runs as postgres role; uses auth.uid() to identify the
// caller; cascades through profiles + emergency_contacts + bikes +
// public_tokens, then DELETEs the auth.users row. Returns nothing on success.
//
// Returns an i18n errorKey on failure so callers can render via t().
export async function deleteMyAccount(): Promise<{ errorKey: string | null }> {
  const { error } = await supabase.rpc("delete_my_account");
  if (!error) return { errorKey: null };

  // PostgreSQL 42883 = undefined_function — RPC not yet deployed by Dev A
  if (error.code === "42883" || /function .* does not exist/i.test(error.message)) {
    return { errorKey: "settings.delete.errors.notAvailable" };
  }
  return { errorKey: "settings.delete.errors.generic" };
}
