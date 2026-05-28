import { createContext, useMemo, type ReactNode } from "react";
import { useColorScheme } from "react-native";
import { darkColors, lightColors, type Colors } from "./colors";

export type ColorScheme = "light" | "dark";

export type ThemeContextValue = {
  colors: Colors;
  isDark: boolean;
  scheme: ColorScheme;
};

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const scheme: ColorScheme = useColorScheme() === "dark" ? "dark" : "light";
  const isDark = scheme === "dark";

  const value = useMemo<ThemeContextValue>(
    () => ({
      colors: isDark ? darkColors : lightColors,
      isDark,
      scheme,
    }),
    [isDark, scheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
