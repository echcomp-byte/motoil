import AsyncStorage from "@react-native-async-storage/async-storage";

export const LANGUAGE_KEY = "motoil:language";
export type Language = "he" | "en";

export async function getStoredLanguage(): Promise<Language | null> {
  try {
    const raw = await AsyncStorage.getItem(LANGUAGE_KEY);
    return raw === "he" || raw === "en" ? raw : null;
  } catch {
    return null;
  }
}

export async function setStoredLanguage(lang: Language): Promise<void> {
  await AsyncStorage.setItem(LANGUAGE_KEY, lang);
}
