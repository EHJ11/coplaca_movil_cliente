# Documentacion Tecnica Completa - Movil Cliente COPLACA

## 1. Resumen

Aplicacion movil del cliente para COPLACA, desarrollada con Expo Router + React Native + TypeScript.

Objetivos funcionales principales:
- Autenticacion de usuario cliente.
- Exploracion de catalogo de productos por kilo.
- Gestion de carrito con calculo de total.
- Confirmacion de pedido con metodos de pago.
- Consulta de pedidos del usuario.
- Gestion de perfil y recarga de saldo.

## 2. Stack Tecnologico

- Runtime UI: React Native 0.81
- Framework: Expo 54
- Enrutado: expo-router 6
- Lenguaje: TypeScript 5.9 (strict)
- Almacenamiento local: @react-native-async-storage/async-storage
- Cliente HTTP principal: fetch (services/api.ts)
- Cliente HTTP secundario: axios (services/customer-api.ts)
- Iconografia: @expo/vector-icons (MaterialIcons)

## 3. Estructura Real del Proyecto

Raiz:
- app/: rutas y pantallas con Expo Router.
- components/: componentes UI reutilizables y UI base.
- constants/: constantes de tema.
- hooks/: hooks reutilizables.
- services/: capa de API y sesion.
- src/: estructura modular en evolucion (components, hooks, services, styles, types, utils).
- utils/: utilidades de validacion y formato.
- assets/: imagenes y recursos.

Pantallas en app/(tabs):
- login.tsx: autenticacion.
- home.tsx: catalogo, filtros, ofertas, busqueda y add-to-cart.
- carrito.tsx: carrito, ajuste de cantidades, vaciado y pago.
- pedidos.tsx: listado de pedidos del usuario.
- perfil.tsx: perfil, actualizacion de datos y recarga de saldo.
- producto.tsx, pedido.tsx, explore.tsx: pantallas de apoyo y/o legado.
- _layout.tsx: configuracion de tabs y navegacion principal.

Componentes comunes destacados:
- components/common/ProductCard.tsx
- components/common/CartItem.tsx
- components/common/FilterPanel.tsx
- components/common/SearchBar.tsx
- components/common/OffersCarousel.tsx
- components/common/OrderSummary.tsx
- components/common/WalletCard.tsx

Servicios:
- services/api.ts: DTOs, cliente request y endpoints principales.
- services/session.ts: cache en memoria + persistencia AsyncStorage.
- services/customer-api.ts: cliente axios complementario.

## 4. Arquitectura y Flujo de Datos

### 4.1 Flujo de autenticacion
1. Usuario inicia sesion en login.
2. API retorna token y datos base.
3. services/session.ts almacena token y usuario.
4. Pantallas protegidas consumen session.getToken() y session.getUser().

### 4.2 Flujo de catalogo y carrito
1. home.tsx solicita productos via api.getProducts().
2. Usuario aplica filtros (categoria, stock, ofertas, frescos) y busqueda.
3. Usuario define cantidad y agrega al carrito.
4. session.addToCart() persiste en AsyncStorage.
5. carrito.tsx lee session.getCart() y calcula total.

### 4.3 Flujo de pedido
1. En carrito, usuario abre modal de pago y valida datos.
2. app llama api.createOrder().
3. Si API responde: pedido se guarda y se navega a pedidos.
4. Si falla red/API: se crea orden local y se conserva en session para sincronizacion posterior.

### 4.4 Flujo de perfil y saldo
1. perfil.tsx carga usuario actual y saldo local.
2. Usuario actualiza datos personales.
3. Usuario puede recargar saldo (PayPal o tarjeta).
4. session.addBalance() mantiene el saldo persistido.

## 5. Persistencia Local (AsyncStorage)

Claves usadas en services/session.ts:
- coplaca_token
- coplaca_user
- coplaca_cart
- coplaca_orders
- coplaca_balance

Patron aplicado:
- Estado en memoria para lectura rapida.
- Escritura asyncrona a AsyncStorage para persistencia.
- Inicializacion central con session.init().

## 6. Contratos de Datos Principales

Definidos en services/api.ts:
- AddressDTO
- UserDTO
- ProductDTO
- OrderItemDTO
- OrderDTO
- LoginResponse

ProductDTO soporta campos necesarios para compatibilidad de backend y UI:
- unitPrice, stockQuantity, categoryName
- price/discount/stock/isFresh como opcionales de compatibilidad

## 7. Navegacion y UX

Navegacion principal por tabs en app/(tabs)/_layout.tsx:
- home
- carrito
- pedidos
- perfil

Rutas internas ocultas o auxiliares:
- index
- login
- explore
- producto
- pedido

## 8. Configuracion y Ejecucion

Scripts principales (package.json):
- npm run start
- npm run android
- npm run ios
- npm run web
- npm run lint

Validacion recomendada antes de subir cambios:
1. npm run lint
2. npx tsc --noEmit

## 9. Estado Actual de Calidad

Estado tras la correccion aplicada:
- Lint: sin errores.
- TypeScript strict: sin errores de compilacion.

Ajustes relevantes realizados:
- Correccion de sintaxis en carrito y perfil.
- Limpieza de bloque duplicado en carrito.
- Normalizacion de tipos DTO para campos opcionales usados por UI.
- Correccion de iconos MaterialIcons no validos.
- Tipado estricto en interceptores axios.
- Correccion de export de FilterState.
- Instalacion de axios como dependencia faltante.

## 10. Riesgos y Deuda Tecnica

- Coexisten estructuras legacy y modular (app/components/hooks/services y src/*).
- services/customer-api.ts y services/api.ts solapan responsabilidad HTTP.
- Existen pantallas de apoyo/legacy que podrian consolidarse.
- Falta homogeneizar estilo y convenciones en todos los modulos.

## 11. Plan de Mejora Recomendado

1. Unificar cliente HTTP en una sola capa (fetch o axios, no ambas).
2. Migrar progresivamente consumo de datos a hooks de dominio en src/hooks.
3. Definir una capa unica de tipos en src/types y re-exportar.
4. Incorporar pruebas unitarias para:
   - validaciones de pago
   - filtros de catalogo
   - utilidades de formato
5. Agregar control central de errores de red y mensajes de UX.

## 12. Mapa Rapido para Nuevos Desarrolladores

Si quieres modificar...
- Login y sesion: services/session.ts + app/(tabs)/login.tsx
- Catalogo/filtros: app/(tabs)/home.tsx + components/common/ProductCard.tsx
- Carrito/pago: app/(tabs)/carrito.tsx + services/api.ts
- Pedidos: app/(tabs)/pedidos.tsx + services/session.ts
- Perfil/saldo: app/(tabs)/perfil.tsx

## 13. Notas de mantenimiento

- Mantener TypeScript en strict y corregir en origen cada warning relevante.
- Evitar agregar nuevos DTO duplicados fuera de la capa central.
- Validar iconos MaterialIcons contra nombres soportados para prevenir errores de tipo.
- Mantener la documentacion actualizada cuando cambie estructura o endpoints.
