import { beforeEach, describe, expect, it, vi } from "vitest";

// Backing map for the AsyncStorage mock — reset between tests.
const disk: Record<string, string> = {};

vi.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: vi.fn(async (key: string) => disk[key] ?? null),
    setItem: vi.fn(async (key: string, value: string) => {
      disk[key] = value;
    }),
    removeItem: vi.fn(async (key: string) => {
      delete disk[key];
    }),
  },
}));

vi.mock("@/lib/analytics", () => ({ track: vi.fn() }));

const SEEN_KEY = "motoil:hasSeenOnboarding";
const INSTALL_KEY = "motoil:installFiredAt";

// Re-import fresh per test so the module-level store (value + `hydrated` flag)
// starts clean. resetModules() drops the cached module; the vi.mock factories
// above still apply to the new instance.
async function freshStore() {
  vi.resetModules();
  const mod = await import("./storage");
  return mod.__onboardingStore;
}

beforeEach(() => {
  for (const key of Object.keys(disk)) delete disk[key];
});

describe("onboarding shared store", () => {
  it("hydrates from AsyncStorage on first subscribe", async () => {
    disk[SEEN_KEY] = "1";
    const store = await freshStore();
    expect(store.getSnapshot()).toBeNull(); // not yet hydrated

    store.subscribe(() => {});
    await Promise.resolve(); // let the getItem promise settle
    expect(store.getSnapshot()).toBe(true);
  });

  it("treats a missing key as not-seen (false)", async () => {
    const store = await freshStore();
    store.subscribe(() => {});
    await Promise.resolve();
    expect(store.getSnapshot()).toBe(false);
  });

  it("markSeen flips the value for ALL subscribers (the loop regression)", async () => {
    const store = await freshStore();
    const guard = vi.fn(); // stands in for RootGuard
    const screen = vi.fn(); // stands in for LetsBeginScreen
    store.subscribe(guard);
    store.subscribe(screen);
    await Promise.resolve();
    guard.mockClear();
    screen.mockClear();

    await store.markSeen();

    // One shared value — every consumer observes the flip, no relaunch needed.
    expect(store.getSnapshot()).toBe(true);
    expect(guard).toHaveBeenCalled();
    expect(screen).toHaveBeenCalled();
    expect(disk[SEEN_KEY]).toBe("1");
  });

  it("reset flips shared value back to false and clears both storage keys", async () => {
    disk[SEEN_KEY] = "1";
    disk[INSTALL_KEY] = "2026-06-05T00:00:00.000Z";
    const store = await freshStore();
    const guard = vi.fn();
    store.subscribe(guard);
    await Promise.resolve();
    guard.mockClear();

    await store.reset();

    expect(store.getSnapshot()).toBe(false);
    expect(guard).toHaveBeenCalled();
    expect(disk[SEEN_KEY]).toBeUndefined();
    expect(disk[INSTALL_KEY]).toBeUndefined();
  });

  it("does not notify when the value is unchanged", async () => {
    disk[SEEN_KEY] = "1";
    const store = await freshStore();
    const guard = vi.fn();
    store.subscribe(guard);
    await Promise.resolve();
    guard.mockClear();

    await store.markSeen(); // already true → no-op emit
    expect(guard).not.toHaveBeenCalled();
  });

  it("unsubscribe stops further notifications", async () => {
    const store = await freshStore();
    const guard = vi.fn();
    const unsubscribe = store.subscribe(guard);
    await Promise.resolve();
    guard.mockClear();

    unsubscribe();
    await store.markSeen();
    expect(guard).not.toHaveBeenCalled();
  });
});
