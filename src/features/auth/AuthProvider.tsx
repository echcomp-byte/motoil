import type { Session, User } from "@supabase/supabase-js";
import { createContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";

type AuthResult = { error: string | null };

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const EMAIL_REDIRECT = "motoil://auth-callback";

function translateAuthError(message: string | undefined): string {
  if (!message) return "אירעה שגיאה לא צפויה";
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "אימייל או סיסמה שגויים";
  if (m.includes("email not confirmed")) return "אנא אשרו את כתובת המייל לפני התחברות";
  if (m.includes("user already registered")) return "כתובת המייל כבר רשומה. נסו להתחבר";
  if (m.includes("password should be at least")) return "הסיסמה קצרה מדי (לפחות 6 תווים)";
  if (m.includes("rate limit") || m.includes("too many"))
    return "יותר מדי ניסיונות. נסו שוב בעוד דקה";
  if (m.includes("network") || m.includes("fetch"))
    return "אין חיבור לאינטרנט. נסו שוב כשתחזרו לרשת";
  return message;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      signUp: async (email, password) => {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: EMAIL_REDIRECT },
        });
        return { error: error ? translateAuthError(error.message) : null };
      },
      signIn: async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error ? translateAuthError(error.message) : null };
      },
      signOut: async () => {
        const { error } = await supabase.auth.signOut();
        return { error: error ? translateAuthError(error.message) : null };
      },
    }),
    [session, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
