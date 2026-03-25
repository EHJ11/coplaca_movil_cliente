import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT } from '@/constants/colors';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface MessageAlertProps {
  message: string;
  type?: AlertType;
  onClose?: () => void;
  isVisible: boolean;
}

export default function MessageAlert({
  message,
  type = 'info',
  onClose,
  isVisible,
}: MessageAlertProps) {
  if (!isVisible) return null;

  const config = {
    success: {
      backgroundColor: '#D4EDDA',
      borderColor: '#2ECC71',
      textColor: COLORS.dark,
      icon: 'check-circle',
      iconColor: '#2ECC71',
    },
    error: {
      backgroundColor: '#F8D7DA',
      borderColor: COLORS.warning,
      textColor: COLORS.dark,
      icon: 'error',
      iconColor: COLORS.warning,
    },
    warning: {
      backgroundColor: '#FFF3CD',
      borderColor: '#FFC107',
      textColor: COLORS.dark,
      icon: 'warning',
      iconColor: '#FFC107',
    },
    info: {
      backgroundColor: '#D1ECF1',
      borderColor: '#17A2B8',
      textColor: COLORS.dark,
      icon: 'info',
      iconColor: '#17A2B8',
    },
  };

  const currentConfig = config[type];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: currentConfig.backgroundColor, borderColor: currentConfig.borderColor },
      ]}
    >
      <MaterialIcons name={currentConfig.icon as any} size={20} color={currentConfig.iconColor} />
      <Text style={[styles.message, { color: currentConfig.textColor }]}>{message}</Text>
      {onClose && (
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <MaterialIcons name="close" size={20} color={currentConfig.textColor} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginVertical: SPACING.sm,
    gap: SPACING.md,
  },
  message: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.normal,
  },
  closeBtn: {
    padding: SPACING.xs,
  },
});
