import type { Session, User } from "@supabase/supabase-js";
import { createContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { signInWithApple } from "./providers/apple";
import { signInWithGoogle } from "./providers/google";

type AuthResult = { errorKey: string | null };

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signInWithApple: () => Promise<AuthResult>;
  signInWithGoogle: () => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const EMAIL_REDIRECT = "motoil://auth-callback";

// Map Supabase error messages to i18n keys (resolved by the screen via t()).
function mapAuthErrorKey(message: string | undefined): string {
  if (!message) return "auth.errors.generic";
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "auth.errors.wrongCredentials";
  if (m.includes("email not confirmed")) return "auth.errors.emailNotConfirmed";
  if (m.includes("user already registered")) return "auth.errors.emailTaken";
  if (m.includes("password should be at least")) return "auth.errors.shortPassword";
  if (m.includes("rate limit") || m.includes("too many")) return "auth.errors.rateLimit";
  if (m.includes("network") || m.includes("fetch")) return "auth.errors.network";
  return "auth.errors.generic";
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
        return { errorKey: error ? mapAuthErrorKey(error.message) : null };
      },
      signIn: async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { errorKey: error ? mapAuthErrorKey(error.message) : null };
      },
      signInWithApple,
      signInWithGoogle,
      signOut: async () => {
        const { error } = await supabase.auth.signOut();
        return { errorKey: error ? mapAuthErrorKey(error.message) : null };
      },
    }),
    [session, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
