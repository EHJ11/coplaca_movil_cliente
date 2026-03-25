import AsyncStorage from '@react-native-async-storage/async-storage';
import { OrderDTO, ProductDTO, UserDTO } from './api';

export interface CartItem {
  productId: number;
  name: string;
  unitPrice: number;
  stockQuantity: number;
  categoryName?: string;
  quantityKg: number;
  imageUrl?: string;
  offerReason?: string;
}

const KEYS = {
  TOKEN: 'coplaca_token',
  USER: 'coplaca_user',
  CART: 'coplaca_cart',
  ORDERS: 'coplaca_orders',
  BALANCE: 'coplaca_balance',
} as const;

// In-memory state — synchronous reads, AsyncStorage writes (write-through cache)
let token = '';
let currentUser: UserDTO | null = null;
let cart: CartItem[] = [];
let orders: OrderDTO[] = [];
let balance = 0;

export const session = {
  /** Load persisted state from AsyncStorage. Call once at app startup. */
  async init(): Promise<void> {
    const [storedToken, storedUser, storedCart, storedOrders, storedBalance] = await Promise.all([
      AsyncStorage.getItem(KEYS.TOKEN),
      AsyncStorage.getItem(KEYS.USER),
      AsyncStorage.getItem(KEYS.CART),
      AsyncStorage.getItem(KEYS.ORDERS),
      AsyncStorage.getItem(KEYS.BALANCE),
    ]);

    token = storedToken ?? '';
    currentUser = storedUser ? (JSON.parse(storedUser) as UserDTO) : null;
    cart = storedCart ? (JSON.parse(storedCart) as CartItem[]) : [];
    orders = storedOrders ? (JSON.parse(storedOrders) as OrderDTO[]) : [];
    balance = Number(storedBalance ?? '0');
  },

  setToken(nextToken: string) {
    token = nextToken;
    AsyncStorage.setItem(KEYS.TOKEN, nextToken).catch(() => {});
  },

  getToken() {
    return token;
  },

  clear() {
    token = '';
    currentUser = null;
    cart = [];
    orders = [];
    balance = 0;
    Promise.all([
      AsyncStorage.removeItem(KEYS.TOKEN),
      AsyncStorage.removeItem(KEYS.USER),
      AsyncStorage.removeItem(KEYS.CART),
      AsyncStorage.removeItem(KEYS.ORDERS),
      AsyncStorage.removeItem(KEYS.BALANCE),
    ]).catch(() => {});
  },

  setUser(user: UserDTO) {
    currentUser = user;
    AsyncStorage.setItem(KEYS.USER, JSON.stringify(user)).catch(() => {});
  },

  getUser() {
    return currentUser;
  },

  getCart() {
    return [...cart];
  },

  setCart(nextCart: CartItem[]) {
    cart = [...nextCart];
    AsyncStorage.setItem(KEYS.CART, JSON.stringify(cart)).catch(() => {});
  },

  getOrders() {
    return [...orders];
  },

  saveOrders(nextOrders: OrderDTO[]) {
    orders = [...nextOrders];
    AsyncStorage.setItem(KEYS.ORDERS, JSON.stringify(orders)).catch(() => {});
  },

  prependOrder(order: OrderDTO) {
    const deduped = orders.filter(
      (value) => value.id !== order.id && value.orderNumber !== order.orderNumber,
    );
    orders = [order, ...deduped];
    AsyncStorage.setItem(KEYS.ORDERS, JSON.stringify(orders)).catch(() => {});
  },

  mergeWithStored(ordersFromApi: OrderDTO[]) {
    const merged = [...ordersFromApi];

    for (const localOrder of orders) {
      const alreadyPresent = merged.some(
        (remoteOrder) =>
          remoteOrder.id === localOrder.id ||
          (Boolean(remoteOrder.orderNumber) && remoteOrder.orderNumber === localOrder.orderNumber),
      );

      if (!alreadyPresent) {
        merged.push(localOrder);
      }
    }

    return merged;
  },

  getBalance() {
    return balance;
  },

  setBalance(nextBalance: number) {
    balance = Number(nextBalance.toFixed(2));
    AsyncStorage.setItem(KEYS.BALANCE, balance.toString()).catch(() => {});
  },

  addBalance(amount: number) {
    balance = Number((balance + amount).toFixed(2));
    AsyncStorage.setItem(KEYS.BALANCE, balance.toString()).catch(() => {});
  },

  addToCart(product: ProductDTO, quantityKg: number) {
    const existing = cart.find((item) => item.productId === product.id);
    if (existing) {
      existing.quantityKg = Number((existing.quantityKg + quantityKg).toFixed(2));
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        unitPrice: Number(product.unitPrice),
        stockQuantity: Number(product.stockQuantity),
        categoryName: product.categoryName,
        quantityKg,
        imageUrl: product.imageUrl,
        offerReason: product.offerReason,
      });
    }
    AsyncStorage.setItem(KEYS.CART, JSON.stringify(cart)).catch(() => {});
  },
};
