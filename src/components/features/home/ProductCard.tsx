/**
 * Product Card Component - Displays individual product
 */

import { ThemedText, ThemedView } from "@/src/components/common";
import { BorderRadius, Shadows, Spacing } from "@/src/styles/spacing";
import type { ProductDTO } from "@/src/types";
import { getProductImageUrl } from "@/src/utils/imageUtils";
import { getOfferByProduct } from "@/src/utils/productUtils";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

interface ProductCardProps {
  readonly product: ProductDTO;
  readonly onPress: (product: ProductDTO) => void;
  readonly onAddToCart?: (product: ProductDTO) => void;
}

export function ProductCard({
  product,
  onPress,
  onAddToCart,
}: ProductCardProps) {
  const offer = getOfferByProduct(product);
  const imageUrl = getProductImageUrl(product);

  return (
    <TouchableOpacity
      onPress={() => onPress(product)}
      style={styles.container}
      activeOpacity={0.7}
    >
      <ThemedView style={styles.card}>
        {/* Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
          {offer && (
            <View style={styles.offerBadge}>
              <ThemedText type="caption" lightColor="#fff" darkColor="#000">
                -{offer.discountPercentage}%
              </ThemedText>
            </View>
          )}
          <View style={styles.stockBadge}>
            <ThemedText type="caption" lightColor="#fff">
              {product.stockQuantity > 0 ? "En stock" : "Agotado"}
            </ThemedText>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <ThemedText type="subtitle" numberOfLines={2}>
            {product.name}
          </ThemedText>

          {product.description && (
            <ThemedText
              type="caption"
              numberOfLines={1}
              lightColor="#999"
              darkColor="#aaa"
            >
              {product.description}
            </ThemedText>
          )}

          {/* Price */}
          <View style={styles.priceContainer}>
            <ThemedText type="bodyBold" lightColor="#0a7ea4">
              ${product.unitPrice.toFixed(2)} / {product.unit}
            </ThemedText>
            {offer && product.originalPrice && (
              <ThemedText
                type="caption"
                lightColor="#999"
                darkColor="#aaa"
                style={styles.originalPrice}
              >
                ${product.originalPrice.toFixed(2)}
              </ThemedText>
            )}
          </View>

          {offer && (
            <ThemedText type="caption" lightColor="#ff9800" darkColor="#ffb74d">
              {offer.reason}
            </ThemedText>
          )}
        </View>

        {/* Button */}
        {onAddToCart && (
          <TouchableOpacity
            onPress={() => onAddToCart(product)}
            disabled={product.stockQuantity === 0}
            style={[
              styles.addButton,
              product.stockQuantity === 0 && styles.addButtonDisabled,
            ]}
          >
            <ThemedText type="button" lightColor="#fff">
              Agregar
            </ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: Spacing.sm,
  },
  card: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    ...Shadows.medium,
  },
  imageContainer: {
    width: "100%",
    height: 150,
    backgroundColor: "#f5f5f5",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  offerBadge: {
    position: "absolute",
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: "#ff9800",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  stockBadge: {
    position: "absolute",
    bottom: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  content: {
    padding: Spacing.md,
  },
  priceContainer: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  originalPrice: {
    textDecorationLine: "line-through",
    marginTop: Spacing.xs,
  },
  addButton: {
    backgroundColor: "#0a7ea4",
    paddingVertical: Spacing.md,
    alignItems: "center",
  },
  addButtonDisabled: {
    backgroundColor: "#ccc",
    opacity: 0.5,
  },
});
