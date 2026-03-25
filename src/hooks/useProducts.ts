/**
 * Hook for managing products data and filtering logic
 */

import type { ProductDTO, ProductFilters } from "@/src/types";
import { extractCategories, filterProducts } from "@/src/utils/productUtils";
import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api";
import { session } from "../services/session";

export interface UseProductsReturn {
  products: ProductDTO[];
  filteredProducts: ProductDTO[];
  categories: string[];
  filters: ProductFilters;
  message: string;
  isLoading: boolean;
  setFilters: (filters: ProductFilters) => void;
  resetFilters: () => void;
  loadProducts: () => Promise<void>;
}

const DEFAULT_FILTERS: ProductFilters = {
  searchQuery: "",
  category: "Todas",
  onlyInStock: false,
  onlyOffers: false,
  onlyFresh: false,
};

export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductDTO[]>([]);
  const [categories, setCategories] = useState<string[]>(["Todas"]);
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS);
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

      // Extract categories
      const extractedCategories = extractCategories(result);
      setCategories(extractedCategories);

      setMessage("");
      applyFilters(result, DEFAULT_FILTERS);
    } catch {
      setMessage("No se pudieron cargar los productos. Verifica tu conexión.");
    } finally {
      setIsLoading(false);
    }
  }, [applyFilters]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const handleFiltersChange = useCallback(
    (newFilters: ProductFilters) => {
      setFilters(newFilters);
      applyFilters(products, newFilters);
    },
    [products, applyFilters],
  );

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    applyFilters(products, DEFAULT_FILTERS);
  }, [products, applyFilters]);

  return {
    products,
    filteredProducts,
    categories,
    filters,
    message,
    isLoading,
    setFilters: handleFiltersChange,
    resetFilters,
    loadProducts,
  };
};
