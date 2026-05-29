// Supabase Edge Function: public-profile
//
// GET /public-profile?token=<uuid>
//
// Public, anonymous, read-only lookup of an emergency profile by opaque token.
// Backs the /p/<token> page that paramedics scan in the field. No auth.
//
// Contract:
//   200 OK     { profile, contacts, bike }
//   400        token missing or malformed
//   404        token unknown, revoked, or expired
//   429        rate limit exceeded (10 req/min/token)
//   500        upstream error
//
// Hardening notes:
//   - service_role key bypasses RLS on purpose — the privacy boundary is the
//     opaque UUID, not row-level security. Never accept or return user_id.
//   - Cache-Control: no-store. Revocation must be observable immediately.
//   - Rate limit by token (not IP): paramedics may be behind shared NAT.
//   - Log only first 8 chars of the token to avoid leaking it into logs.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.106.2";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const RATE_LIMIT_PER_MINUTE = 10;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "content-type, accept",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  { auth: { persistSession: false, autoRefreshToken: false } },
);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }
  if (req.method !== "GET") {
    return json({ error: "method_not_allowed" }, 405);
  }

  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  if (!token || !UUID_RE.test(token)) {
    return json({ error: "invalid_token" }, 400);
  }

  const limitStatus = await checkRateLimit(token);
  if (limitStatus === "limited") {
    return json({ error: "rate_limited" }, 429);
  }
  if (limitStatus === "table_missing") {
    // Rate-limit table not yet applied (waiting on Dev A migration review).
    // Fail open in dev — operator must enable before production. Log loudly.
    console.warn(
      `[public-profile] rate_limit table missing — failing open for token ${token.slice(0, 8)}…`,
    );
  }

  const userId = await resolveToken(token);
  if (!userId) {
    return json({ error: "not_found" }, 404);
  }

  try {
    const data = await loadProfile(userId);
    return json(data, 200);
  } catch (err) {
    console.error(
      `[public-profile] load_failed token=${token.slice(0, 8)}… err=${(err as Error).message}`,
    );
    return json({ error: "upstream" }, 500);
  }
});

async function checkRateLimit(
  token: string,
): Promise<"ok" | "limited" | "table_missing"> {
  const minuteBucket = Math.floor(Date.now() / 60_000);
  const { data, error } = await supabase.rpc("public_profile_rate_limit_hit", {
    p_token: token,
    p_minute_bucket: minuteBucket,
  });

  if (error) {
    if (
      error.code === "42883" || // function does not exist
      error.code === "42P01" || // table does not exist
      error.message?.includes("public_profile_rate_limit_hit")
    ) {
      return "table_missing";
    }
    console.error(`[public-profile] rate_limit_error: ${error.message}`);
    return "table_missing"; // fail open on infra errors
  }

  const hits = typeof data === "number" ? data : 0;
  return hits > RATE_LIMIT_PER_MINUTE ? "limited" : "ok";
}

async function resolveToken(token: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("public_tokens")
    .select("user_id, expires_at, revoked_at")
    .eq("token", token)
    .maybeSingle();

  if (error || !data) return null;
  if (data.revoked_at) return null;
  if (data.expires_at && new Date(data.expires_at).getTime() < Date.now()) {
    return null;
  }
  return data.user_id;
}

type ProfileResponse = {
  profile: {
    full_name: string | null;
    teudat_zehut: string | null;
    blood_type: string | null;
    allergies: string[] | null;
    medications: string[] | null;
    conditions: string[] | null;
    kupat_holim: string | null;
  };
  contacts: { name: string; phone: string; relation: string | null }[];
  bike: {
    make: string;
    model: string;
    year: number | null;
    license_plate: string | null;
  } | null;
};

async function loadProfile(userId: string): Promise<ProfileResponse> {
  const [profileRes, contactsRes, bikeRes] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "full_name, teudat_zehut, blood_type, allergies, medications, conditions, kupat_holim",
      )
      .eq("id", userId)
      .maybeSingle(),
    supabase
      .from("emergency_contacts")
      .select("name, phone, relation")
      .eq("user_id", userId)
      // priority: lower = called first (per migration 0002). created_at
      // breaks ties so the order is deterministic even when the user
      // hasn't reordered yet (all priorities default to 0).
      .order("priority", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase
      .from("bikes")
      .select("make, model, year, license_plate")
      .eq("user_id", userId)
      // is_primary DESC pulls the user-marked primary first (unique per
      // user — partial index in migration 0002 guarantees ≤1). created_at
      // is the fallback when no primary is set (e.g. new accounts).
      .order("is_primary", { ascending: false })
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);

  if (profileRes.error) throw profileRes.error;
  if (contactsRes.error) throw contactsRes.error;
  if (bikeRes.error && bikeRes.error.code !== "PGRST116") throw bikeRes.error;

  return {
    profile: profileRes.data ?? {
      full_name: null,
      teudat_zehut: null,
      blood_type: null,
      allergies: null,
      medications: null,
      conditions: null,
      kupat_holim: null,
    },
    contacts: contactsRes.data ?? [],
    bike: bikeRes.data ?? null,
  };
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...CORS,
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
