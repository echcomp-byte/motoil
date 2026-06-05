import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useSyncExternalStore } from "react";
import { track } from "@/lib/analytics";

const SEEN_KEY = "motoil:hasSeenOnboarding";
const INSTALL_KEY = "motoil:installFiredAt";

// hasSeenOnboarding lives in AsyncStorage (per-device), not Supabase. Privacy:
// onboarding completion is UX state, not profile data — it never leaves the device.
//
// The in-memory value is a *single* module-level source of truth, exposed via
// useSyncExternalStore. Every consumer (RootGuard, LetsBeginScreen, Settings)
// reads and writes the same value, so markSeen()/reset() in one place re-renders
// the guard on the same pass — no relaunch needed.
//
// (Previously each useHasSeenOnboarding() owned its own useState + read
// AsyncStorage once on mount. LetsBeginScreen.markSeen() flipped only its own
// copy while RootGuard's copy stayed false → the guard bounced the user back to
// /(onboarding)/welcome, an infinite loop that only cleared on a cold relaunch
// when the guard re-read "1" from storage.)
type Listener = () => void;

const onboardingStore = (() => {
  let value: boolean | null = null;
  let hydrated = false;
  const listeners = new Set<Listener>();

  function emit() {
    for (const listener of listeners) listener();
  }

  function set(next: boolean | null) {
    if (value === next) return;
    value = next;
    emit();
  }

  return {
    subscribe(listener: Listener) {
      listeners.add(listener);
      // Hydrate from AsyncStorage on the first subscription only. Guard each
      // result on `value === null` so a write that lands mid-hydration (e.g. a
      // markSeen during the initial read) isn't clobbered by the stale disk value.
      if (!hydrated) {
        hydrated = true;
        AsyncStorage.getItem(SEEN_KEY)
          .then((raw) => {
            if (value === null) set(raw === "1");
          })
          .catch(() => {
            if (value === null) set(false);
          });
      }
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot() {
      return value;
    },
    async markSeen() {
      await AsyncStorage.setItem(SEEN_KEY, "1");
      set(true);
    },
    async reset() {
      await AsyncStorage.removeItem(SEEN_KEY);
      // Also clear the install marker so a "Restart onboarding" debug action
      // results in a fresh install fire on the next launch (matches PostHog semantics).
      await AsyncStorage.removeItem(INSTALL_KEY);
      set(false);
    },
  };
})();

// Exported for unit tests — the store's subscribe/getSnapshot/markSeen/reset
// surface, exercised without a React renderer.
export const __onboardingStore = onboardingStore;

export function useHasSeenOnboarding() {
  const value = useSyncExternalStore(
    onboardingStore.subscribe,
    onboardingStore.getSnapshot,
    onboardingStore.getSnapshot,
  );
  return { value, markSeen: onboardingStore.markSeen, reset: onboardingStore.reset };
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
