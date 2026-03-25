import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ProductDTO } from '@/services/api';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT } from '@/constants/colors';

interface ProductCardProps {
  product: ProductDTO;
  quantity: string;
  onQuantityChange: (qty: string) => void;
  onAdd: () => void;
  onLike?: () => void;
  imageUrl: string;
}

export default function ProductCard({
  product,
  quantity,
  onQuantityChange,
  onAdd,
  onLike,
  imageUrl,
}: ProductCardProps) {
  const hasDiscount = product.discount !== undefined && product.discount > 0;
  const hasLowStock = (product.stock || 0) <= 5 && product.stock !== undefined && product.stock > 0;
  const isOutOfStock = (product.stock || 0) === 0;
  const basePrice = product.price ?? product.unitPrice;

  const discountedPrice = hasDiscount
    ? (basePrice * (1 - (product.discount || 0) / 100)).toFixed(2)
    : basePrice.toFixed(2);

  return (
    <View style={styles.card}>
      {/* Imagen */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        {hasDiscount && (
          <View style={styles.offerBadge}>
            <Text style={styles.offerText}>-{product.discount}%</Text>
          </View>
        )}
        {hasLowStock && !hasDiscount && (
          <View style={styles.lowStockBadge}>
            <Text style={styles.lowStockText}>Bajo stock</Text>
          </View>
        )}
        {isOutOfStock && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>Agotado</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.category}>{product.categoryName || 'Otros'}</Text>

        {/* Precio */}
        <View style={styles.priceContainer}>
          <Text style={hasDiscount ? styles.originalPrice : styles.price}>
            {basePrice.toFixed(2)}€
          </Text>
          {hasDiscount && <Text style={styles.discountedPrice}>{discountedPrice}€</Text>}
        </View>

        {/* Controles */}
        {!isOutOfStock && (
          <View style={styles.controls}>
            <View style={styles.quantityInput}>
              <TextInput
                style={styles.qtyField}
                value={quantity}
                onChangeText={onQuantityChange}
                keyboardType="number-pad"
                placeholder="1"
              />
              <Text style={styles.unit}>x</Text>
            </View>
            <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
              <MaterialIcons name="add-shopping-cart" size={18} color="white" />
              <Text style={styles.addBtnText}>Añadir</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    backgroundColor: 'white',
    marginHorizontal: SPACING.sm,
    marginVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 140,
    backgroundColor: COLORS.light,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  offerBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: COLORS.warning,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  offerText: {
    color: 'white',
    fontWeight: FONT_WEIGHT.bold,
    fontSize: FONT_SIZE.sm,
  },
  lowStockBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: COLORS.secondary,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  lowStockText: {
    color: 'white',
    fontWeight: FONT_WEIGHT.bold,
    fontSize: FONT_SIZE.xs,
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockText: {
    color: 'white',
    fontWeight: FONT_WEIGHT.bold,
    fontSize: FONT_SIZE.lg,
  },
  info: {
    padding: SPACING.md,
  },
  name: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.dark,
  },
  category: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginVertical: SPACING.md,
  },
  price: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
  },
  originalPrice: {
    fontSize: FONT_SIZE.sm,
    textDecorationLine: 'line-through',
    color: COLORS.textLight,
  },
  discountedPrice: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.warning,
  },
  controls: {
    flexDirection: 'row',
    gap: SPACING.sm,
    alignItems: 'center',
  },
  quantityInput: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.light,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
  },
  qtyField: {
    flex: 1,
    height: 32,
    fontSize: FONT_SIZE.md,
  },
  unit: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
  },
  addBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  addBtnText: {
    color: 'white',
    fontWeight: FONT_WEIGHT.semibold,
    fontSize: FONT_SIZE.sm,
  },
});
