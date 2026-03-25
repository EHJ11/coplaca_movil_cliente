/**
 * Product Filters Component
 */

import { Button, Input, ThemedText, ThemedView } from "@/src/components/common";
import { Spacing } from "@/src/styles/spacing";
import type { ProductFilters as ProductFiltersType } from "@/src/types";
import { ScrollView, StyleSheet, View } from "react-native";

interface ProductFiltersProps {
  readonly categories: string[];
  readonly filters: ProductFiltersType;
  readonly onFiltersChange: (filters: ProductFiltersType) => void;
  readonly onReset?: () => void;
}

export function ProductFilters({
  categories,
  filters,
  onFiltersChange,
  onReset,
}: ProductFiltersProps) {
  return (
    <ThemedView style={styles.container}>
      {/* Search */}
      <View style={styles.section}>
        <ThemedText type="subtitle">Buscar</ThemedText>
        <Input
          placeholder="Buscar productos..."
          value={filters.searchQuery}
          onChangeText={(text) =>
            onFiltersChange({ ...filters, searchQuery: text })
          }
          style={styles.input}
        />
      </View>

      {/* Category */}
      <View style={styles.section}>
        <ThemedText type="subtitle">Categoría</ThemedText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {categories.map((category) => (
            <Button
              key={category}
              label={category}
              variant={filters.category === category ? "primary" : "secondary"}
              onPress={() => onFiltersChange({ ...filters, category })}
              style={styles.categoryButton}
            />
          ))}
        </ScrollView>
      </View>

      {/* Filters Checkboxes */}
      <View style={styles.section}>
        <ThemedText type="subtitle">Opciones</ThemedText>
        <View style={styles.checkboxContainer}>
          {/* In Stock */}
          <Button
            label={`${filters.onlyInStock ? "✓" : "○"} Solo en Stock`}
            variant={filters.onlyInStock ? "primary" : "secondary"}
            onPress={() =>
              onFiltersChange({
                ...filters,
                onlyInStock: !filters.onlyInStock,
              })
            }
            style={styles.checkboxButton}
          />

          {/* Offers */}
          <Button
            label={`${filters.onlyOffers ? "✓" : "○"} Solo Ofertas`}
            variant={filters.onlyOffers ? "primary" : "secondary"}
            onPress={() =>
              onFiltersChange({
                ...filters,
                onlyOffers: !filters.onlyOffers,
              })
            }
            style={styles.checkboxButton}
          />

          {/* Fresh */}
          <Button
            label={`${filters.onlyFresh ? "✓" : "○"} Solo Fresco`}
            variant={filters.onlyFresh ? "primary" : "secondary"}
            onPress={() =>
              onFiltersChange({
                ...filters,
                onlyFresh: !filters.onlyFresh,
              })
            }
            style={styles.checkboxButton}
          />
        </View>
      </View>

      {/* Reset Button */}
      {onReset && (
        <Button
          label="Limpiar Filtros"
          variant="secondary"
          onPress={onReset}
          style={styles.resetButton}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  input: {
    marginTop: Spacing.md,
  },
  categoryScroll: {
    marginTop: Spacing.md,
    marginHorizontal: -Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  categoryButton: {
    marginRight: Spacing.md,
  },
  checkboxContainer: {
    marginTop: Spacing.md,
    gap: Spacing.md,
  },
  checkboxButton: {
    marginVertical: Spacing.sm,
  },
  resetButton: {
    marginTop: Spacing.lg,
  },
});
