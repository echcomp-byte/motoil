import { I18nManager } from "react-native";
import * as Updates from "expo-updates";

export async function ensureRTL(): Promise<void> {
  if (I18nManager.isRTL) return;
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
  try {
    await Updates.reloadAsync();
  } catch {
    // No-op in dev / Expo Go: forceRTL takes effect on next manual reload.
  }
}
