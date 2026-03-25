# 📐 Guía de Estructura del Proyecto

## Resumen de la Nueva Arquitectura

El proyecto ha sido refactorizado para separar claramente las responsabilidades entre funcionalidad, diseño y estilos. La nueva estructura sigue principios de Clean Architecture y SOLID.

## 📁 Estructura de Carpetas

```
coplaca_movil_cliente/
├── src/
│   ├── components/          # Componentes UI divididos por características
│   │   ├── common/          # Componentes reutilizables básicos
│   │   │   ├── ThemedText.tsx
│   │   │   ├── ThemedView.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── index.ts
│   │   └── features/        # Componentes por funcionalidad
│   │       ├── home/
│   │       │   ├── ProductCard.tsx
│   │       │   ├── ProductFilters.tsx
│   │       │   └── index.ts
│   │       ├── cart/
│   │       ├── orders/
│   │       └── ...
│   │
│   ├── hooks/               # Lógica de negocio encapsulada
│   │   ├── useProducts.ts   # Gestión de productos y filtros
│   │   ├── useCart.ts       # Gestión del carrito
│   │   ├── use-color-scheme.ts (original)
│   │   ├── use-theme-color.ts (original)
│   │   └── use-color-scheme.web.ts (original)
│   │
│   ├── services/            # Integración con API y persistencia
│   │   ├── api.ts           # Cliente HTTP centralizado
│   │   └── session.ts       # Gestión de sesión y almacenamiento
│   │
│   ├── styles/              # Estilos y temas centralizados
│   │   ├── colors.ts        # Colores (claro/oscuro)
│   │   ├── typography.ts    # Tipografía y tamaños de fuente
│   │   ├── spacing.ts       # Espaciado, bordes y sombras
│   │   └── theme.ts         # Configuración del tema completo
│   │
│   ├── types/               # Tipos TypeScript centralizados
│   │   └── index.ts         # Todas las interfaces y tipos
│   │
│   └── utils/               # Funciones de utilidad
│       ├── textUtils.ts     # Manejo de texto
│       ├── imageUtils.ts    # URLs de imágenes
│       └── productUtils.ts  # Lógica de productos
│
├── app/                     # Rutas y pantallas (Expo Router)
│   ├── (tabs)/
│   ├── _layout.tsx
│   └── modal.tsx
│
├── assets/
├── constants/               # Constantes específicas
├── hooks/                   # Hooks originales (mantener por ahora)
├── services/                # Servicios originales (CONSIDERAR MIGRAR)
└── components/              # Componentes originales (CONSIDERAR MIGRAR)
```

## 🔄 Flujo de Datos

### Vista de Capas

```
┌─────────────────────────────────────┐
│     PRESENTACIÓN (Screens)          │
│   app/(tabs)/home.tsx               │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│     COMPONENTES (UI)                │
│  - ProductCard                      │
│  - ProductFilters                   │
│  - ThemedText, etc.                 │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│     LÓGICA (Hooks)                  │
│  - useProducts()                    │
│  - useCart()                        │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│  SERVICIOS & UTILIDADES             │
│  - api.ts (HTTP)                    │
│  - session.ts (Persistencia)        │
│  - productUtils.ts (Reglas)         │
└─────────────────────────────────────┘
```

## 📋 Responsabilidades por Carpeta

### `src/types/`

**Responsabilidad**: Definiciones centralizadas de tipos

- Interfaces de datos (ProductDTO, UserDTO, etc.)
- Tipos de filtros y opciones
- Tipos de respuesta de API

**Beneficios**:

- Un único lugar para cambiar tipos
- Evita duplicación de interfaces
- Facilita el mantenimiento

### `src/styles/`

**Responsabilidad**: Estilos y temas centralizados

- **colors.ts**: Paleta de colores (claro/oscuro)
- **typography.ts**: Estilos de texto (h1, h2, body, etc.)
- **spacing.ts**: Espaciado, bordes, sombras
- **theme.ts**: Configuración completa del tema

**Beneficios**:

- Consistencia visual en toda la app
- Cambios de tema globales fáciles
- Reutilización de estilos

### `src/utils/`

**Responsabilidad**: Lógica pura (funciones sin estado)

- **productUtils.ts**: Filtrado, categorización, descuentos
- **textUtils.ts**: Normalización, formateo de texto
- **imageUtils.ts**: Mapeo de URLs de imágenes

**Beneficios**:

- Fácil de testear
- Reutilizable en múltiples componentes
- Separación de lógica vs presentación

### `src/hooks/`

**Responsabilidad**: Lógica de negocio con estado

- **useProducts.ts**: Gestión de productos, filtros y búsqueda
- **useCart.ts**: Gestión del carrito de compras

**Beneficios**:

- Encapsula lógica compleja
- Reutilizable en múltiples pantallas
- Fácil de testear

### `src/services/`

**Responsabilidad**: Integración con API y persistencia

- **api.ts**: Cliente HTTP centralizado
- **session.ts**: Gestión de autenticación, carrito, órdenes

**Beneficios**:

- Un único lugar para cambiar API
- Reutilizable en toda la app
- Fácil de mockear para tests

### `src/components/`

**Responsabilidad**: Presentación sin lógica de negocio

- **common/**: Componentes reutilizables (Button, Input, etc.)
- **features/{feature}/**: Componentes específicos por característica

**Ventajas**:

- Components puros (solo props → UI)
- Fácil reusabilidad
- Fácil de testear
- Escalable por características

## 🎨 Ejemplo de Uso

### En una Pantalla (Screen)

**Antes (todo mezclado)**:

```typescript
// home.tsx - ~300 líneas de lógica + UI + estilos
export default function HomeScreen() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({...});
  // ... 50 más líneas de estado

  // ... Lógica de filtrado, búsqueda, etc.
  const applyFilters = (prods, query, category, ...) => { ... }

  // ... Renderizado con estilos inline
  return (
    <StyleSheet.create({...}), <View>, ...)
  )
}
```

**Después (separado)**:

```typescript
import { useProducts } from '@/src/hooks/useProducts';
import { ProductCard, ProductFilters } from '@/src/components/features/home';
import { ThemedView, ThemedText } from '@/src/components/common';
import { Spacing } from '@/src/styles/spacing';

export default function HomeScreen() {
  // ✅ Lógica encapsulada
  const {
    products,
    filteredProducts,
    categories,
    filters,
    isLoading,
    setFilters,
    resetFilters,
  } = useProducts();

  return (
    <ThemedView style={{ padding: Spacing.lg }}>
      <ProductFilters
        categories={categories}
        filters={filters}
        onFiltersChange={setFilters}
        onReset={resetFilters}
      />
      <ProductList products={filteredProducts} />
    </ThemedView>
  );
}
```

## 🚀 Pasos de Migración

### 1. Actualizar Imports en Pantallas Existentes

**Cambiar de**:

```typescript
import { api, ProductDTO } from "@/services/api";
import { session } from "@/services/session";
import { useThemeColor } from "@/hooks/use-theme-color";
```

**A**:

```typescript
// Types
import type { ProductDTO } from "@/src/types";

// API & Services
import { api } from "@/src/services/api";
import { session } from "@/src/services/session";

// Hooks
import { useThemeColor } from "@/hooks/use-theme-color";
import { useProducts } from "@/src/hooks/useProducts";

// Components
import { ThemedText, Button } from "@/src/components/common";
import { ProductCard } from "@/src/components/features/home";

// Styles
import { Spacing } from "@/src/styles/spacing";
import { Theme } from "@/src/styles/theme";
```

### 2. Reemplazar Estilos Inline

**Cambiar de**:

```typescript
const styles = StyleSheet.create({
  container: { paddingVertical: 16, paddingHorizontal: 20 },
  title: { fontSize: 32, fontWeight: "bold" },
  button: { backgroundColor: "#0a7ea4", padding: 12 },
});
```

**A**:

```typescript
import { Spacing } from "@/src/styles/spacing";
import { Typography } from "@/src/styles/typography";

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
  title: Typography.h1,
  button: {
    backgroundColor: Theme.colors.light.tint,
    padding: Spacing.md,
  },
});
```

### 3. Extraer Lógica a Hooks

**Cambiar de**:

```typescript
export default function HomeScreen() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({...});

  useEffect(() => {
    loadProducts();
  }, []);

  // ... 200 líneas de lógica
}
```

**A**:

```typescript
export default function HomeScreen() {
  const { products, filters, setFilters } = useProducts();

  return (
    // ... UI limpia
  );
}
```

## 📝 Checklist de Migración

- [ ] Actualizar pantalla `home.tsx` para usar `useProducts` hook
- [ ] Actualizar pantalla `home.tsx` para usar componentes de features
- [ ] Migrar pantalla `carrito.tsx`
- [ ] Migrar pantalla `pedidos.tsx`
- [ ] Migrar pantalla `perfil.tsx`
- [ ] Migrar pantalla `login.tsx`
- [ ] Eliminar archivos duplicados en `/services` y `/components`
- [ ] Actualizar `tsconfig.json` paths si es necesario
- [ ] Verificar todos los imports
- [ ] Testear en iOS
- [ ] Testear en Android
- [ ] Testear en Web

## 🔗 Referencias Rápidas

### Agregar Toggle/Checkbox

```typescript
<Button
  label={`${isActive ? '✓' : '○'} Opción`}
  variant={isActive ? 'primary' : 'secondary'}
  onPress={() => setIsActive(!isActive)}
/>
```

### Usar Estilos Consistentes

```typescript
import { Spacing, BorderRadius, Shadows } from "@/src/styles/spacing";
import { Typography } from "@/src/styles/typography";

const styles = StyleSheet.create({
  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.medium,
  },
  title: Typography.h2,
});
```

### Crear Nuevo Hook

```typescript
// src/hooks/useNuevoHook.ts
import { useCallback, useState } from "react";

export const useNuevoHook = () => {
  const [data, setData] = useState(null);

  const fetchData = useCallback(async () => {
    // lógica
  }, []);

  return { data, fetchData };
};
```

### Crear Nuevo Componente

```typescript
// src/components/features/nueva-feature/NuevoComponente.tsx
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/src/components/common';
import { Spacing } from '@/src/styles/spacing';

interface Props {
  title: string;
}

export function NuevoComponente({ title }: Props) {
  return (
    <View style={styles.container}>
      <ThemedText type="h3">{title}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
  },
});
```

## ✅ Beneficios Logrados

1. **Separación de Responsabilidades**: Cada carpeta tiene un propósito claro
2. **Reutilización**: Componentes, hooks y utilidades reutilizables
3. **Mantenibilidad**: Fácil encontrar y modificar código
4. **Testing**: Lógica separada es más fácil de testear
5. **Escalabilidad**: Fácil agregar nuevas características
6. **Consistencia**: Estilos, tipos y API centralizados
7. **Onboarding**: Nuevos desarrolladores entienden la estructura rápidamente

## 📚 Próximos Pasos

1. Migrar todas las pantallas a usar los nuevos hooks
2. Crear componentes adicionales (ProductList, CartList, OrderCard, etc.)
3. Implementar temas oscuros/claros completamente
4. Agregar más utilidades según sea necesario
5. Crear tests unitarios para hooks y utilidades
6. Documentar componentes con Storybook (opcional)
