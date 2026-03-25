# 🔄 Guía de Migración Práctica: Pantalla Home

Este documento muestra cómo migrar la pantalla `home.tsx` a la nueva arquitectura paso a paso.

## Estado Actual ❌

```typescript
// app/(tabs)/home.tsx (~400 líneas)
// - Todo mezclado: Lógica + UI + Estilos
// - Difícil de mantener
// - No reutilizable

export default function HomeScreen() {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductDTO[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [quantityByProduct, setQuantityByProduct] = useState<Record<number, string>>({});
  // ... 20 más líneas de estado

  const loadProducts = useCallback(async () => {
    // ... lógica de carga
  }, []);

  const applyFilters = (prods, query, category, ...) => {
    // ... lógica de filtrado (100+ líneas)
  };

  return (
    <ScrollView>
      {/* UI Mezclada con estilos inline */}
    </ScrollView>
  );
}
```

## Nuevo Estado ✅

```typescript
// app/(tabs)/home.tsx (~50 líneas)
// - Limpio y legible
// - Solo responsable de orquestar

import { useProducts } from '@/src/hooks/useProducts';
import { useCart } from '@/src/hooks/useCart';
import { ProductCard, ProductFilters } from '@/src/components/features/home';
import { ThemedView, Button } from '@/src/components/common';
import { Spacing } from '@/src/styles/spacing';

export default function HomeScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // ✅ Toda la lógica encapsulada en hooks
  const {
    filteredProducts,
    categories,
    filters,
    message,
    isLoading,
    setFilters,
    resetFilters
  } = useProducts();

  const { addToCart, cartCount } = useCart();

  return (
    <ThemedView style={{ flex: 1 }}>
      {/* Encabezado con contador */}
      <HeaderBar cartCount={cartCount} />

      {/* Filtros */}
      <ProductFilters
        categories={categories}
        filters={filters}
        onFiltersChange={setFilters}
        onReset={resetFilters}
      />

      {/* Productos */}
      {message && <ErrorMessage message={message} />}
      {isLoading && <LoadingIndicator />}

      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={(p) => navigation.navigate('producto', { id: p.id })}
            onAddToCart={(p) => addToCart({
              productId: p.id,
              name: p.name,
              unitPrice: p.unitPrice,
              stockQuantity: p.stockQuantity,
              quantityKg: 1,
              imageUrl: p.imageUrl,
            })}
          />
        )}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
      />
    </ThemedView>
  );
}
```

## Paso 1: Crear el Hook `useProducts` ✅

**Archivo**: `src/hooks/useProducts.ts`

```typescript
import { useCallback, useEffect, useState } from "react";
import type { ProductDTO, ProductFilters } from "@/src/types";
import { api } from "@/src/services/api";
import { session } from "@/src/services/session";
import { filterProducts, extractCategories } from "@/src/utils/productUtils";

export const useProducts = () => {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductDTO[]>([]);
  const [categories, setCategories] = useState<string[]>(["Todas"]);
  const [filters, setFilters] = useState<ProductFilters>({
    searchQuery: "",
    category: "Todas",
    onlyInStock: false,
    onlyOffers: false,
    onlyFresh: false,
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const applyFilters = useCallback(
    (prods: ProductDTO[], newFilters: ProductFilters) => {
      const filtered = filterProducts(prods, newFilters);
      setFilteredProducts(filtered);
    },
    [],
  );

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await api.getProducts("", session.getToken());
      setProducts(result);
      const cats = extractCategories(result);
      setCategories(cats);
      setMessage("");
      applyFilters(result, filters);
    } catch {
      setMessage("No se pudieron cargar los productos.");
    } finally {
      setIsLoading(false);
    }
  }, [filters, applyFilters]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const handleSetFilters = useCallback(
    (newFilters: ProductFilters) => {
      setFilters(newFilters);
      applyFilters(products, newFilters);
    },
    [products, applyFilters],
  );

  return {
    products,
    filteredProducts,
    categories,
    filters,
    message,
    isLoading,
    setFilters: handleSetFilters,
    resetFilters: () =>
      handleSetFilters({
        searchQuery: "",
        category: "Todas",
        onlyInStock: false,
        onlyOffers: false,
        onlyFresh: false,
      }),
    loadProducts,
  };
};
```

## Paso 2: Crear Utilidades `productUtils` ✅

**Archivo**: `src/utils/productUtils.ts`

```typescript
import type { OfferInfo, ProductDTO, ProductFilters } from "@/src/types";
import { normalizeText } from "./textUtils";

// Diccionario de ofertas por palabra clave
const FALLBACK_OFFER_BY_KEYWORD: Record<string, OfferInfo> = {
  platano: { reason: "Exceso de cosecha", discountPercentage: 15 },
  mango: { reason: "Promocion tropical", discountPercentage: 18 },
  // ... más ofertas
};

export const getOfferByProduct = (product: ProductDTO): OfferInfo | null => {
  // Si el producto tiene oferta, usarla
  if (product.offerReason && product.discountPercentage) {
    return {
      reason: product.offerReason,
      discountPercentage: product.discountPercentage,
    };
  }

  // Si no, buscar por palabra clave
  const productName = product.name.toLowerCase();
  for (const [keyword, offer] of Object.entries(FALLBACK_OFFER_BY_KEYWORD)) {
    if (productName.includes(keyword)) {
      return offer;
    }
  }

  return null;
};

export const filterProducts = (
  products: ProductDTO[],
  filters: ProductFilters,
): ProductDTO[] => {
  let filtered = [...products];

  // Filtro de búsqueda
  if (filters.searchQuery.trim()) {
    const normalized = normalizeText(filters.searchQuery);
    filtered = filtered.filter(
      (p) =>
        normalizeText(p.name).includes(normalized) ||
        (p.description && normalizeText(p.description).includes(normalized)),
    );
  }

  // Filtro de categoría
  if (filters.category !== "Todas") {
    filtered = filtered.filter((p) => p.categoryName === filters.category);
  }

  // Filtro de stock
  if (filters.onlyInStock) {
    filtered = filtered.filter((p) => p.stockQuantity > 0);
  }

  // Filtro de ofertas
  if (filters.onlyOffers) {
    filtered = filtered.filter((p) => getOfferByProduct(p) !== null);
  }

  // Filtro de fresco
  if (filters.onlyFresh) {
    const freshKeywords = ["fresco", "fresh", "recien"];
    filtered = filtered.filter((p) => {
      const name = p.name.toLowerCase();
      const category = p.categoryName?.toLowerCase() ?? "";
      return freshKeywords.some(
        (k) => name.includes(k) || category.includes(k),
      );
    });
  }

  return filtered;
};

export const extractCategories = (products: ProductDTO[]): string[] => {
  const unique = Array.from(
    new Set(products.map((p) => p.categoryName || "Otros")),
  ) as string[];
  return ["Todas", ...unique.sort()];
};
```

## Paso 3: Crear Componentes de Características ✅

### ProductCard

**Archivo**: `src/components/features/home/ProductCard.tsx`

```typescript
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText, ThemedView } from '@/src/components/common';
import { Spacing, BorderRadius, Shadows } from '@/src/styles/spacing';
import type { ProductDTO } from '@/src/types';
import { getOfferByProduct } from '@/src/utils/productUtils';
import { getProductImageUrl } from '@/src/utils/imageUtils';

interface ProductCardProps {
  product: ProductDTO;
  onPress: (product: ProductDTO) => void;
  onAddToCart?: (product: ProductDTO) => void;
}

export function ProductCard({ product, onPress, onAddToCart }: ProductCardProps) {
  const offer = getOfferByProduct(product);
  const imageUrl = getProductImageUrl(product);

  return (
    <TouchableOpacity
      onPress={() => onPress(product)}
      style={styles.container}
      activeOpacity={0.7}
    >
      <ThemedView style={styles.card}>
        {/* Imagen */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
          {offer && (
            <View style={styles.badge}>
              <ThemedText type="caption" lightColor="#fff">
                -{offer.discountPercentage}%
              </ThemedText>
            </View>
          )}
        </View>

        {/* Contenido */}
        <View style={styles.content}>
          <ThemedText type="subtitle" numberOfLines={2}>
            {product.name}
          </ThemedText>

          <ThemedText type="bodyBold" lightColor="#0a7ea4">
            ${product.unitPrice.toFixed(2)}
          </ThemedText>

          {offer && (
            <ThemedText type="caption" lightColor="#ff9800">
              {offer.reason}
            </ThemedText>
          )}
        </View>

        {/* Botón */}
        {onAddToCart && (
          <TouchableOpacity
            onPress={() => onAddToCart(product)}
            disabled={product.stockQuantity === 0}
            style={[styles.button, product.stockQuantity === 0 && styles.disabled]}
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
  container: { flex: 1, margin: Spacing.sm },
  card: { borderRadius: BorderRadius.lg, overflow: 'hidden', ...Shadows.medium },
  imageContainer: { width: '100%', height: 150, position: 'relative' },
  image: { width: '100%', height: '100%' },
  badge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: '#ff9800',
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  content: { padding: Spacing.md },
  button: { backgroundColor: '#0a7ea4', padding: Spacing.md, alignItems: 'center' },
  disabled: { opacity: 0.5 },
});
```

### ProductFilters

**Archivo**: `src/components/features/home/ProductFilters.tsx`

```typescript
import { StyleSheet, View } from 'react-native';
import { ThemedView, Input, Button } from '@/src/components/common';
import { Spacing } from '@/src/styles/spacing';
import type { ProductFilters as IProductFilters } from '@/src/types';

interface ProductFiltersProps {
  categories: string[];
  filters: IProductFilters;
  onFiltersChange: (filters: IProductFilters) => void;
  onReset?: () => void;
}

export function ProductFilters({
  categories,
  filters,
  onFiltersChange,
  onReset,
}: ProductFiltersProps) {
  return (
    <ThemedView style={styles.container}>
      {/* Búsqueda */}
      <Input
        placeholder="Buscar..."
        value={filters.searchQuery}
        onChangeText={(text) =>
          onFiltersChange({ ...filters, searchQuery: text })
        }
      />

      {/* Categorías */}
      {categories.map((cat) => (
        <Button
          key={cat}
          label={cat}
          variant={filters.category === cat ? 'primary' : 'secondary'}
          onPress={() => onFiltersChange({ ...filters, category: cat })}
          style={styles.button}
        />
      ))}

      {/* Opciones */}
      <Button
        label={`${filters.onlyInStock ? '✓' : '○'} Solo Stock`}
        onPress={() =>
          onFiltersChange({
            ...filters,
            onlyInStock: !filters.onlyInStock,
          })
        }
      />
      {/* ... más opciones */}

      {onReset && <Button label="Limpiar" onPress={onReset} />}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.lg },
  button: { marginVertical: Spacing.sm },
});
```

## Paso 4: Actualizar la Pantalla Home ✅

**Archivo**: `app/(tabs)/home.tsx`

```typescript
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { useProducts } from '@/src/hooks/useProducts';
import { useCart } from '@/src/hooks/useCart';
import { ProductCard, ProductFilters } from '@/src/components/features/home';
import { ThemedView, ThemedText } from '@/src/components/common';
import { Spacing } from '@/src/styles/spacing';

type NavigationProps = StackNavigationProp<any>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProps>();

  // ✅ Lógica completamente encapsulada
  const {
    filteredProducts,
    categories,
    filters,
    message,
    isLoading,
    setFilters,
    resetFilters,
  } = useProducts();

  const { cartCount, addToCart } = useCart();

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ padding: Spacing.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Título con contador */}
        <ThemedText type="h2" style={{ marginBottom: Spacing.lg }}>
          Productos {cartCount > 0 && `(${cartCount})`}
        </ThemedText>

        {/* Filtros */}
        <ProductFilters
          categories={categories}
          filters={filters}
          onFiltersChange={setFilters}
          onReset={resetFilters}
        />

        {/* Mensaje de error */}
        {message && (
          <ThemedText type="body" lightColor="#f44336" style={{ margin: Spacing.lg }}>
            {message}
          </ThemedText>
        )}

        {/* Indicador de carga */}
        {isLoading && (
          <ThemedText type="body" style={{ margin: Spacing.lg }}>
            Cargando...
          </ThemedText>
        )}

        {/* Productos en grid */}
        <View style={styles.grid}>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={(p) => {
                navigation.navigate('producto', { id: p.id });
              }}
              onAddToCart={(p) => {
                addToCart({
                  productId: p.id,
                  name: p.name,
                  unitPrice: p.unitPrice,
                  stockQuantity: p.stockQuantity,
                  quantityKg: 1,
                  imageUrl: p.imageUrl,
                  offerReason: p.offerReason,
                });
              }}
            />
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Spacing.sm,
  },
});
```

## Resumen de Cambios

| Aspecto               | Antes    | Después          |
| --------------------- | -------- | ---------------- |
| **Líneas de código**  | ~400     | ~50              |
| **Responsabilidades** | 10+      | 1 (orquestación) |
| **Reusabilidad**      | No       | Sí               |
| **Testabilidad**      | Difícil  | Fácil            |
| **Mantenibilidad**    | Compleja | Simple           |
| **Legibilidad**       | Baja     | Alta             |

## ✅ Checklist de Migración

- [ ] Copiar/crear `src/types/index.ts` con todas las interfaces
- [ ] Copiar/crear `src/styles/` con colores, tipografía, espaciado
- [ ] Copiar/crear `src/utils/` con productUtils, textUtils, imageUtils
- [ ] Copiar/crear `src/hooks/useProducts.ts` y `useCart.ts`
- [ ] Copiar/crear `src/components/common/` con componentes base
- [ ] Copiar/crear `src/components/features/home/` con componentes específicos
- [ ] Copiar/crear `src/services/api.ts` y `session.ts`
- [ ] Actualizar imports en `app/(tabs)/home.tsx`
- [ ] Verificar que funcione en desarrollo
- [ ] Testear todas las características
- [ ] Repetir para otras pantallas

## 🚀 Próximos Pasos

1. Migrar pantalla `carrito.tsx` de forma similar
2. Migrar pantalla `pedidos.tsx`
3. Crear componentes más específicos según sea necesario
4. Implementar tests unitarios
5. Eliminar archivos duplicados antiguos cuando todo esté migrado
