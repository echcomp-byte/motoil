import { I18nManager } from "react-native";
import * as Updates from "expo-updates";
import { getStoredLanguage } from "./storage";

// Aligns I18nManager with the user's stored language preference (or device
// default on first run). he → forceRTL(true), en → forceRTL(false). If the
// native flag already matches, no-op (avoids reload loops). Call sites stay
// `ensureRTL()` with no args — the function reads stored preference itself,
// so wiring in app/_layout.tsx is unchanged.
export async function ensureRTL(): Promise<void> {
  const stored = await getStoredLanguage();
  const shouldBeRTL = stored === "en" ? false : true; // default to Hebrew/RTL
  if (I18nManager.isRTL === shouldBeRTL) return;
  I18nManager.allowRTL(shouldBeRTL);
  I18nManager.forceRTL(shouldBeRTL);
  try {
    await Updates.reloadAsync();
  } catch {
    // No-op in dev / Expo Go: forceRTL takes effect on next manual reload.
  }
}
