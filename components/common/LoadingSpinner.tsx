import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '@/constants/colors';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({
  size = 'large',
  color = COLORS.primary,
  fullScreen = false,
}: LoadingSpinnerProps) {
  if (fullScreen) {
    return (
      <View style={styles.fullScreen}>
        <View style={styles.spinnerBox}>
          <ActivityIndicator size={size} color={color} />
        </View>
      </View>
    );
  }

  return <ActivityIndicator size={size} color={color} style={styles.inline} />;
}

const styles = StyleSheet.create({
  inline: {
    marginVertical: SPACING.md,
  },
  fullScreen: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  spinnerBox: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: 'white',
  },
});
