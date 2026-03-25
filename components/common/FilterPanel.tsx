import { Text, TouchableOpacity, View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT } from '@/constants/colors';

interface FilterPanelProps {
  categories: string[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  onlyInStock: boolean;
  onToggleInStock: () => void;
  onlyOffers: boolean;
  onToggleOffers: () => void;
  onlyFresh: boolean;
  onToggleFresh: () => void;
  onClearFilters: () => void;
  isVisible: boolean;
  onClose: () => void;
}

export default function FilterPanel({
  categories,
  selectedCategory,
  onCategorySelect,
  onlyInStock,
  onToggleInStock,
  onlyOffers,
  onToggleOffers,
  onlyFresh,
  onToggleFresh,
  onClearFilters,
  isVisible,
  onClose,
}: FilterPanelProps) {
  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <Pressable style={styles.overlay} onPress={onClose} />

      {/* Panel */}
      <View style={styles.panel}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Filtros</Text>
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="close" size={24} color={COLORS.dark} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Categories */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categoría</Text>
            <TouchableOpacity
              style={[styles.categoryItem, selectedCategory === null && styles.categorySelected]}
              onPress={() => onCategorySelect(null)}
            >
              <View style={styles.categoryDot} />
              <Text style={styles.categoryText}>Todas</Text>
            </TouchableOpacity>

            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryItem,
                  selectedCategory === category && styles.categorySelected,
                ]}
                onPress={() => onCategorySelect(category)}
              >
                <View
                  style={[
                    styles.categoryDot,
                    selectedCategory === category && { backgroundColor: COLORS.primary },
                  ]}
                />
                <Text style={styles.categoryText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Toggles */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Opciones</Text>

            <TouchableOpacity style={styles.toggleItem} onPress={onToggleInStock}>
              <View style={styles.checkbox}>
                {onlyInStock && (
                  <MaterialIcons name="check" size={16} color="white" />
                )}
              </View>
              <Text style={styles.toggleLabel}>Solo en stock</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toggleItem} onPress={onToggleOffers}>
              <View style={styles.checkbox}>
                {onlyOffers && (
                  <MaterialIcons name="check" size={16} color="white" />
                )}
              </View>
              <Text style={styles.toggleLabel}>Solo ofertas</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toggleItem} onPress={onToggleFresh}>
              <View style={styles.checkbox}>
                {onlyFresh && (
                  <MaterialIcons name="check" size={16} color="white" />
                )}
              </View>
              <Text style={styles.toggleLabel}>Productos frescos</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Actions */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.clearBtn} onPress={onClearFilters}>
            <Text style={styles.clearText}>Limpiar Filtros</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyBtn} onPress={onClose}>
            <Text style={styles.applyText}>Aplicar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  panel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: BORDER_RADIUS.lg,
    borderTopRightRadius: BORDER_RADIUS.lg,
    maxHeight: '80%',
    paddingBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.dark,
  },
  content: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: SPACING.sm,
    color: COLORS.dark,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    gap: SPACING.md,
  },
  categorySelected: {
    backgroundColor: COLORS.light,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.sm,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.textLight,
  },
  categoryText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.dark,
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    gap: SPACING.md,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  toggleLabel: {
    fontSize: FONT_SIZE.md,
    color: COLORS.dark,
  },
  footer: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  clearBtn: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.textLight,
    alignItems: 'center',
  },
  clearText: {
    color: COLORS.textLight,
    fontWeight: FONT_WEIGHT.semibold,
    fontSize: FONT_SIZE.md,
  },
  applyBtn: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  applyText: {
    color: 'white',
    fontWeight: FONT_WEIGHT.semibold,
    fontSize: FONT_SIZE.md,
  },
});
