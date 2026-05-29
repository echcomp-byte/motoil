/**
 * Theme-resolved color tokens. Light + dark variants share the same shape so
 * `useTheme().colors.X` is always defined regardless of scheme.
 *
 * Backward compat: the original 9 keys (bg, surface, text, textMuted, border,
 * primary, primaryText, danger, success) are preserved unchanged so existing
 * call sites keep compiling. New tokens are added alongside them — prefer
 * the richer set in new code.
 */

import { palette } from "./tokens";

export type Colors = {
  // -------- BACKWARD-COMPAT KEYS (do not remove) --------
  bg: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  primaryText: string;
  danger: string;
  success: string;

  // -------- NEW TOKENS --------
  bgElevated: string;
  surface2: string;
  surfaceSunk: string;
  borderStrong: string;
  text2: string;
  text3: string;
  textInv: string;
  primaryPress: string;
  primaryTint: string;
  onPrimary: string;
  warning: string;
  warningTint: string;
  successTint: string;
  info: string;
  infoTint: string;
  focus: string;
};

export const lightColors: Colors = {
  bg: palette.neutral[50],
  surface: palette.neutral[0],
  text: palette.neutral[900],
  textMuted: palette.neutral[600],
  border: palette.neutral[200],
  primary: palette.red[500],
  primaryText: "#FFFFFF",
  danger: palette.red[600],
  success: palette.green[500],

  bgElevated: palette.neutral[0],
  surface2: palette.neutral[100],
  surfaceSunk: palette.neutral[100],
  borderStrong: palette.neutral[300],

  text2: palette.neutral[600],
  text3: palette.neutral[500],
  textInv: palette.neutral[0],

  primaryPress: palette.red[600],
  primaryTint: palette.red[50],
  onPrimary: "#FFFFFF",

  warning: palette.amber[500],
  warningTint: palette.amber[50],
  successTint: palette.green[50],
  info: palette.blue[500],
  infoTint: palette.blue[50],

  focus: palette.red[500],
};

export const darkColors: Colors = {
  // -------- BACKWARD-COMPAT KEYS (do not remove) --------
  bg: "#161311",
  surface: "#211D1B",
  text: "#F6F1EE",
  textMuted: "#C4B9B2",
  border: "#38322E",
  primary: "#EF5350",
  primaryText: "#FFFFFF",
  danger: "#EF5350",
  success: "#44B978",

  // -------- NEW TOKENS --------
  bgElevated: "#211D1B",
  surface2: "#2A2522",
  surfaceSunk: "#110E0C",
  borderStrong: "#4A423D",

  text2: "#C4B9B2",
  text3: "#978C84",
  textInv: "#1A1613",

  primaryPress: "#F4756F",
  primaryTint: "#2E1A18",
  onPrimary: "#1A0F0E",

  warning: "#F2A63C",
  warningTint: "#2E2212",
  successTint: "#16291E",
  info: "#5B95E8",
  infoTint: "#102036",

  focus: "#EF5350",
};
