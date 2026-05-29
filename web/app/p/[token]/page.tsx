import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { pickLang, dir, type Lang } from "@/lib/lang";
import { t } from "./dict";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type PageProps = {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ lang?: string }>;
};

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

export default async function PublicProfilePage({ params, searchParams }: PageProps) {
  const { token } = await params;
  const { lang: langOverride } = await searchParams;

  if (!UUID_RE.test(token)) notFound();

  const h = await headers();
  const lang = pickLang(h.get("accept-language"), langOverride);

  const data = await fetchProfile(token);

  if (data === "not-found") return <NotFound lang={lang} token={token} />;
  if (data === "error") return <ServerError lang={lang} token={token} />;

  return <ProfileCard lang={lang} token={token} data={data} />;
}

async function fetchProfile(
  token: string
): Promise<ProfileResponse | "not-found" | "error"> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) {
    // Day 1: Edge Function not wired yet. Return stub so the page renders.
    return STUB_DATA;
  }
  try {
    const res = await fetch(`${base}/functions/v1/public-profile?token=${token}`, {
      cache: "no-store",
      headers: { accept: "application/json" },
    });
    if (res.status === 404) return "not-found";
    if (!res.ok) return "error";
    return (await res.json()) as ProfileResponse;
  } catch {
    return "error";
  }
}

const STUB_DATA: ProfileResponse = {
  profile: {
    full_name: "ישראל ישראלי",
    teudat_zehut: "000000000",
    blood_type: "O+",
    allergies: ["פניצילין"],
    medications: [],
    conditions: ["אסטמה"],
    kupat_holim: "clalit",
  },
  contacts: [
    { name: "רות ישראלי", phone: "+972501234567", relation: "אישה" },
    { name: "דני ישראלי", phone: "+972527654321", relation: "אח" },
  ],
  bike: { make: "Yamaha", model: "MT-07", year: 2024, license_plate: "12-345-67" },
};

function ProfileCard({
  lang,
  token,
  data,
}: {
  lang: Lang;
  token: string;
  data: ProfileResponse;
}) {
  const direction = dir(lang);
  const otherLang: Lang = lang === "he" ? "en" : "he";
  return (
    <main dir={direction} style={pageStyle}>
      <header style={headerStyle} className="no-print">
        <strong>{t(lang, "page.title")}</strong>
        <nav style={{ display: "flex", gap: 12 }}>
          <a href={`?lang=${otherLang}`} style={linkStyle}>
            {t(lang, "switch.lang")}
          </a>
        </nav>
      </header>

      <h1 style={titleStyle}>{t(lang, "page.title")}</h1>
      <p style={subtitleStyle}>{t(lang, "page.subtitle")}</p>

      <Section title={t(lang, "section.identity")}>
        <Field label={t(lang, "field.fullName")} value={data.profile.full_name} lang={lang} />
        <Field label={t(lang, "field.teudatZehut")} value={data.profile.teudat_zehut} lang={lang} />
      </Section>

      <Section title={t(lang, "section.medical")} emphasis>
        <Field label={t(lang, "field.bloodType")} value={data.profile.blood_type} lang={lang} />
        <ListField label={t(lang, "field.allergies")} values={data.profile.allergies} lang={lang} />
        <ListField label={t(lang, "field.medications")} values={data.profile.medications} lang={lang} />
        <ListField label={t(lang, "field.conditions")} values={data.profile.conditions} lang={lang} />
        <Field label={t(lang, "field.kupatHolim")} value={data.profile.kupat_holim} lang={lang} />
      </Section>

      <Section title={t(lang, "section.contacts")}>
        {data.contacts.length === 0 ? (
          <p style={mutedStyle}>{t(lang, "empty.list")}</p>
        ) : (
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {data.contacts.map((c, i) => (
              <li key={i} style={contactRowStyle}>
                <div>
                  <div style={{ fontWeight: 600 }}>{c.name}</div>
                  {c.relation && <div style={mutedStyle}>{c.relation}</div>}
                </div>
                <a href={`tel:${c.phone}`} style={phoneLinkStyle}>
                  {c.phone}
                </a>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {data.bike && (
        <Section title={t(lang, "section.bike")}>
          <Field label={t(lang, "field.make")} value={data.bike.make} lang={lang} />
          <Field label={t(lang, "field.model")} value={data.bike.model} lang={lang} />
          <Field label={t(lang, "field.year")} value={data.bike.year?.toString() ?? null} lang={lang} />
          <Field
            label={t(lang, "field.licensePlate")}
            value={data.bike.license_plate}
            lang={lang}
          />
        </Section>
      )}

      <footer style={footerStyle}>
        <small>{t(lang, "footer.disclaimer")}</small>
        <small style={{ display: "block", marginTop: 4, opacity: 0.5 }}>
          token: {token.slice(0, 8)}…
        </small>
      </footer>
    </main>
  );
}

function NotFound({ lang, token }: { lang: Lang; token: string }) {
  return (
    <main dir={dir(lang)} style={pageStyle}>
      <h1 style={titleStyle}>{t(lang, "error.notFound.title")}</h1>
      <p>{t(lang, "error.notFound.body")}</p>
      <p style={mutedStyle}>token: {token.slice(0, 8)}…</p>
    </main>
  );
}

function ServerError({ lang, token }: { lang: Lang; token: string }) {
  return (
    <main dir={dir(lang)} style={pageStyle}>
      <h1 style={titleStyle}>{t(lang, "error.serverTitle")}</h1>
      <p>{t(lang, "error.serverBody")}</p>
      <p style={mutedStyle}>token: {token.slice(0, 8)}…</p>
    </main>
  );
}

function Section({
  title,
  emphasis,
  children,
}: {
  title: string;
  emphasis?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section style={{ ...sectionStyle, ...(emphasis ? emphasisStyle : null) }}>
      <h2 style={sectionTitleStyle}>{title}</h2>
      <div style={{ display: "grid", gap: 8 }}>{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  lang,
}: {
  label: string;
  value: string | null | undefined;
  lang: Lang;
}) {
  return (
    <div style={fieldRowStyle}>
      <span style={labelStyle}>{label}</span>
      <span style={valueStyle}>{value || t(lang, "empty.value")}</span>
    </div>
  );
}

function ListField({
  label,
  values,
  lang,
}: {
  label: string;
  values: string[] | null;
  lang: Lang;
}) {
  const items = values ?? [];
  return (
    <div style={fieldRowStyle}>
      <span style={labelStyle}>{label}</span>
      <span style={valueStyle}>
        {items.length === 0 ? t(lang, "empty.list") : items.join(", ")}
      </span>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  maxWidth: 640,
  margin: "0 auto",
  padding: "16px 16px 32px",
};
const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px 0 16px",
  borderBottom: "1px solid var(--border)",
  marginBottom: 16,
};
const linkStyle: React.CSSProperties = {
  color: "var(--primary)",
  textDecoration: "none",
  fontWeight: 600,
};
const titleStyle: React.CSSProperties = { fontSize: "1.5rem", margin: "8px 0 4px" };
const subtitleStyle: React.CSSProperties = {
  color: "var(--text-muted)",
  margin: "0 0 16px",
};
const sectionStyle: React.CSSProperties = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  padding: 12,
  marginBottom: 12,
};
const emphasisStyle: React.CSSProperties = {
  borderColor: "var(--primary)",
  background: "#fff5f5",
};
const sectionTitleStyle: React.CSSProperties = {
  fontSize: "0.95rem",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  color: "var(--text-muted)",
  margin: "0 0 8px",
};
const fieldRowStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "max-content 1fr",
  gap: 12,
  alignItems: "baseline",
};
const labelStyle: React.CSSProperties = {
  color: "var(--text-muted)",
  fontSize: "0.85rem",
};
const valueStyle: React.CSSProperties = { fontSize: "1rem" };
const contactRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "6px 0",
  borderBottom: "1px dashed var(--border)",
};
const phoneLinkStyle: React.CSSProperties = {
  color: "var(--primary)",
  fontWeight: 600,
  fontVariantNumeric: "tabular-nums",
  textDecoration: "none",
};
const mutedStyle: React.CSSProperties = {
  color: "var(--text-muted)",
  fontSize: "0.85rem",
  margin: 0,
};
const footerStyle: React.CSSProperties = {
  marginTop: 24,
  paddingTop: 16,
  borderTop: "1px solid var(--border)",
  color: "var(--text-muted)",
};
