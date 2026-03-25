/**
 * Hook for managing cart logic
 */

import type { CartItem } from "@/src/types";
import { useCallback, useEffect, useState } from "react";
import { session } from "../services/session";

export interface UseCartReturn {
  cart: CartItem[];
  cartCount: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  isEmpty: () => boolean;
}

export const useCart = (): UseCartReturn => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);

  // Load cart from session on mount
  useEffect(() => {
    const currentCart = session.getCart();
    setCart(currentCart);
    setCartCount(currentCart.length);
  }, []);

  const addToCart = useCallback((item: CartItem) => {
    session.addToCart(item);
    const updatedCart = session.getCart();
    setCart(updatedCart);
    setCartCount(updatedCart.length);
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    session.removeFromCart(productId);
    const updatedCart = session.getCart();
    setCart(updatedCart);
    setCartCount(updatedCart.length);
  }, []);

  const updateQuantity = useCallback(
    (productId: number, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId);
      } else {
        session.updateCartItemQuantity(productId, quantity);
        const updatedCart = session.getCart();
        setCart(updatedCart);
      }
    },
    [removeFromCart],
  );

  const clearCart = useCallback(() => {
    session.clearCart();
    setCart([]);
    setCartCount(0);
  }, []);

  const getTotalPrice = useCallback((): number => {
    return cart.reduce(
      (total, item) => total + item.unitPrice * item.quantityKg,
      0,
    );
  }, [cart]);

  const isEmpty = useCallback((): boolean => {
    return cart.length === 0;
  }, [cart]);

  return {
    cart,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    isEmpty,
  };
};
