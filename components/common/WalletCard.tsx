import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT } from '@/constants/colors';

interface WalletCardProps {
  balance: number;
  onRecharge: () => void;
}

export default function WalletCard({ balance, onRecharge }: WalletCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <MaterialIcons name="account-balance-wallet" size={28} color={COLORS.primary} />
        <Text style={styles.label}>Saldo Disponible</Text>
      </View>
      <Text style={styles.amount}>{balance.toFixed(2)}€</Text>
      <TouchableOpacity style={styles.button} onPress={onRecharge}>
        <MaterialIcons name="add-circle" size={18} color="white" />
        <Text style={styles.buttonText}>Recargar Saldo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    fontWeight: FONT_WEIGHT.medium,
  },
  amount: {
    fontSize: FONT_SIZE.huge,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
    marginBottom: SPACING.lg,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  buttonText: {
    color: 'white',
    fontWeight: FONT_WEIGHT.semibold,
    fontSize: FONT_SIZE.md,
  },
});
