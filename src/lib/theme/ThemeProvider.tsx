import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useColorScheme } from "react-native";
import { darkColors, lightColors, type Colors } from "./colors";
import {
  motion,
  radius,
  shadow,
  shadowDark,
  spacing,
  touchSize,
  typography,
  type Motion,
  type Radius,
  type Shadow,
  type Spacing,
  type TouchSize,
  type Typography,
} from "./tokens";

export type ColorScheme = "light" | "dark";
export type ThemeMode = "system" | "light" | "dark";

const MODE_KEY = "motoil:themeMode";

export type ThemeContextValue = {
  colors: Colors;
  spacing: Spacing;
  radius: Radius;
  typography: Typography;
  shadow: Shadow;
  motion: Motion;
  touchSize: TouchSize;
  isDark: boolean;
  scheme: ColorScheme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => Promise<void>;
};

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const device: ColorScheme = useColorScheme() === "dark" ? "dark" : "light";
  // Default to "system" synchronously; load stored preference after mount. A
  // brief one-frame flash is possible on cold start when stored mode differs
  // from device — acceptable trade-off vs. blocking app render on storage.
  const [mode, setModeState] = useState<ThemeMode>("system");

  useEffect(() => {
    AsyncStorage.getItem(MODE_KEY)
      .then((raw) => {
        if (raw === "light" || raw === "dark" || raw === "system") {
          setModeState(raw);
        }
      })
      .catch(() => {
        // storage unavailable — stay on "system"
      });
  }, []);

  const setMode = useCallback(async (next: ThemeMode) => {
    setModeState(next);
    await AsyncStorage.setItem(MODE_KEY, next);
  }, []);

  const scheme: ColorScheme = mode === "system" ? device : mode;
  const isDark = scheme === "dark";

  const value = useMemo<ThemeContextValue>(
    () => ({
      colors: isDark ? darkColors : lightColors,
      spacing,
      radius,
      typography,
      shadow: isDark ? shadowDark : shadow,
      motion,
      touchSize,
      isDark,
      scheme,
      mode,
      setMode,
    }),
    [isDark, scheme, mode, setMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
