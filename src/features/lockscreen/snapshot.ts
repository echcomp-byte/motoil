import type { Database } from "@/lib/supabase/types";
import { normalizeIsraeliMobile } from "@/lib/validation";
import {
  LIMITS,
  SCHEMA_VERSION,
  type IceEmergencyContact,
  type IcePrimaryBike,
  type IceProfile,
  type IceSnapshot,
  type IceSnapshotInput,
} from "./types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type ContactRow = Database["public"]["Tables"]["emergency_contacts"]["Row"];
type BikeRow = Database["public"]["Tables"]["bikes"]["Row"];

export type SnapshotLocale = "he" | "en";

export type LocalizeKupatHolim = (
  canonical: string | null,
  locale: SnapshotLocale,
) => string | null;

export type BuildSnapshotArgs = {
  profile: ProfileRow;
  contacts: ContactRow[];
  bikes: BikeRow[];
  localizeKupatHolim: LocalizeKupatHolim;
};

function coerceLocale(value: string | null): SnapshotLocale {
  return value === "en" ? "en" : "he";
}

function truncList(items: string[] | null): string[] {
  if (!items || items.length === 0) return [];
  return items
    .slice(0, LIMITS.MAX_LIST_ITEMS)
    .map((s) => (s.length > LIMITS.MAX_ITEM_CHARS ? s.slice(0, LIMITS.MAX_ITEM_CHARS) : s));
}

function buildProfile(
  row: ProfileRow,
  localizer: LocalizeKupatHolim,
  locale: SnapshotLocale,
): IceProfile {
  return {
    full_name: row.full_name ?? "",
    teudat_zehut: row.teudat_zehut,
    blood_type: row.blood_type,
    allergies: truncList(row.allergies),
    medications: truncList(row.medications),
    conditions: truncList(row.conditions),
    kupat_holim: localizer(row.kupat_holim, locale),
  };
}

function buildContacts(rows: ContactRow[]): IceEmergencyContact[] {
  const normalized: { row: ContactRow; phone: string }[] = [];
  for (const row of rows) {
    const phone = normalizeIsraeliMobile(row.phone);
    if (!phone) continue;
    normalized.push({ row, phone });
  }

  normalized.sort((a, b) => {
    if (a.row.priority !== b.row.priority) return a.row.priority - b.row.priority;
    const aT = a.row.created_at ?? "";
    const bT = b.row.created_at ?? "";
    if (aT < bT) return -1;
    if (aT > bT) return 1;
    return 0;
  });

  return normalized.slice(0, LIMITS.MAX_CONTACTS).map(({ row, phone }) => ({
    name: row.name,
    phone,
    relation: row.relation,
  }));
}

function buildPrimaryBike(rows: BikeRow[]): IcePrimaryBike | null {
  const primary = rows.find((b) => b.is_primary);
  if (!primary) return null;
  return {
    make: primary.make,
    model: primary.model,
    license_plate: primary.license_plate,
  };
}

export function buildIceSnapshotInput(args: BuildSnapshotArgs): IceSnapshotInput | null {
  const { profile, contacts, bikes, localizeKupatHolim } = args;
  if (!profile.full_name) return null;
  const locale = coerceLocale(profile.locale);
  return {
    locale,
    profile: buildProfile(profile, localizeKupatHolim, locale),
    emergency_contacts: buildContacts(contacts),
    primary_bike: buildPrimaryBike(bikes),
  };
}

export function sealSnapshot(input: IceSnapshotInput, now: Date = new Date()): IceSnapshot {
  return {
    ...input,
    schema_version: SCHEMA_VERSION,
    updated_at: now.toISOString(),
  };
}
