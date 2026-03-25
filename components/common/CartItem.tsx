import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT } from '@/constants/colors';

interface CartItemProps {
  id: number;
  name: string;
  price: number;
  quantity: number;
  total: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

export default function CartItem({
  name,
  price,
  quantity,
  total,
  onIncrement,
  onDecrement,
  onRemove,
}: CartItemProps) {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>
            {name}
          </Text>
          <Text style={styles.price}>{price.toFixed(2)}€/u</Text>
        </View>

        <View style={styles.quantity}>
          <TouchableOpacity onPress={onDecrement} style={styles.qtyBtn}>
            <MaterialIcons name="remove" size={18} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{quantity}</Text>
          <TouchableOpacity onPress={onIncrement} style={styles.qtyBtn}>
            <MaterialIcons name="add" size={18} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.rightSection}>
          <Text style={styles.total}>{total.toFixed(2)}€</Text>
          <TouchableOpacity onPress={onRemove} style={styles.deleteBtn}>
            <MaterialIcons name="delete-outline" size={18} color={COLORS.warning} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.dark,
  },
  price: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  quantity: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.sm,
  },
  qtyBtn: {
    padding: SPACING.xs,
  },
  qtyText: {
    marginHorizontal: SPACING.md,
    fontWeight: FONT_WEIGHT.semibold,
    fontSize: FONT_SIZE.md,
  },
  rightSection: {
    alignItems: 'flex-end',
    gap: SPACING.sm,
  },
  total: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
  },
  deleteBtn: {
    padding: SPACING.xs,
  },
});
