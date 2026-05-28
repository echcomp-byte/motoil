import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { supabase } from "@/lib/supabase";

export type OAuthResult = { errorKey: string | null };

let configured = false;

function ensureConfigured(): { ok: true } | { ok: false; errorKey: string } {
  if (configured) return { ok: true };
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  if (!iosClientId || !webClientId) {
    return { ok: false, errorKey: "auth.errors.googleNotConfigured" };
  }
  GoogleSignin.configure({
    iosClientId,
    webClientId,
    scopes: ["openid", "email", "profile"],
  });
  configured = true;
  return { ok: true };
}

export async function signInWithGoogle(): Promise<OAuthResult> {
  const config = ensureConfigured();
  if (!config.ok) return { errorKey: config.errorKey };

  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await GoogleSignin.signIn();

    if (response.type === "cancelled") {
      return { errorKey: null };
    }

    const idToken = response.data?.idToken;
    if (!idToken) {
      return { errorKey: "auth.errors.googleNoToken" };
    }

    const { error } = await supabase.auth.signInWithIdToken({
      provider: "google",
      token: idToken,
    });
    if (error) return { errorKey: "auth.errors.generic" };
    return { errorKey: null };
  } catch (e) {
    if (isErrorWithCode(e)) {
      if (e.code === statusCodes.SIGN_IN_CANCELLED) return { errorKey: null };
      if (e.code === statusCodes.IN_PROGRESS) return { errorKey: "auth.errors.googleInProgress" };
      if (e.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        return { errorKey: "auth.errors.googlePlayServices" };
      }
    }
    return { errorKey: "auth.errors.googleFailed" };
  }
}
