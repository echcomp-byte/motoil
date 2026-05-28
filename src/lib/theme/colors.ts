export const lightColors = {
  bg: "#FFFFFF",
  surface: "#F5F5F7",
  text: "#0A0A0A",
  textMuted: "#6B6B6B",
  border: "#E0E0E0",
  primary: "#E53935",
  primaryText: "#FFFFFF",
  danger: "#D32F2F",
  success: "#388E3C",
} as const;

export const darkColors = {
  bg: "#0A0A0A",
  surface: "#1A1A1A",
  text: "#F5F5F5",
  textMuted: "#9A9A9A",
  border: "#2A2A2A",
  primary: "#EF5350",
  primaryText: "#FFFFFF",
  danger: "#EF5350",
  success: "#66BB6A",
} as const;

export type Colors = { readonly [K in keyof typeof lightColors]: string };
