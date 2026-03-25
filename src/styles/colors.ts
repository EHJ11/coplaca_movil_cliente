/**
 * Centralized color definitions for light and dark modes
 */


const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const ThemeColors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    border: "#e0e0e0",
    success: "#4CAF50",
    error: "#f44336",
    warning: "#ff9800",
    info: "#2196F3",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    border: "#333333",
    success: "#66BB6A",
    error: "#ef5350",
    warning: "#ffb74d",
    info: "#64B5F6",
  },
};

export const StatusColors = {
  pending: "#ff9800",
  completed: "#4CAF50",
  cancelled: "#f44336",
  shipped: "#2196F3",
};
