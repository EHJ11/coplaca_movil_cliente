# 🚀 Checklist y Recursos Rápidos

## 📋 Checklist de Implementación

### Fase 1: Estructura Base ✅ COMPLETADO

- [x] Crear carpeta `src/`
- [x] Crear `src/types/`
- [x] Crear `src/services/`
- [x] Crear `src/utils/`
- [x] Crear `src/styles/`
- [x] Crear `src/hooks/`
- [x] Crear `src/components/common/`
- [x] Crear `src/components/features/home/`

### Fase 2: Implementación de Archivos Base ✅ COMPLETADO

- [x] `src/types/index.ts` - Tipos centralizados
- [x] `src/styles/colors.ts` - Paleta de colores
- [x] `src/styles/typography.ts` - Tipografía
- [x] `src/styles/spacing.ts` - Espaciado
- [x] `src/styles/theme.ts` - Configuración del tema
- [x] `src/utils/textUtils.ts` - Utilidades de texto
- [x] `src/utils/imageUtils.ts` - Utilidades de imágenes
- [x] `src/utils/productUtils.ts` - Lógica de productos
- [x] `src/hooks/useProducts.ts` - Hook de productos
- [x] `src/hooks/useCart.ts` - Hook del carrito
- [x] `src/components/common/ThemedText.tsx`
- [x] `src/components/common/ThemedView.tsx`
- [x] `src/components/common/Button.tsx`
- [x] `src/components/common/Input.tsx`
- [x] `src/components/features/home/ProductCard.tsx`
- [x] `src/components/features/home/ProductFilters.tsx`
- [x] `src/services/api.ts` - API centralizada
- [x] `src/services/session.ts` - Gestión de sesión

### Fase 3: Migración (Gradual)

- [ ] Actualizar `app/(tabs)/home.tsx`
- [ ] Crear los hooks faltantes (`useOrders`, `useUser`, etc.)
- [ ] Migrar pantalla `carrito.tsx`
- [ ] Migrar pantalla `pedidos.tsx`
- [ ] Migrar pantalla `perfil.tsx`
- [ ] Migrar pantalla `login.tsx`
- [ ] Migrar pantalla `explore.tsx`
- [ ] Migrar pantalla `producto.tsx`
- [ ] Migrar pantalla `pedido.tsx`
- [ ] Actualizar `app/_layout.tsx` si es necesario

### Fase 4: Limpieza (después de migrar todo)

- [ ] Eliminar `services/api.ts` (versión vieja)
- [ ] Eliminar `services/session.ts` (versión vieja)
- [ ] Eliminar `components/themed-text.tsx` (versión vieja)
- [ ] Eliminar `components/themed-view.tsx` (versión vieja)
- [ ] Revisar y eliminar `constants/theme.ts` si está duplicado
- [ ] Consolidar `hooks/` originales en `src/hooks/`

### Fase 5: Mejoras (después de migración completa)

- [ ] Agregar tests unitarios
- [ ] Agregar más componentes específicos
- [ ] Implementar temas oscuros/claros completamente
- [ ] Documentar en Storybook (opcional)
- [ ] Optimizar renderizado con `useMemo` y `useCallback`

---

## 📄 Documentación Disponible

```
📁 Proyecto
├── 📄 README.md                 Documentación original
├── 📄 ARCHITECTURE.md           ← Guía de arquitectura general ⭐
├── 📄 STRUCTURE.md              ← Diagramas y visualización ⭐
├── 📄 MIGRATION_GUIDE.md        ← Ejemplo práctico paso a paso ⭐
└── 📄 QUICK_START.md            ← Este archivo (referencia rápida)
```

---

## 🔗 Importes Rápidos (Copiar y Pegar)

### Importar Tipos

```typescript
import type {
  ProductDTO,
  UserDTO,
  CartItem,
  OrderDTO,
  ProductFilters,
  AddressDTO,
} from "@/src/types";
```

### Importar Estilos

```typescript
import { Spacing, BorderRadius, Shadows } from "@/src/styles/spacing";
import { Typography } from "@/src/styles/typography";
import { ThemeColors } from "@/src/styles/colors";
import { Theme } from "@/src/styles/theme";
```

### Importar Utilidades

```typescript
import {
  filterProducts,
  getOfferByProduct,
  extractCategories,
} from "@/src/utils/productUtils";
import {
  normalizeText,
  truncateText,
  formatCurrency,
} from "@/src/utils/textUtils";
import { getProductImageUrl } from "@/src/utils/imageUtils";
```

### Importar Hooks

```typescript
import { useProducts } from "@/src/hooks/useProducts";
import { useCart } from "@/src/hooks/useCart";
import { useThemeColor } from "@/hooks/use-theme-color"; // Original
import { useColorScheme } from "@/hooks/use-color-scheme"; // Original
```

### Importar Componentes Comunes

```typescript
import { ThemedText, ThemedView, Button, Input } from "@/src/components/common";
```

### Importar Componentes de Features

```typescript
import { ProductCard, ProductFilters } from "@/src/components/features/home";
// Próximo:
// import { CartItem, CartSummary } from '@/src/components/features/cart';
// import { OrderCard, OrderList } from '@/src/components/features/orders';
```

### Importar Servicios

```typescript
import { api } from "@/src/services/api";
import { session } from "@/src/services/session";
```

---

## 💡 Patrones Comunes

### Usar Hook en Pantalla

```typescript
import { useProducts } from '@/src/hooks/useProducts';

export default function HomeScreen() {
  const {
    filteredProducts,
    categories,
    filters,
    message,
    isLoading,
    setFilters,
  } = useProducts();

  return (
    // Renderizar con los datos
  );
}
```

### Crear Nuevo Hook

```typescript
// src/hooks/useNuevoHook.ts
import { useState, useCallback } from "react";

export const useNuevoHook = () => {
  const [state, setState] = useState(null);

  const action = useCallback(async () => {
    // lógica
  }, []);

  return { state, action };
};
```

### Usar Estilos Consistentes

```typescript
import { Spacing, BorderRadius } from "@/src/styles/spacing";
import { Typography } from "@/src/styles/typography";

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  title: Typography.h2,
  button: {
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
});
```

### Crear Componente Nuevo

```typescript
// src/components/features/nueva-feature/MiComponente.tsx
import { StyleSheet } from 'react-native';
import { ThemedView, ThemedText } from '@/src/components/common';
import { Spacing } from '@/src/styles/spacing';

interface Props {
  title: string;
  description?: string;
}

export function MiComponente({ title, description }: Props) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h3">{title}</ThemedText>
      {description && (
        <ThemedText type="body">{description}</ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
  },
});
```

### Aplicar Filtros en componente

```typescript
const filters: ProductFilters = {
  searchQuery: "manzana",
  category: "Frutas",
  onlyInStock: true,
  onlyOffers: false,
  onlyFresh: false,
};

const filtered = filterProducts(products, filters);
```

---

## 🎯 Puntos Clave a Recordar

1. **Tipos**: Siempre use tipos de `@/src/types/`
2. **Estilos**: Use constantes de `@/src/styles/` en lugar de valores mágicos
3. **Lógica**: Extraiga lógica a `utils/` o `hooks/`
4. **Componentes**: Manténgalos puros (solo props → UI)
5. **Servicios**: Todos los accesos a API van en `api.ts`
6. **Persistencia**: Todos los accesos a AsyncStorage van en `session.ts`

---

## ❓ FAQ

### P: ¿Debo eliminar los archivos antiguos inmediatamente?

**R:** No. Mantenga la estructura antigua mientras migra. Una vez que todo esté migrado, puede eliminar los duplicados.

### P: ¿Puedo usar los estilos antiguos mientras migro?

**R:** Sí, pero intente usar los nuevos cuando sea posible. Gradualmente migrará todo.

### P: ¿Qué pasa si necesito otra utilidad?

**R:** Agregue un nuevo archivo en `src/utils/`. Ej: `dateUtils.ts`, `mathUtils.ts`, etc.

### P: ¿Debo crear un hook para todo?

**R:** Solo para lógica con estado. Funciones puras van en `utils/`.

### P: ¿Debo siempre seguir esta estructura?

**R:** Sí, para mantener consistencia. Si encuentra un caso especial, documente por qué diverge.

---

## 🆘 Troubleshooting

### "Cannot find module" después de cambiar imports

```
✓ Verificar que la ruta sea correcta
✓ Verificar que @ esté configurado en tsconfig.json
✓ Ejecutar npm install o yarn en caso de cambios en package.json
✓ Reiniciar el servidor de desarrollo
```

### Componente no renderiza correctamente

```
✓ Verificar que use ThemedView/ThemedText (con tema)
✓ Verificar que pase el style correcto
✓ Verificar que el hook devuelva los datos esperados
✓ Revisar la consola por errores
```

### Hook "no actualiza"

```
✓ Verificar que el array de dependencias sea correcto
✓ Verificar que useCallback esté bien usado
✓ Verificar que useState se inicialice correctamente
✓ Usar React DevTools para inspeccionar
```

---

## 📚 Recursos Externos

- [React Hooks Documentation](https://react.dev/reference/react/hooks)
- [Expo Router Docs](https://expo.dev/router)
- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Clean Code Principles](https://clean-code-js.com/)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

---

## 🎓 Siguiente Lectura Recomendada

1. Leer `ARCHITECTURE.md` - Entender la filosofía general
2. Leer `STRUCTURE.md` - Visualizar la estructura
3. Leer `MIGRATION_GUIDE.md` - Ver ejemplo práctico completo
4. Empezar migración con pantalla simple
5. Crear tests unitarios para hooks

---

## ✉️ Soporte

Si encuentra problemas:

1. Revisar documentación relevante
2. Buscar en el FAQ
3. Revisar ejemplos en MIGRATION_GUIDE.md
4. Consultar con el equipo

---

**Última actualización**: 2024
**Versión de la arquitectura**: 1.0
**Compatibilidad**: Expo 54+, React 19+, React Native 0.81+
