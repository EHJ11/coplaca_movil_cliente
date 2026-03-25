/**
 * Reusable Button component
 */

import { useThemeColor } from "@/hooks/use-theme-color";
import { BorderRadius, Shadows, Spacing } from "@/src/styles/spacing";
import {
    StyleSheet,
    TouchableOpacity,
    type TouchableOpacityProps,
} from "react-native";
import { ThemedText } from "./ThemedText";

export interface ButtonProps extends TouchableOpacityProps {
  readonly label: string;
  readonly variant?: "primary" | "secondary" | "danger";
  readonly disabled?: boolean;
}

export function Button({
  label,
  variant = "primary",
  disabled = false,
  ...props
}: Readonly<ButtonProps>) {
  const tintColor = useThemeColor({}, "tint");
  const backgroundColor = useThemeColor({}, "background");

  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: tintColor,
        };
      case "secondary":
        return {
          backgroundColor: backgroundColor,
          borderColor: tintColor,
          borderWidth: 1,
        };
      case "danger":
        return {
          backgroundColor: "#f44336",
        };
      default:
        return { backgroundColor: tintColor };
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, getVariantStyles(), disabled && styles.disabled]}
      disabled={disabled}
      {...props}
    >
      <ThemedText
        type="button"
        lightColor={variant === "secondary" ? tintColor : "#fff"}
        darkColor={variant === "secondary" ? tintColor : "#fff"}
      >
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.light,
  },
  disabled: {
    opacity: 0.5,
  },
});
