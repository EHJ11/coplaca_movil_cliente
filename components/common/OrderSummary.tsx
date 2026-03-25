import { Text, View, StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT } from '@/constants/colors';

interface OrderSummaryProps {
  subtotal: number;
  tax?: number;
  shippingCost?: number;
  total: number;
  itemCount: number;
}

export default function OrderSummary({
  subtotal,
  tax = 0,
  shippingCost = 0,
  total,
  itemCount,
}: OrderSummaryProps) {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Resumen del Pedido</Text>
        <View style={styles.divider} />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>{itemCount} producto(s)</Text>
        <Text style={styles.value}>{subtotal.toFixed(2)}€</Text>
      </View>

      {tax > 0 && (
        <View style={styles.row}>
          <Text style={styles.label}>Impuestos</Text>
          <Text style={styles.value}>{tax.toFixed(2)}€</Text>
        </View>
      )}

      {shippingCost > 0 && (
        <View style={styles.row}>
          <Text style={styles.label}>Envío</Text>
          <Text style={styles.value}>{shippingCost.toFixed(2)}€</Text>
        </View>
      )}

      <View style={[styles.row, styles.totalRow]}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{total.toFixed(2)}€</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginVertical: SPACING.md,
  },
  section: {
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.dark,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginTop: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  label: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
    fontWeight: FONT_WEIGHT.normal,
  },
  value: {
    fontSize: FONT_SIZE.md,
    color: COLORS.dark,
    fontWeight: FONT_WEIGHT.semibold,
  },
  totalRow: {
    borderBottomWidth: 0,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.light,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.sm,
  },
  totalLabel: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.dark,
  },
  totalValue: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
  },
});
