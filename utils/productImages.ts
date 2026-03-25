export const DEFAULT_PRODUCT_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg';

export const PRODUCT_IMAGE_BY_KEYWORD: Record<string, string> = {
  banana: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg',
  platano: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg',
  manzana: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg',
  pera: 'https://upload.wikimedia.org/wikipedia/commons/0/06/Pears.jpg',
  naranja: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Orange-Fruit-Pieces.jpg',
  limon: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Lemon-Whole-Split.jpg',
  aguacate: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Avocado_Hass_-_single_and_halved.jpg',
  tomate: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg',
  papaya: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Papaya_cross_section_BNC.jpg',
  mango: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Hapus_Mango.jpg',
  pina: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Pineapple_and_cross_section.jpg',
  melon: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Cantaloupes.jpg',
  sandia: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Watermelon_cross_BNC.jpg',
  fresa: 'https://upload.wikimedia.org/wikipedia/commons/2/29/PerfectStrawberry.jpg',
  kiwi: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Kiwi_aka.jpg',
  lechuga: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Lettuce_Mini_Romaine.jpg',
};

export function getProductImage(productName: string): string {
  const normalized = productName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  
  for (const [keyword, url] of Object.entries(PRODUCT_IMAGE_BY_KEYWORD)) {
    if (normalized.includes(keyword)) {
      return url;
    }
  }
  
  return DEFAULT_PRODUCT_IMAGE;
}

export const FALLBACK_OFFER_BY_KEYWORD: Record<string, { reason: string; discountPercentage: number }> = {
  platano: { reason: 'Exceso de cosecha', discountPercentage: 15 },
  mango: { reason: 'Promocion tropical', discountPercentage: 18 },
  papaya: { reason: 'Stock de temporada', discountPercentage: 12 },
  pina: { reason: 'Venta flash de hoy', discountPercentage: 10 },
  sandia: { reason: 'Lote fresco del dia', discountPercentage: 20 },
  fresa: { reason: 'Campana de producto fresco', discountPercentage: 16 },
};
