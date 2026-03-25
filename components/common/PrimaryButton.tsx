import { Text, TouchableOpacity, View, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT } from '@/constants/colors';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
}

export default function PrimaryButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  icon,
  variant = 'primary',
  size = 'medium',
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;

  const variantStyles = {
    primary: {
      backgroundColor: COLORS.primary,
      borderColor: COLORS.primary,
      textColor: 'white',
    },
    secondary: {
      backgroundColor: 'white',
      borderColor: COLORS.primary,
      textColor: COLORS.primary,
    },
    danger: {
      backgroundColor: COLORS.warning,
      borderColor: COLORS.warning,
      textColor: 'white',
    },
  };

  const sizeStyles = {
    small: {
      padding: SPACING.sm,
      fontSize: FONT_SIZE.sm,
    },
    medium: {
      padding: SPACING.md,
      fontSize: FONT_SIZE.md,
    },
    large: {
      padding: SPACING.lg,
      fontSize: FONT_SIZE.lg,
    },
  };

  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: isDisabled ? COLORS.textLight : currentVariant.backgroundColor,
          borderColor: currentVariant.borderColor,
          borderWidth: variant === 'secondary' ? 1.5 : 0,
          paddingVertical: currentSize.padding,
        },
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={currentVariant.textColor} size="small" />
        ) : (
          <>
            {icon && (
              <MaterialIcons name={icon as any} size={20} color={currentVariant.textColor} />
            )}
            <Text
              style={[
                styles.text,
                {
                  color: isDisabled ? 'white' : currentVariant.textColor,
                  fontSize: currentSize.fontSize,
                },
              ]}
            >
              {title}
            </Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: SPACING.sm,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  text: {
    fontWeight: FONT_WEIGHT.semibold,
  },
});
