import * as AppleAuthentication from "expo-apple-authentication";
import { Platform } from "react-native";
import { supabase } from "@/lib/supabase";

export type OAuthResult = { errorKey: string | null };

export async function signInWithApple(): Promise<OAuthResult> {
  if (Platform.OS !== "ios") {
    return { errorKey: "auth.errors.appleUnavailable" };
  }

  const available = await AppleAuthentication.isAvailableAsync();
  if (!available) {
    return { errorKey: "auth.errors.appleUnavailable" };
  }

  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    if (!credential.identityToken) {
      return { errorKey: "auth.errors.appleNoToken" };
    }

    const { error } = await supabase.auth.signInWithIdToken({
      provider: "apple",
      token: credential.identityToken,
    });
    if (error) return { errorKey: "auth.errors.generic" };
    return { errorKey: null };
  } catch (e) {
    const code = (e as { code?: string })?.code;
    if (code === "ERR_REQUEST_CANCELED" || code === "ERR_CANCELED") {
      return { errorKey: null };
    }
    return { errorKey: "auth.errors.appleFailed" };
  }
}
