/**
 * MotoIL — Design Tokens
 *
 * Single source of truth for visual primitives. Theme-agnostic: contains
 * palette scales, spacing, radius, typography, shadows, motion, and touch
 * sizes. Theme-resolved colors (light/dark) are mapped in colors.ts.
 *
 * Derived from the MotoIL Design System CSS reference. RN-specific notes:
 *   - shadows are split into iOS (shadowColor/Offset/Opacity/Radius) +
 *     Android (elevation). Use spread: <View style={[styles.x, shadow.md]} />.
 *   - motion is durations + a single "ease-out" easing tuple (Bezier).
 *     react-native-reanimated callers can pass these into Easing.bezier(...).
 *   - hit areas in pixels, not points — RN uses logical px by default.
 */

// ============================================================
// PALETTE — raw color scales
// ============================================================

export const palette = {
  // Brand red. Anchored on #E53935 ("MotoIL Red").
  red: {
    50: "#FFF3F2",
    100: "#FFE1DE",
    200: "#FFBFB9",
    300: "#FF8E85",
    400: "#F45A50",
    500: "#E53935",
    600: "#C92C29",
    700: "#A52320",
    800: "#7C1A18",
    900: "#4F100F",
  },
  // Warm neutrals ("asphalt-warm"). Surfaces feel human, not clinical.
  neutral: {
    0: "#FFFFFF",
    50: "#FAF7F5",
    100: "#F2EDEA",
    200: "#E6DFDB",
    300: "#D5CBC5",
    400: "#ACA098",
    500: "#7E736C",
    600: "#5B524C",
    700: "#403A35",
    800: "#2A2522",
    900: "#1A1613",
    950: "#110E0C",
  },
  // Support semantics — garage healthy / part nearing EOL / routes-info.
  green: {
    50: "#E8F6EE",
    500: "#2E9E5B",
  },
  amber: {
    50: "#FCF1E0",
    500: "#E8911C",
  },
  blue: {
    50: "#E9F0FB",
    500: "#2F6FD0",
  },
} as const;

// ============================================================
// SPACING — 4px grid
// ============================================================

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

// ============================================================
// RADIUS
// ============================================================

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 28,
  pill: 999,
} as const;

// ============================================================
// TYPOGRAPHY
// ============================================================

export const typography = {
  fontFamily: {
    // Hebrew-first fans-serif. Assistant + Heebo cover full Hebrew range and
    // mix well with Latin. system-ui falls back to .SF UI Text (iOS) and
    // Roboto (Android) which both render Hebrew acceptably.
    sans: "Assistant, Heebo, system-ui, -apple-system, sans-serif",
    mono: "Menlo, SF Mono, JetBrainsMono, monospace",
  },
  // Each scale: font-size, line-height, font-weight (string per RN convention).
  display: { fontSize: 34, lineHeight: 40, fontWeight: "800" as const },
  title: { fontSize: 26, lineHeight: 32, fontWeight: "700" as const },
  h2: { fontSize: 20, lineHeight: 26, fontWeight: "700" as const },
  subhead: { fontSize: 17, lineHeight: 24, fontWeight: "600" as const },
  body: { fontSize: 16, lineHeight: 24, fontWeight: "400" as const },
  label: { fontSize: 14, lineHeight: 20, fontWeight: "600" as const },
  micro: { fontSize: 12, lineHeight: 16, fontWeight: "700" as const },
} as const;

// ============================================================
// SHADOW — warm-tinted, never pure black
// ============================================================

// Color seed for shadow tints. rgba(42,30,26) — warm asphalt, not RGB black.
// Android elevation uses the OS tint and ignores shadowColor, so the warm
// tint applies on iOS only; Android stays platform-default.

export type ShadowStyle = {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
};

export type ShadowSet = {
  sm: ShadowStyle;
  md: ShadowStyle;
  lg: ShadowStyle;
  primary: ShadowStyle;
};

export const shadow: ShadowSet = {
  sm: {
    shadowColor: "#2A1E1A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#2A1E1A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  lg: {
    shadowColor: "#2A1E1A",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 8,
  },
  primary: {
    shadowColor: palette.red[500],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 22,
    elevation: 6,
  },
};

// Dark-mode shadow overrides. Dark surfaces need a stronger black to read,
// the warm tint reads as low-contrast smudge in low-light.
export const shadowDark: ShadowSet = {
  sm: { ...shadow.sm, shadowColor: "#000000", shadowOpacity: 0.4 },
  md: { ...shadow.md, shadowColor: "#000000", shadowOpacity: 0.45 },
  lg: { ...shadow.lg, shadowColor: "#000000", shadowOpacity: 0.55 },
  primary: { ...shadow.primary, shadowColor: "#EF5350", shadowOpacity: 0.34 },
};

// ============================================================
// MOTION
// ============================================================

export const motion = {
  // Bezier control points for ease-out — usable directly with reanimated's
  // Easing.bezier(...args).
  easeOut: [0.16, 1, 0.3, 1] as const,
  // Durations in ms.
  durFast: 140,
  durBase: 220,
  durSlow: 360,
} as const;

// ============================================================
// TOUCH — never go below min; comfort is the glove-friendly default
// ============================================================

export const touchSize = {
  min: 44, // iOS HIG minimum
  comfort: 56, // default for buttons + form fields (gloves)
} as const;

// ============================================================
// Type exports for consumers
// ============================================================

export type Palette = typeof palette;
export type Spacing = typeof spacing;
export type Radius = typeof radius;
export type Typography = typeof typography;
export type Shadow = ShadowSet;
export type Motion = typeof motion;
export type TouchSize = typeof touchSize;
