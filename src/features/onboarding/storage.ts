import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const KEY = "motoil:hasSeenOnboarding";

// hasSeenOnboarding lives in AsyncStorage (per-device), not Supabase. Privacy:
// onboarding completion is UX state, not profile data — it never leaves the device.
export function useHasSeenOnboarding() {
  const [value, setValue] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => setValue(raw === "1"))
      .catch(() => setValue(false));
  }, []);

  const markSeen = useCallback(async () => {
    await AsyncStorage.setItem(KEY, "1");
    setValue(true);
  }, []);

  const reset = useCallback(async () => {
    await AsyncStorage.removeItem(KEY);
    setValue(false);
  }, []);

  return { value, markSeen, reset };
}
