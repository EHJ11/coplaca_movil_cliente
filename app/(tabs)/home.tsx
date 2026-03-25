import { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { api, ProductDTO } from '@/services/api';
import { session } from '@/services/session';

const DEFAULT_PRODUCT_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg';

const PRODUCT_IMAGE_BY_KEYWORD: Record<string, string> = {
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

const FALLBACK_OFFER_BY_KEYWORD: Record<string, { reason: string; discountPercentage: number }> = {
  platano: { reason: 'Exceso de cosecha', discountPercentage: 15 },
  mango: { reason: 'Promocion tropical', discountPercentage: 18 },
  papaya: { reason: 'Stock de temporada', discountPercentage: 12 },
  pina: { reason: 'Venta flash de hoy', discountPercentage: 10 },
  sandia: { reason: 'Lote fresco del dia', discountPercentage: 20 },
  fresa: { reason: 'Campana de producto fresco', discountPercentage: 16 },
};

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductDTO[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const [quantityByProduct, setQuantityByProduct] = useState<Record<number, string>>({});
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [categories, setCategories] = useState<string[]>(['Todas']);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyOffers, setOnlyOffers] = useState(false);
  const [onlyFresh, setOnlyFresh] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    async function loadProducts() {
      try {
        const result = await api.getProducts('', session.getToken());
        setProducts(result);

        const uniqueCategories = Array.from(
          new Set(result.map(p => p.categoryName || 'Otros'))
        ) as string[];
        setCategories(['Todas', ...uniqueCategories.sort()]);

        setMessage('');
        setFilteredProducts(result);
      } catch {
        setMessage('No se pudieron cargar los productos. Verifica tu conexión.');
      }
    }

    void loadProducts();
    const count = session.getCart().length;
    setCartCount(count);
  }, []);

  function applyFilters(
    prods: ProductDTO[],
    query: string,
    category: string,
    inStock: boolean,
    offers: boolean,
    fresh: boolean
  ) {
    let filtered = [...prods];

    // Search
    if (query.trim()) {
      const normalized = normalizeText(query);
      filtered = filtered.filter(p =>
        normalizeText(p.name).includes(normalized) ||
        normalizeText(p.description || '').includes(normalized)
      );
    }

    // Category
    if (category !== 'Todas') {
      filtered = filtered.filter(p => (p.categoryName || 'Otros') === category);
    }

    // Stock
    if (inStock) {
      filtered = filtered.filter(p => (p.stock || 0) > 0);
    }

    // Offers
    if (offers) {
      filtered = filtered.filter(p => (p.discount || 0) > 0 || Object.keys(FALLBACK_OFFER_BY_KEYWORD).some(k => normalizeText(p.name).includes(k)));
    }

    // Fresh
    if (fresh) {
      filtered = filtered.filter(isFreshProduct);
    }

    setFilteredProducts(filtered.length === 0 && query.trim().length === 0 && !inStock && !offers && !fresh ? prods : filtered);
  }

  function onSearchInput(query: string) {
    setSearchQuery(query);
    applyFilters(products, query, selectedCategory, onlyInStock, onlyOffers, onlyFresh);
  }

  function setCategoryFilter(category: string) {
    setSelectedCategory(category);
    applyFilters(products, searchQuery, category, onlyInStock, onlyOffers, onlyFresh);
  }

  function toggleInStock() {
    const newVal = !onlyInStock;
    setOnlyInStock(newVal);
    applyFilters(products, searchQuery, selectedCategory, newVal, onlyOffers, onlyFresh);
  }

  function toggleOffers() {
    const newVal = !onlyOffers;
    setOnlyOffers(newVal);
    applyFilters(products, searchQuery, selectedCategory, onlyInStock, newVal, onlyFresh);
  }

  function toggleFresh() {
    const newVal = !onlyFresh;
    setOnlyFresh(newVal);
    applyFilters(products, searchQuery, selectedCategory, onlyInStock, onlyOffers, newVal);
  }

  function clearFilters() {
    setSearchQuery('');
    setSelectedCategory('Todas');
    setOnlyInStock(false);
    setOnlyOffers(false);
    setOnlyFresh(false);
    setShowFilters(false);
    applyFilters(products, '', 'Todas', false, false, false);
  }

  function addToCart(product: ProductDTO) {
    const raw = quantityByProduct[product.id] ?? '1';
    const quantityKg = Number(raw);
    if (Number.isNaN(quantityKg) || quantityKg <= 0) {
      Alert.alert('Error', 'Introduce una cantidad válida en kg.');
      return;
    }

    session.addToCart(product, quantityKg);
    setQuantityByProduct(prev => ({ ...prev, [product.id]: '1' }));
    setMessage(`✅ ${product.name} añadido (${quantityKg} kg).`);
    
    const newCount = session.getCart().length;
    setCartCount(newCount);
    
    setTimeout(() => setMessage(''), 2000);
  }

  function normalizeText(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[^\w\s]|_/g, ' ')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  function resolveFallbackOffer(product: ProductDTO) {
    const normalizedName = normalizeText(product.name ?? '');
    const matchedKeyword = Object.keys(FALLBACK_OFFER_BY_KEYWORD).find((keyword) =>
      normalizedName.includes(keyword),
    );
    return matchedKeyword ? FALLBACK_OFFER_BY_KEYWORD[matchedKeyword] : null;
  }

  function hasAnyOffer(product: ProductDTO): boolean {
    const apiDiscount = Number(product.discount ?? 0);
    return Boolean(product.offerReason) || apiDiscount > 0 || resolveFallbackOffer(product) !== null;
  }

  function isFreshProduct(product: ProductDTO): boolean {
    return product.isFresh === true || normalizeText(product.name || '').includes('fresco');
  }

  function getProductImage(product: ProductDTO): string {
    const imageFromApi = (product.imageUrl ?? '').trim();
    if (imageFromApi.length > 0) return imageFromApi;

    const normalizedName = normalizeText(product.name ?? '');
    const matchedKeyword = Object.keys(PRODUCT_IMAGE_BY_KEYWORD).find((keyword) =>
      normalizedName.includes(keyword),
    );
    return matchedKeyword ? PRODUCT_IMAGE_BY_KEYWORD[matchedKeyword] : DEFAULT_PRODUCT_IMAGE;
  }

  function getDiscountPrice(product: ProductDTO): number {
    const basePrice = Number(product.price ?? product.unitPrice ?? 0);
    const discount = Number(product.discount ?? product.discountPercentage ?? 0);
    return basePrice * (1 - discount / 100);
  }

  const displayOffers = filteredProducts
    .filter(p => hasAnyOffer(p))
    .map((product) => {
      const discount = Number(product.discount ?? 0) || resolveFallbackOffer(product)?.discountPercentage || 0;
      const reason = product.offerReason || resolveFallbackOffer(product)?.reason || 'Promoción';
      return { product, discount, reason };
    })
    .slice(0, 5);

  if (filteredProducts.length === 0 && searchQuery.length === 0) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🥗 COPLACA</Text>
          <Text style={styles.headerSubtitle}>Tienda online por kilo</Text>
        </View>
        <View style={styles.emptyState}>
          <MaterialIcons name="shopping-bag" size={60} color="#0A8F3E" />
          <Text style={styles.emptyStateText}>Cargando productos...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>🥗 COPLACA</Text>
          <Text style={styles.headerSubtitle}>Fresco a tu puerta</Text>
        </View>
        <TouchableOpacity style={styles.cartBadge}>
          <MaterialIcons name="shopping-cart" size={24} color="white" />
          {cartCount > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{cartCount}</Text></View>}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Search & Filters */}
        <View style={styles.topSection}>
          <View style={styles.searchBox}>
            <MaterialIcons name="search" size={20} color="#0A8F3E" />
            <TextInput
              style={styles.searchInput}
              placeholder="Busca frutas y verduras..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={onSearchInput}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => onSearchInput('')}>
                <MaterialIcons name="close" size={18} color="#666" />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Filter Button */}
          <TouchableOpacity
            style={[styles.filterToggleBtn, showFilters && styles.filterToggleBtnActive]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <MaterialIcons name="tune" size={20} color={showFilters ? 'white' : '#0A8F3E'} />
            <Text style={[styles.filterToggleText, showFilters && styles.filterToggleTextActive]}>Filtros</Text>
          </TouchableOpacity>
        </View>

        {/* Expandable Filters Panel */}
        {showFilters && (
          <View style={styles.filterPanel}>
            {/* Categories */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Categorías</Text>
              <View style={styles.categoryGrid}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.categoryBtn, selectedCategory === cat && styles.categoryBtnActive]}
                    onPress={() => setCategoryFilter(cat)}
                  >
                    <Text style={[styles.categoryBtnText, selectedCategory === cat && styles.categoryBtnTextActive]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Toggles */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Filtros rápidos</Text>
              <View style={styles.toggleGrid}>
                <TouchableOpacity style={[styles.toggle, onlyInStock && styles.toggleActive]} onPress={toggleInStock}>
                  <MaterialIcons name="check-circle" size={20} color={onlyInStock ? 'white' : '#0A8F3E'} />
                  <Text style={[styles.toggleLabel, onlyInStock && styles.toggleLabelActive]}>Solo stock</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.toggle, onlyOffers && styles.toggleActive]} onPress={toggleOffers}>
                  <MaterialIcons name="local-offer" size={20} color={onlyOffers ? 'white' : '#FF6B00'} />
                  <Text style={[styles.toggleLabel, onlyOffers && styles.toggleLabelActive]}>Ofertas</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.toggle, onlyFresh && styles.toggleActive]} onPress={toggleFresh}>
                  <MaterialIcons name="eco" size={20} color={onlyFresh ? 'white' : '#2ECC71'} />
                  <Text style={[styles.toggleLabel, onlyFresh && styles.toggleLabelActive]}>Frescos</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Clear Filters */}
            <TouchableOpacity style={styles.clearFiltersBtn} onPress={clearFilters}>
              <Text style={styles.clearFiltersText}>Limpiar filtros</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Message Alert */}
        {message ? (
          <View style={styles.messageAlert}>
            <MaterialIcons name="info" size={18} color="#0A8F3E" />
            <Text style={styles.messageText}>{message}</Text>
          </View>
        ) : null}

        {/* Offers Section */}
        {displayOffers.length > 0 ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="local-offer" size={24} color="#FF6B00" />
              <Text style={styles.sectionTitle}>Ofertas de Hoy 🔥</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12 }}>
              {displayOffers.map((offer, idx) => (
                <View key={idx} style={styles.offerCard}>
                  <Image
                    source={{ uri: getProductImage(offer.product) }}
                    style={styles.offerImage}
                    defaultSource={{ uri: DEFAULT_PRODUCT_IMAGE }}
                  />
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountBadgeText}>-{offer.discount}%</Text>
                  </View>
                  <Text style={styles.offerName} numberOfLines={2}>{offer.product.name}</Text>
                  <Text style={styles.offerReason} numberOfLines={1}>{offer.reason}</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceOld}>{offer.product.price || offer.product.unitPrice}€</Text>
                    <Text style={styles.priceNew}>{getDiscountPrice(offer.product).toFixed(2)}€</Text>
                  </View>
                  <View style={styles.quantityBox}>
                    <TextInput
                      style={styles.quantityInput}
                      keyboardType="numeric"
                      placeholder="kg"
                      value={quantityByProduct[offer.product.id] ?? '1'}
                      onChangeText={(val) => setQuantityByProduct(prev => ({ ...prev, [offer.product.id]: val }))}
                    />
                    <TouchableOpacity style={styles.addBtnSmall} onPress={() => addToCart(offer.product)}>
                      <MaterialIcons name="add-shopping-cart" size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        ) : null}

        {/* Products Grid */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="store" size={24} color="#0A8F3E" />
            <Text style={styles.sectionTitle}>Todos los Productos</Text>
            <Text style={styles.productCount}>({filteredProducts.length})</Text>
          </View>
          
          {filteredProducts.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="search-off" size={50} color="#ddd" />
              <Text style={styles.emptyStateText}>No hay productos que coincidan</Text>
            </View>
          ) : (
            <View style={styles.productsGrid}>
              {filteredProducts.map((product) => (
                <View key={product.id} style={styles.productGridCard}>
                  <View style={styles.productImageContainer}>
                    <Image
                      source={{ uri: getProductImage(product) }}
                      style={styles.productGridImage}
                      defaultSource={{ uri: DEFAULT_PRODUCT_IMAGE }}
                    />
                    {hasAnyOffer(product) && (
                      <View style={styles.offerTag}>
                        <MaterialIcons name="local-offer" size={14} color="white" />
                      </View>
                    )}
                    {product.stock && product.stock <= 5 && (
                      <View style={styles.lowStockTag}>
                        <Text style={styles.lowStockText}>Poco stock</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={styles.productGridName} numberOfLines={2}>{product.name}</Text>
                    <Text style={styles.productCategory} numberOfLines={1}>{product.categoryName || 'Otros'}</Text>
                    <View style={styles.priceContainer}>
                      <Text style={styles.productPrice}>{product.price || product.unitPrice}€</Text>
                      <Text style={styles.productUnit}>/{product.unit || 'kg'}</Text>
                    </View>
                  </View>
                  <View style={styles.actionRow}>
                    <TextInput
                      style={styles.quantitySmallInput}
                      keyboardType="numeric"
                      placeholder="1"
                      value={quantityByProduct[product.id] ?? '1'}
                      onChangeText={(val) => setQuantityByProduct(prev => ({ ...prev, [product.id]: val }))}
                    />
                    <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(product)}>
                      <MaterialIcons name="add-shopping-cart" size={18} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const COLORS = {
  primary: '#0A8F3E',
  secondary: '#FF6B00',
  success: '#2ECC71',
  light: '#F5F5F5',
  dark: '#1A1A1A',
  border: '#E0E0E0',
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  header: {
    backgroundColor: 'white',
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  cartBadge: {
    position: 'relative',
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  scroll: {
    flex: 1,
  },
  topSection: {
    padding: 12,
    backgroundColor: 'white',
    marginBottom: 8,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.dark,
  },
  filterToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.light,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    gap: 6,
  },
  filterToggleBtnActive: {
    backgroundColor: COLORS.primary,
  },
  filterToggleText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 12,
  },
  filterToggleTextActive: {
    color: 'white',
  },
  filterPanel: {
    backgroundColor: 'white',
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 10,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.light,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  categoryBtnActive: {
    backgroundColor: COLORS.primary,
  },
  categoryBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  categoryBtnTextActive: {
    color: 'white',
  },
  toggleGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  toggle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.light,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  toggleActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  toggleLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.dark,
  },
  toggleLabelActive: {
    color: 'white',
  },
  clearFiltersBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: COLORS.light,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  clearFiltersText: {
    color: COLORS.dark,
    fontWeight: '600',
    fontSize: 12,
  },
  messageAlert: {
    marginHorizontal: 12,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#E8F8F5',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  messageText: {
    flex: 1,
    color: COLORS.primary,
    fontWeight: '500',
    fontSize: 12,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.dark,
  },
  productCount: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  offerCard: {
    width: 160,
    marginRight: 10,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 10,
  },
  offerImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    backgroundColor: COLORS.light,
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: COLORS.secondary,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  discountBadgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  offerName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.dark,
    marginTop: 8,
  },
  offerReason: {
    fontSize: 11,
    color: COLORS.secondary,
    fontWeight: '500',
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  priceOld: {
    fontSize: 11,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  priceNew: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  quantityBox: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  quantityInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 8,
    fontSize: 12,
    textAlign: 'center',
  },
  addBtnSmall: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  productGridCard: {
    width: (width - 40) / 2,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  productImageContainer: {
    position: 'relative',
  },
  productGridImage: {
    width: '100%',
    height: 140,
    backgroundColor: COLORS.light,
  },
  offerTag: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.secondary,
    borderRadius: 20,
    padding: 6,
  },
  lowStockTag: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: '#FF6B6B',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  lowStockText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  productInfo: {
    padding: 10,
  },
  productGridName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.dark,
  },
  productCategory: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
    marginTop: 6,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
  },
  productUnit: {
    fontSize: 11,
    color: '#999',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  quantitySmallInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 6,
    fontSize: 12,
    textAlign: 'center',
  },
  addBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
