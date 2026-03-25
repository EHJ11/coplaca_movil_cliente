import { useState, useCallback, useMemo } from 'react';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface UseCartReturn {
  items: CartItem[];
  total: number;
  itemCount: number;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: number) => void;
  updateQuantity: (itemId: number, newQuantity: number) => void;
  clearCart: () => void;
  getItem: (itemId: number) => CartItem | undefined;
}

export function useCart(initialItems?: CartItem[]): UseCartReturn {
  const [items, setItems] = useState<CartItem[]>(initialItems || []);

  const addItem = useCallback((item: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);

      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }

      return [...prevItems, item];
    });
  }, []);

  const removeItem = useCallback((itemId: number) => {
    setItems((prevItems) => prevItems.filter((i) => i.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((i) => (i.id === itemId ? { ...i, quantity: newQuantity } : i))
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getItem = useCallback(
    (itemId: number): CartItem | undefined => {
      return items.find((i) => i.id === itemId);
    },
    [items]
  );

  const { total, itemCount } = useMemo(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return { total: totalPrice, itemCount: count };
  }, [items]);

  return {
    items,
    total,
    itemCount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItem,
  };
}
