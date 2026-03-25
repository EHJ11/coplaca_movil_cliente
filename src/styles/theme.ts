/**
 * Centralized theme configuration
 */

import { Platform } from "react-native";
import { StatusColors, ThemeColors } from "./colors";
import { BorderRadius, Shadows, Spacing } from "./spacing";
import { FontWeights, Typography } from "./typography";

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Consolas, 'Courier New', monospace",
  },
}) ?? {
  sans: "normal",
  serif: "serif",
  rounded: "normal",
  mono: "monospace",
};

export const Theme = {
  colors: ThemeColors,
  statusColors: StatusColors,
  typography: Typography,
  fontWeights: FontWeights,
  spacing: Spacing,
  borderRadius: BorderRadius,
  shadows: Shadows,
  fonts: Fonts,
};

export type ThemeType = typeof Theme;
