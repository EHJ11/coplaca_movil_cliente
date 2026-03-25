/**
 * Reusable Input component
 */

import { useThemeColor } from "@/hooks/use-theme-color";
import { BorderRadius, Spacing } from "@/src/styles/spacing";
import react from "react";
import { StyleSheet, TextInput, type TextInputProps, View } from "react-native";

export interface InputProps extends TextInputProps {
  readonly error?: string;
}

const Input: react.FC<Readonly<InputProps>> = ({ error, style, ...props }) => {
  const borderColor = useThemeColor(
    { light: "#e0e0e0", dark: "#333333" },
    "icon",
  );
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");

  return (
    <View>
      <TextInput
        style={[
          styles.input,
          {
            borderColor: error ? "#f44336" : borderColor,
            color: textColor,
            backgroundColor,
          },
          style,
        ]}
        placeholderTextColor={useThemeColor({}, "icon")}
        {...props}
      />
    </View>
  );
};

export { Input };

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    fontSize: 16,
  },
});
