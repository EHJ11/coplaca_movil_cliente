/**
 * Common styled Text component
 */

import { useThemeColor } from "@/hooks/use-theme-color";
import { Typography } from "@/src/styles/typography";
import { StyleSheet, Text, type TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "body"
    | "bodyBold"
    | "subtitle"
    | "caption"
    | "button";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "body",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[
        { color },
        type === "h1" ? styles.h1 : undefined,
        type === "h2" ? styles.h2 : undefined,
        type === "h3" ? styles.h3 : undefined,
        type === "h4" ? styles.h4 : undefined,
        type === "body" ? styles.body : undefined,
        type === "bodyBold" ? styles.bodyBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "caption" ? styles.caption : undefined,
        type === "button" ? styles.button : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  h1: {
    ...Typography.h1,
  },
  h2: {
    ...Typography.h2,
  },
  h3: {
    ...Typography.h3,
  },
  h4: {
    ...Typography.h4,
  },
  body: {
    ...Typography.body,
  },
  bodyBold: {
    ...Typography.bodyBold,
  },
  subtitle: {
    ...Typography.subtitle,
  },
  caption: {
    ...Typography.caption,
  },
  button: {
    ...Typography.button,
  },
});
