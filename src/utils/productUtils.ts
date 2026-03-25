/**
 * Utilities for product business logic
 */

import type { OfferInfo, ProductDTO, ProductFilters } from "@/src/types";
import { normalizeText } from "./textUtils";

const FALLBACK_OFFER_BY_KEYWORD: Record<string, OfferInfo> = {
  platano: { reason: "Exceso de cosecha", discountPercentage: 15 },
  mango: { reason: "Promocion tropical", discountPercentage: 18 },
  papaya: { reason: "Stock de temporada", discountPercentage: 12 },
  pina: { reason: "Venta flash de hoy", discountPercentage: 10 },
  sandia: { reason: "Lote fresco del dia", discountPercentage: 20 },
  fresa: { reason: "Campana de producto fresco", discountPercentage: 16 },
};

export const getOfferByProduct = (product: ProductDTO): OfferInfo | null => {
  if (product.offerReason && product.discountPercentage) {
    return {
      reason: product.offerReason,
      discountPercentage: product.discountPercentage,
    };
  }

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

  // Search filter
  if (filters.searchQuery.trim()) {
    const normalized = normalizeText(filters.searchQuery);
    filtered = filtered.filter(
      (p) =>
        normalizeText(p.name).includes(normalized) ||
        (p.description && normalizeText(p.description).includes(normalized)),
    );
  }

  // Category filter
  if (filters.category !== "Todas") {
    filtered = filtered.filter((p) => p.categoryName === filters.category);
  }

  // Stock filter
  if (filters.onlyInStock) {
    filtered = filtered.filter((p) => p.stockQuantity > 0);
  }

  // Offers filter
  if (filters.onlyOffers) {
    filtered = filtered.filter((p) => getOfferByProduct(p) !== null);
  }

  // Fresh filter
  if (filters.onlyFresh) {
    filtered = filtered.filter(
      (p) => !p.categoryName || p.categoryName.toLowerCase().includes("fresco"),
    );
  }

  return filtered;
};

export const extractCategories = (products: ProductDTO[]): string[] => {
  const uniqueCategories = Array.from(
    new Set(products.map((p) => p.categoryName || "Otros")),
  ) as string[];
  return ["Todas", ...uniqueCategories.sort((a, b) => a.localeCompare(b))];
};

export const calculateDiscount = (
  originalPrice: number,
  discountPercentage: number,
): number => {
  return originalPrice - (originalPrice * discountPercentage) / 100;
};
