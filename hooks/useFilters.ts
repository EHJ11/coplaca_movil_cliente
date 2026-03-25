import { useState, useCallback } from 'react';
import { ProductDTO } from '@/services/api';

export interface FilterState {
  searchQuery: string;
  selectedCategory: string;
  onlyInStock: boolean;
  onlyOffers: boolean;
  onlyFresh: boolean;
}

interface UseFilterProps {
  products: ProductDTO[];
}

export function useFilters({ products }: UseFilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedCategory: 'Todas',
    onlyInStock: false,
    onlyOffers: false,
    onlyFresh: false,
  });

  const applyFilters = useCallback(
    (state?: Partial<FilterState>) => {
      const activeFilters: FilterState = {
        ...filters,
        ...state,
      };
      let filtered = [...products];

      // Search filter
      if (activeFilters.searchQuery.trim()) {
        const normalized = normalizeText(activeFilters.searchQuery);
        filtered = filtered.filter(p =>
          normalizeText(p.name).includes(normalized) ||
          normalizeText(p.description || '').includes(normalized)
        );
      }

      // Category filter
      if (activeFilters.selectedCategory !== 'Todas') {
        filtered = filtered.filter(p => (p.categoryName || 'Otros') === activeFilters.selectedCategory);
      }

      // Stock filter
      if (activeFilters.onlyInStock) {
        filtered = filtered.filter(p => (p.stock ?? p.stockQuantity ?? 0) > 0);
      }

      // Offers filter
      if (activeFilters.onlyOffers) {
        filtered = filtered.filter(p => (p.discount ?? p.discountPercentage ?? 0) > 0);
      }

      // Fresh filter
      if (activeFilters.onlyFresh) {
        filtered = filtered.filter(p => p.isFresh === true || normalizeText(p.name).includes('fresco'));
      }

      return filtered;
    },
    [products, filters]
  );

  const updateFilter = useCallback((updates: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      searchQuery: '',
      selectedCategory: 'Todas',
      onlyInStock: false,
      onlyOffers: false,
      onlyFresh: false,
    });
  }, []);

  const getCategories = useCallback(() => {
    const unique = Array.from(
      new Set(products.map(p => p.categoryName || 'Otros'))
    ) as string[];
    return ['Todas', ...unique.sort()];
  }, [products]);

  return {
    filters,
    applyFilters,
    updateFilter,
    clearFilters,
    getCategories,
  };
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}
