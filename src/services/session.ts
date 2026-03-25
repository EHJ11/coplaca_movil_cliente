/**
 * Session management service
 * Handles user authentication, cart, orders, and balance state
 */

import type { CartItem, OrderDTO, UserDTO } from "@/src/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  TOKEN: "coplaca_token",
  USER: "coplaca_user",
  CART: "coplaca_cart",
  ORDERS: "coplaca_orders",
  BALANCE: "coplaca_balance",
} as const;

// In-memory state — synchronous reads, AsyncStorage writes (write-through cache)
let token = "";
let currentUser: UserDTO | null = null;
let cart: CartItem[] = [];
let orders: OrderDTO[] = [];
let balance = 0;

/**
 * Session management object with methods for authentication and data persistence
 */
export const session = {
  /**
   * Load persisted state from AsyncStorage. Call once at app startup.
   */
  async init(): Promise<void> {
    const [storedToken, storedUser, storedCart, storedOrders, storedBalance] =
      await Promise.all([
        AsyncStorage.getItem(KEYS.TOKEN),
        AsyncStorage.getItem(KEYS.USER),
        AsyncStorage.getItem(KEYS.CART),
        AsyncStorage.getItem(KEYS.ORDERS),
        AsyncStorage.getItem(KEYS.BALANCE),
      ]);

    token = storedToken ?? "";
    currentUser = storedUser ? (JSON.parse(storedUser) as UserDTO) : null;
    cart = storedCart ? (JSON.parse(storedCart) as CartItem[]) : [];
    orders = storedOrders ? (JSON.parse(storedOrders) as OrderDTO[]) : [];
    balance = Number(storedBalance ?? "0");
  },

  /**
   * Authentication methods
   */
  setToken(nextToken: string) {
    token = nextToken;
    AsyncStorage.setItem(KEYS.TOKEN, nextToken).catch(() => {});
  },

  getToken() {
    return token;
  },

  setUser(user: UserDTO) {
    currentUser = user;
    AsyncStorage.setItem(KEYS.USER, JSON.stringify(user)).catch(() => {});
  },

  getUser() {
    return currentUser;
  },

  /**
   * Clear all session data
   */
  clear() {
    token = "";
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

  /**
   * Cart management
   */
  getCart() {
    return [...cart];
  },

  setCart(nextCart: CartItem[]) {
    cart = [...nextCart];
    AsyncStorage.setItem(KEYS.CART, JSON.stringify(cart)).catch(() => {});
  },

  addToCart(item: CartItem) {
    const existing = cart.find((c) => c.productId === item.productId);
    if (existing) {
      existing.quantityKg = Number(
        (existing.quantityKg + item.quantityKg).toFixed(2),
      );
    } else {
      cart.push(item);
    }
    AsyncStorage.setItem(KEYS.CART, JSON.stringify(cart)).catch(() => {});
  },

  removeFromCart(productId: number) {
    cart = cart.filter((item) => item.productId !== productId);
    AsyncStorage.setItem(KEYS.CART, JSON.stringify(cart)).catch(() => {});
  },

  updateCartItemQuantity(productId: number, quantity: number) {
    const item = cart.find((c) => c.productId === productId);
    if (item) {
      item.quantityKg = Number(quantity.toFixed(2));
      AsyncStorage.setItem(KEYS.CART, JSON.stringify(cart)).catch(() => {});
    }
  },

  clearCart() {
    cart = [];
    AsyncStorage.setItem(KEYS.CART, JSON.stringify(cart)).catch(() => {});
  },

  /**
   * Orders management
   */
  getOrders() {
    return [...orders];
  },

  saveOrders(nextOrders: OrderDTO[]) {
    orders = [...nextOrders];
    AsyncStorage.setItem(KEYS.ORDERS, JSON.stringify(orders)).catch(() => {});
  },

  prependOrder(order: OrderDTO) {
    const deduped = orders.filter((value) => value.id !== order.id);
    orders = [order, ...deduped];
    AsyncStorage.setItem(KEYS.ORDERS, JSON.stringify(orders)).catch(() => {});
  },

  mergeWithStored(ordersFromApi: OrderDTO[]) {
    const merged = [...ordersFromApi];

    for (const localOrder of orders) {
      const alreadyPresent = merged.some(
        (remoteOrder: OrderDTO) => remoteOrder.id === localOrder.id,
      );

      if (!alreadyPresent) {
        merged.push(localOrder);
      }
    }

    return merged;
  },

  /**
   * Balance management
   */
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
};

export type { CartItem } from "@/src/types";

