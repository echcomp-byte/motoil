import { describe, expect, it } from "vitest";
import type { Database } from "@/lib/supabase/types";
import { LIMITS, SCHEMA_VERSION } from "./types";
import {
  buildIceSnapshotInput,
  sealSnapshot,
  type LocalizeKupatHolim,
} from "./snapshot";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type ContactRow = Database["public"]["Tables"]["emergency_contacts"]["Row"];
type BikeRow = Database["public"]["Tables"]["bikes"]["Row"];

const HMO_LABELS: Record<string, { he: string; en: string }> = {
  clalit: { he: "כללית", en: "Clalit" },
  maccabi: { he: "מכבי", en: "Maccabi" },
  meuhedet: { he: "מאוחדת", en: "Meuhedet" },
  leumit: { he: "לאומית", en: "Leumit" },
};

const localizeKupatHolim: LocalizeKupatHolim = (canonical, locale) => {
  if (!canonical) return null;
  return HMO_LABELS[canonical]?.[locale] ?? canonical;
};

function profile(overrides: Partial<ProfileRow> = {}): ProfileRow {
  return {
    id: "user-1",
    full_name: "ישראל ישראלי",
    teudat_zehut: "000000018",
    blood_type: "O+",
    allergies: null,
    medications: null,
    conditions: null,
    kupat_holim: "clalit",
    locale: "he",
    created_at: "2026-05-01T00:00:00Z",
    updated_at: "2026-05-01T00:00:00Z",
    ...overrides,
  };
}

function contact(overrides: Partial<ContactRow> = {}): ContactRow {
  return {
    id: "c-1",
    user_id: "user-1",
    name: "דנה ישראלי",
    phone: "050-1234567",
    relation: "אישה",
    priority: 0,
    created_at: "2026-05-01T00:00:00Z",
    ...overrides,
  };
}

function bike(overrides: Partial<BikeRow> = {}): BikeRow {
  return {
    id: "b-1",
    user_id: "user-1",
    make: "Yamaha",
    model: "MT-07",
    year: 2024,
    license_plate: "12-345-67",
    is_primary: false,
    created_at: "2026-05-01T00:00:00Z",
    ...overrides,
  };
}

function build(args: Partial<Parameters<typeof buildIceSnapshotInput>[0]> = {}) {
  return buildIceSnapshotInput({
    profile: profile(),
    contacts: [],
    bikes: [],
    localizeKupatHolim,
    ...args,
  });
}

describe("buildIceSnapshotInput", () => {
  it("returns null when full_name is missing", () => {
    expect(build({ profile: profile({ full_name: null }) })).toBeNull();
    expect(build({ profile: profile({ full_name: "" }) })).toBeNull();
  });

  it("builds a minimal snapshot from a fresh profile", () => {
    const result = build({
      profile: profile({
        teudat_zehut: null,
        blood_type: null,
        allergies: null,
        medications: null,
        conditions: null,
        kupat_holim: null,
      }),
    });
    expect(result).not.toBeNull();
    expect(result?.profile.full_name).toBe("ישראל ישראלי");
    expect(result?.profile.allergies).toEqual([]);
    expect(result?.profile.kupat_holim).toBeNull();
    expect(result?.emergency_contacts).toEqual([]);
    expect(result?.primary_bike).toBeNull();
  });

  it("defaults to 'he' locale when profile.locale is null or unknown", () => {
    expect(build({ profile: profile({ locale: null }) })?.locale).toBe("he");
    expect(build({ profile: profile({ locale: "fr" }) })?.locale).toBe("he");
    expect(build({ profile: profile({ locale: "en" }) })?.locale).toBe("en");
  });

  it("localizes kupat_holim at write time using profile.locale", () => {
    expect(build({ profile: profile({ locale: "he", kupat_holim: "clalit" }) })?.profile.kupat_holim).toBe("כללית");
    expect(build({ profile: profile({ locale: "en", kupat_holim: "clalit" }) })?.profile.kupat_holim).toBe("Clalit");
    expect(build({ profile: profile({ kupat_holim: "maccabi" }) })?.profile.kupat_holim).toBe("מכבי");
  });
});

describe("buildIceSnapshotInput — list truncation", () => {
  it(`truncates allergies/medications/conditions to ${LIMITS.MAX_LIST_ITEMS} items`, () => {
    const many = Array.from({ length: 12 }, (_, i) => `item-${i}`);
    const result = build({
      profile: profile({ allergies: many, medications: many, conditions: many }),
    });
    expect(result?.profile.allergies.length).toBe(LIMITS.MAX_LIST_ITEMS);
    expect(result?.profile.allergies).toEqual(many.slice(0, LIMITS.MAX_LIST_ITEMS));
    expect(result?.profile.medications.length).toBe(LIMITS.MAX_LIST_ITEMS);
    expect(result?.profile.conditions.length).toBe(LIMITS.MAX_LIST_ITEMS);
  });

  it(`truncates individual items longer than ${LIMITS.MAX_ITEM_CHARS} chars`, () => {
    const longString = "a".repeat(LIMITS.MAX_ITEM_CHARS + 50);
    const result = build({ profile: profile({ allergies: [longString] }) });
    expect(result?.profile.allergies[0]?.length).toBe(LIMITS.MAX_ITEM_CHARS);
  });
});

describe("buildIceSnapshotInput — emergency contacts", () => {
  it(`truncates to ${LIMITS.MAX_CONTACTS} contacts after sorting by priority ASC`, () => {
    const contacts = [
      contact({ id: "c-a", name: "A", priority: 5 }),
      contact({ id: "c-b", name: "B", priority: 1 }),
      contact({ id: "c-c", name: "C", priority: 3 }),
      contact({ id: "c-d", name: "D", priority: 0 }),
      contact({ id: "c-e", name: "E", priority: 2 }),
    ];
    const result = build({ contacts });
    expect(result?.emergency_contacts.map((c) => c.name)).toEqual(["D", "B", "E"]);
  });

  it("breaks priority ties by created_at ASC (oldest first)", () => {
    const contacts = [
      contact({ id: "c-1", name: "Younger", priority: 0, created_at: "2026-05-10T00:00:00Z" }),
      contact({ id: "c-2", name: "Oldest", priority: 0, created_at: "2026-04-01T00:00:00Z" }),
      contact({ id: "c-3", name: "Middle", priority: 0, created_at: "2026-05-01T00:00:00Z" }),
    ];
    const result = build({ contacts });
    expect(result?.emergency_contacts.map((c) => c.name)).toEqual(["Oldest", "Middle", "Younger"]);
  });

  it("normalizes contact phones to E.164 (+972...)", () => {
    const result = build({
      contacts: [
        contact({ phone: "050-1234567" }),
        contact({ id: "c-2", phone: "+972 52 765 4321", priority: 1 }),
        contact({ id: "c-3", phone: "972531112222", priority: 2 }),
      ],
    });
    expect(result?.emergency_contacts.map((c) => c.phone)).toEqual([
      "+972501234567",
      "+972527654321",
      "+972531112222",
    ]);
  });

  it("drops contacts with unparseable (e.g. landline) phones rather than including invalid E.164", () => {
    const result = build({
      contacts: [
        contact({ id: "c-1", phone: "02-1234567", priority: 0 }),
        contact({ id: "c-2", phone: "050-9999999", priority: 1 }),
      ],
    });
    expect(result?.emergency_contacts.length).toBe(1);
    expect(result?.emergency_contacts[0]?.phone).toBe("+972509999999");
  });

  it("preserves null relation (widget will omit the line)", () => {
    const result = build({ contacts: [contact({ relation: null })] });
    expect(result?.emergency_contacts[0]?.relation).toBeNull();
  });
});

describe("buildIceSnapshotInput — primary bike", () => {
  it("returns null when no bike is marked primary", () => {
    const result = build({ bikes: [bike(), bike({ id: "b-2" })] });
    expect(result?.primary_bike).toBeNull();
  });

  it("returns the bike marked is_primary", () => {
    const result = build({
      bikes: [bike({ id: "b-1" }), bike({ id: "b-2", make: "Honda", model: "CB500", is_primary: true })],
    });
    expect(result?.primary_bike).toEqual({
      make: "Honda",
      model: "CB500",
      license_plate: "12-345-67",
    });
  });

  it("omits bike.year from the snapshot", () => {
    const result = build({ bikes: [bike({ is_primary: true, year: 2020 })] });
    expect(result?.primary_bike).not.toHaveProperty("year");
  });

  it("returns the first is_primary bike if multiple are marked (defensive — DB constraint should prevent)", () => {
    const result = build({
      bikes: [
        bike({ id: "b-1", make: "Yamaha", is_primary: true }),
        bike({ id: "b-2", make: "Honda", is_primary: true }),
      ],
    });
    expect(result?.primary_bike?.make).toBe("Yamaha");
  });
});

describe("sealSnapshot", () => {
  it("adds schema_version and updated_at", () => {
    const input = build()!;
    const sealed = sealSnapshot(input, new Date("2026-05-28T12:00:00Z"));
    expect(sealed.schema_version).toBe(SCHEMA_VERSION);
    expect(sealed.updated_at).toBe("2026-05-28T12:00:00.000Z");
    expect(sealed.profile.full_name).toBe(input.profile.full_name);
  });
});
