import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { track } from "@/lib/analytics";

const SEEN_KEY = "motoil:hasSeenOnboarding";
const INSTALL_KEY = "motoil:installFiredAt";

// hasSeenOnboarding lives in AsyncStorage (per-device), not Supabase. Privacy:
// onboarding completion is UX state, not profile data — it never leaves the device.
export function useHasSeenOnboarding() {
  const [value, setValue] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(SEEN_KEY)
      .then((raw) => setValue(raw === "1"))
      .catch(() => setValue(false));
  }, []);

  const markSeen = useCallback(async () => {
    await AsyncStorage.setItem(SEEN_KEY, "1");
    setValue(true);
  }, []);

  const reset = useCallback(async () => {
    await AsyncStorage.removeItem(SEEN_KEY);
    // Also clear the install marker so a "Restart onboarding" debug action
    // results in a fresh install fire on the next launch (matches PostHog semantics).
    await AsyncStorage.removeItem(INSTALL_KEY);
    setValue(false);
  }, []);

  return { value, markSeen, reset };
}

// Fires `install` exactly once per device — on the first launch where the
// `motoil:installFiredAt` marker is absent. Subsequent launches no-op. Called
// from the root layout so it runs before any screen mounts.
export function useFireInstallOnce() {
  useEffect(() => {
    AsyncStorage.getItem(INSTALL_KEY)
      .then((existing) => {
        if (existing) return;
        return AsyncStorage.setItem(INSTALL_KEY, new Date().toISOString()).then(() => {
          track("install");
        });
      })
      .catch(() => {
        // Storage unavailable on this device; the install event will retry on the next launch.
      });
  }, []);
}
