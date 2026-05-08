export const colors = {
  // Base surfaces
  bgRoot: "#050608",
  bgBase: "#07080B",
  vignette: "#000",

  // Brand
  brandMint: "#76F6D1",
  brandMintText: "#BFF9EA",
  accentGreen: "#4ADE80",
  accentGreenGlow: "#22C55E",
  accentTealGlow: "#10B981",

  // Utility
  dotRed: "#FF3B30",
  white: "#FFFFFF",

  // Input
inputIconDefault: "#555555",       // default icon color when field is not focused
inputPlaceholder: "#3A3A3A",       // placeholder text color inside inputs

  // Reusable translucent backgrounds/borders
  mintBg10: "rgba(118, 246, 209, 0.10)",
  mintBorder28: "rgba(118, 246, 209, 0.28)",
  mintBg09: "rgba(118,246,209,0.09)",
  mintBorder24: "rgba(118,246,209,0.24)",

  textWhite70: "rgba(255,255,255,0.70)",
  textWhite75: "rgba(255,255,255,0.75)",
  textWhite60: "rgba(255,255,255,0.6)",
  textWhite55: "rgba(255,255,255,0.55)",
  textWhite45: "rgba(255,255,255,0.45)",
  textWhite40: "rgba(255,255,255,0.4)",
  textWhite32: "rgba(255,255,255,0.32)",
  textWhite30: "rgba(255,255,255,0.3)",

  cardBg04: "rgba(255,255,255,0.04)",
  cardBorder07: "rgba(255,255,255,0.07)",
  inputBg05: "rgba(255,255,255,0.05)",
  inputBorder08: "rgba(255,255,255,0.08)",
  googleBorder10: "rgba(255,255,255,0.10)",

  inputFocusBorder45: "rgba(74,222,128,0.45)",
  inputFocusBg04: "rgba(74,222,128,0.04)",
  buttonIconBg15: "rgba(5,6,8,0.15)",
};

export const spacing = {
  xs: 8,
  sm: 10,
  md: 12,
  lg: 14,
  xl: 18,
  "2xl": 22,
  "3xl": 24,
  "4xl": 28,
  "5xl": 32,
  "6xl": 36,
  "7xl": 40,
};

export const radii = {
  sm: 12,
  md: 14,
  lg: 20,
  xl: 50,
  round: 999,
};

export const typography = {
  letterSpacingSm: 0.1,
  letterSpacingMd: 0.2,
  letterSpacingLg: 0.25,
  letterSpacingXl: 0.3,

  // Sizes
  xs: 11.5,
  sm: 12,
  md: 13,
  base: 14,
  lg: 15,
  xl: 20,
  brandHome: 34,
  brandAuth: 26,
};

export const shadows = {
  greenButton: {
    shadowColor: colors.accentGreenGlow,
    shadowOpacity: 0.45,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  greenButtonCompact: {
    shadowColor: colors.accentGreenGlow,
    shadowOpacity: 0.4,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
  },
  redDot: {
    shadowColor: colors.dotRed,
    shadowOpacity: 0.45,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
};

/** Tokens for navigation chrome (tabs, drawers) — preserves dark premium baseline */
export const navigation = {
  tabBarActive: colors.accentGreen,
  tabBarInactive: colors.textWhite40,
  tabBarBorder: colors.cardBorder07,
  tabBarBg: colors.bgRoot,
  headerUnderline: colors.cardBorder07,
  drawerTintActive: colors.accentGreen,
  drawerTintInactive: colors.textWhite60,
};

export const theme = { colors, spacing, radii, typography, shadows, navigation };

