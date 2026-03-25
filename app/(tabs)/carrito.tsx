import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { api, OrderDTO } from '@/services/api';
import { CartItem, session } from '@/services/session';

type PaymentMethod = 'fisico' | 'paypal' | 'tarjeta';

const COLORS = {
  primary: '#0A8F3E',
  secondary: '#FF6B00',
  success: '#2ECC71',
  light: '#F5F5F5',
  dark: '#1A1A1A',
  border: '#E0E0E0',
  warning: '#FF6B6B',
};

export default function CarritoScreen() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [message, setMessage] = useState('');
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('fisico');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  useFocusEffect(
    useCallback(() => {
      setItems(session.getCart());
    }, []),
  );

  const total = items.reduce((acc, item) => acc + item.quantityKg * item.unitPrice, 0);
  const itemCount = items.length;

  function updateItems(nextItems: CartItem[]) {
    session.setCart(nextItems);
    setItems(session.getCart());
  }

  function increment(productId: number) {
    updateItems(
      items.map((item) =>
        item.productId === productId
          ? { ...item, quantityKg: Number(Math.min(item.stockQuantity || 999, item.quantityKg + 0.5).toFixed(2)) }
          : item,
      ),
    );
  }

  function decrement(productId: number) {
    updateItems(
      items.map((item) =>
        item.productId === productId
          ? { ...item, quantityKg: Number(Math.max(0.5, item.quantityKg - 0.5).toFixed(2)) }
          : item,
      ),
    );
  }

  function removeItem(productId: number) {
    updateItems(items.filter((item) => item.productId !== productId));
    setMessage('Producto eliminado del carrito.');
    setTimeout(() => setMessage(''), 2000);
  }

  function clearCart() {
    Alert.alert('Vaciar carrito', '¿Deseas vaciar todo el carrito?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Vaciar',
        style: 'destructive',
        onPress: () => {
          updateItems([]);
          setMessage('Carrito vaciado correctamente.');
          setTimeout(() => setMessage(''), 2000);
        },
      },
    ]);
  }

  function openPaymentDialog() {
    setPaymentDialogOpen(true);
    setSelectedPaymentMethod('fisico');
    setPaypalEmail('');
    setCardNumber('');
    setCardName('');
    setCardExpiry('');
    setCardCvv('');
  }

  function closePaymentDialog() {
    setPaymentDialogOpen(false);
  }

  function isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function isValidExpiry(value: string): boolean {
    const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(value.trim());
    if (!match) return false;
    const month = Number(match[1]);
    const year = 2000 + Number(match[2]);
    const now = new Date();
    const expiry = new Date(year, month);
    return expiry > new Date(now.getFullYear(), now.getMonth());
  }

  function buildLocalOrderFromCart(): OrderDTO {
    const now = new Date();
    const timestamp = now.getTime();
    const paymentMethodMap: Record<PaymentMethod, string> = {
      fisico: 'PHYSICAL',
      paypal: 'PAYPAL',
      tarjeta: 'CARD',
    };

    return {
      id: -timestamp,
      orderNumber: `LOCAL-${timestamp}`,
      status: 'PENDING',
      totalPrice: Number(total.toFixed(2)),
      createdAt: now.toISOString(),
      items: items.map((item) => ({
        productId: item.productId,
        productName: item.name,
        quantity: item.quantityKg,
        unitPrice: item.unitPrice,
      })),
      paymentMethod: paymentMethodMap[selectedPaymentMethod],
      paymentStatus: 'PENDING',
    } as OrderDTO;
  }

  async function confirmPayment() {
    const token = session.getToken();
    if (!token) {
      setMessage('Inicia sesión para pagar.');
      return;
    }

    if (items.length === 0) {
      setMessage('Tu carrito está vacío.');
      return;
    }

    if (selectedPaymentMethod === 'paypal' && !isValidEmail(paypalEmail)) {
      Alert.alert('Email inválido', 'Introduce un email válido para PayPal.');
      return;
    }

    if (selectedPaymentMethod === 'tarjeta') {
      const cardNumberDigits = cardNumber.split(' ').join('');
      if (!/^\d{16}$/.test(cardNumberDigits)) {
        Alert.alert('Tarjeta inválida', 'El número de tarjeta debe tener 16 dígitos.');
        return;
      }

      if (cardName.trim().length < 3) {
        Alert.alert('Nombre requerido', 'Introduce el nombre del titular de la tarjeta.');
        return;
      }

      if (!isValidExpiry(cardExpiry)) {
        Alert.alert('Fecha inválida', 'La fecha de caducidad debe ser MM/AA y estar vigente.');
        return;
      }

      if (!/^\d{3,4}$/.test(cardCvv)) {
        Alert.alert('CVV inválido', 'El CVV debe tener 3 o 4 dígitos.');
        return;
      }
    }

    try {
      const createdOrder = await api.createOrder(
        token,
        items.map((item) => ({
          productId: item.productId,
          quantity: item.quantityKg,
        })),
      );
      session.prependOrder(createdOrder);
      updateItems([]);
      const message = selectedPaymentMethod === 'fisico' 
        ? '✅ Pedido confirmado. Pagarás en efectivo al recibirlo.'
        : '✅ Pedido confirmado y pago completado.';
      setMessage(message);
      closePaymentDialog();
      setTimeout(() => router.push('/(tabs)/pedidos' as any), 1500);
    } catch {
      const localOrder = buildLocalOrderFromCart();
      session.prependOrder(localOrder);
      updateItems([]);
      setMessage('⚠️ Pedido guardado localmente. Se sincronizará cuando haya conexión.');
      closePaymentDialog();
      setTimeout(() => router.push('/(tabs)/pedidos' as any), 1500);
    }
  }

  function pay() {
    if (items.length === 0) {
      Alert.alert('Carrito vacío', 'Añade productos antes de pagar.');
      return;
    }
    openPaymentDialog();
  }

  const emptyCart = items.length === 0;

  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>🛒 Mi Carrito</Text>
          {!emptyCart && <Text style={styles.cartItemCount}>{itemCount} artículos</Text>}
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {message ? (
          <View style={[styles.messageAlert, message.includes('✅') ? styles.messageSuccess : styles.messageWarning]}>
            <MaterialIcons 
              name={message.includes('✅') ? 'check-circle' : 'warning'} 
              size={18} 
              color={message.includes('✅') ? COLORS.success : COLORS.secondary}
            />
            <Text style={styles.messageText}>{message}</Text>
          </View>
        ) : null}

        {emptyCart ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="shopping-cart" size={80} color={COLORS.light} />
            <Text style={styles.emptyStateTitle}>Tu carrito está vacío</Text>
            <Text style={styles.emptyStateSubtitle}>Ve a la tienda y añade productos frescos</Text>
            <TouchableOpacity style={styles.goShoppingBtn} onPress={() => router.push('/(tabs)/home' as any)}>
              <MaterialIcons name="shopping-bag" size={16} color="white" />
              <Text style={styles.goShoppingBtnText}>Ir a la tienda</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Cart Items */}
            <View style={styles.itemsSection}>
              <Text style={styles.sectionTitle}>Productos</Text>
              {items.map((item, index) => (
                <View key={item.productId} style={[styles.cartItemCard, index === items.length - 1 && styles.lastCard]}>
                  <View style={styles.itemImageContainer}>
                    <View style={styles.itemImagePlaceholder}>
                      <MaterialIcons name="image-not-supported" size={28} color={COLORS.border} />
                    </View>
                  </View>

                  <View style={styles.itemContent}>
                    <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                    <Text style={styles.itemCategory}>{item.categoryName || 'Producto'}</Text>
                    <View style={styles.priceQtyRow}>
                      <Text style={styles.itemPrice}>{item.unitPrice}€/kg</Text>
                      <Text style={styles.itemQty}>{(item.quantityKg * item.unitPrice).toFixed(2)}€</Text>
                    </View>
                  </View>

                  <View style={styles.quantityControls}>
                    <TouchableOpacity 
                      style={styles.qtyBtn}
                      onPress={() => decrement(item.productId)}
                    >
                      <MaterialIcons name="remove" size={16} color={COLORS.primary} />
                    </TouchableOpacity>
                    <Text style={styles.qtyDisplay}>{item.quantityKg}</Text>
                    <TouchableOpacity 
                      style={styles.qtyBtn}
                      onPress={() => increment(item.productId)}
                    >
                      <MaterialIcons name="add" size={16} color={COLORS.primary} />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity 
                    style={styles.removeBtn}
                    onPress={() => removeItem(item.productId)}
                  >
                    <MaterialIcons name="delete-outline" size={18} color={COLORS.warning} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Summary */}
            <View style={styles.summarySection}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal:</Text>
                <Text style={styles.summaryValue}>{total.toFixed(2)}€</Text>
              </View>
              <View style={[styles.summaryRow, { borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 10 }]}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalValue}>{total.toFixed(2)}€</Text>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actionsSection}>
              <TouchableOpacity style={styles.clearCartBtn} onPress={clearCart}>
                <MaterialIcons name="delete-sweep" size={18} color={COLORS.primary} />
                <Text style={styles.clearCartBtnText}>Vaciar carrito</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Pay Button */}
      {!emptyCart && (
        <View style={styles.payButtonContainer}>
          <TouchableOpacity style={styles.payButton} onPress={pay}>
            <MaterialIcons name="payment" size={20} color="white" />
            <Text style={styles.payButtonText}>Pagar {total.toFixed(2)}€</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Payment Modal */}
      <Modal visible={paymentDialogOpen} animationType="slide" transparent onRequestClose={closePaymentDialog}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Forma de Pago</Text>
              <TouchableOpacity onPress={closePaymentDialog}>
                <MaterialIcons name="close" size={24} color={COLORS.dark} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              {/* Payment Methods */}
              <View style={styles.methodsSection}>
                <Text style={styles.methodsTitle}>Elige tu método de pago</Text>
                <View style={styles.methodsGrid}>
                  {(['fisico', 'paypal', 'tarjeta'] as const).map((method) => (
                    <TouchableOpacity
                      key={method}
                      style={[styles.methodCard, selectedPaymentMethod === method && styles.methodCardActive]}
                      onPress={() => setSelectedPaymentMethod(method)}
                    >
                      <MaterialIcons
                        name={method === 'fisico' ? 'money' : method === 'paypal' ? 'account-balance-wallet' : 'credit-card'}
                        size={28}
                        color={selectedPaymentMethod === method ? COLORS.primary : COLORS.border}
                      />
                      <Text style={[styles.methodCardText, selectedPaymentMethod === method && styles.methodCardTextActive]}>
                        {method === 'fisico' ? 'Efectivo' : method === 'paypal' ? 'PayPal' : 'Tarjeta'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* PayPal Section */}
              {selectedPaymentMethod === 'paypal' && (
                <View style={styles.formSection}>
                  <Text style={styles.formLabel}>Email de PayPal</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="tu.email@paypal.com"
                    value={paypalEmail}
                    onChangeText={setPaypalEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholderTextColor={COLORS.border}
                  />
                  <View style={styles.infoBox}>
                    <MaterialIcons name="info" size={16} color={COLORS.primary} />
                    <Text style={styles.infoText}>Se abrirá PayPal para completar el pago de {total.toFixed(2)}€</Text>
                  </View>
                </View>
              )}

              {/* Card Section */}
              {selectedPaymentMethod === 'tarjeta' && (
                <View style={styles.formSection}>
                  <Text style={styles.formLabel}>Número de Tarjeta</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChangeText={setCardNumber}
                    keyboardType="number-pad"
                    placeholderTextColor={COLORS.border}
                  />

                  <Text style={styles.formLabel}>Nombre del Titular</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="Juan García"
                    value={cardName}
                    onChangeText={setCardName}
                    placeholderTextColor={COLORS.border}
                  />

                  <View style={styles.cardGridRow}>
                    <View style={styles.cardGridItem}>
                      <Text style={styles.formLabel}>Caducidad</Text>
                      <TextInput
                        style={styles.formInput}
                        placeholder="MM/AA"
                        value={cardExpiry}
                        onChangeText={setCardExpiry}
                        placeholderTextColor={COLORS.border}
                      />
                    </View>
                    <View style={styles.cardGridItem}>
                      <Text style={styles.formLabel}>CVV</Text>
                      <TextInput
                        style={styles.formInput}
                        placeholder="123"
                        value={cardCvv}
                        onChangeText={setCardCvv}
                        keyboardType="number-pad"
                        placeholderTextColor={COLORS.border}
                      />
                    </View>
                  </View>
                </View>
              )}

              {/* Physical Payment */}
              {selectedPaymentMethod === 'fisico' && (
                <View style={styles.infoBox}>
                  <MaterialIcons name="done-all" size={20} color={COLORS.success} />
                  <Text style={styles.infoText}>Pagarás {total.toFixed(2)}€ en efectivo cuando recibas tu pedido</Text>
                </View>
              )}
            </ScrollView>

            {/* Modal Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={closePaymentDialog}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirmBtn} onPress={() => void confirmPayment()}>
                <MaterialIcons name="check" size={18} color="white" />
                <Text style={styles.modalConfirmText}>Confirmar Pago</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

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
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
  },
  cartItemCount: {
    fontSize: 12,
    color: '#999',
    backgroundColor: COLORS.light,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  messageAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  messageSuccess: {
    backgroundColor: '#E8F8F5',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.success,
  },
  messageWarning: {
    backgroundColor: '#FFF3E0',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.secondary,
  },
  messageText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.dark,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.dark,
    marginTop: 20,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
  },
  goShoppingBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
    alignItems: 'center',
  },
  goShoppingBtnText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  itemsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: 12,
  },
  cartItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  lastCard: {
    marginBottom: 0,
  },
  itemImageContainer: {
    marginRight: 12,
  },
  itemImagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: COLORS.light,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.dark,
  },
  itemCategory: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  priceQtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  itemPrice: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  itemQty: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.light,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginRight: 8,
  },
  qtyBtn: {
    padding: 4,
  },
  qtyDisplay: {
    paddingHorizontal: 6,
    fontWeight: '600',
    fontSize: 12,
    color: COLORS.dark,
  },
  removeBtn: {
    padding: 8,
  },
  summarySection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.dark,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.dark,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  actionsSection: {
    marginBottom: 20,
  },
  clearCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 12,
  },
  clearCartBtnText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 13,
  },
  payButtonContainer: {
    padding: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  payButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  payButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.dark,
  },
  modalScroll: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  methodsSection: {
    marginBottom: 24,
  },
  methodsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 12,
  },
  methodsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  methodCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: COLORS.light,
    borderWidth: 2,
    borderColor: COLORS.border,
    gap: 8,
  },
  methodCardActive: {
    backgroundColor: '#E8F8F5',
    borderColor: COLORS.primary,
  },
  methodCardText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    textAlign: 'center',
  },
  methodCardTextActive: {
    color: COLORS.primary,
  },
  formSection: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.dark,
    marginBottom: 12,
  },
  cardGridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cardGridItem: {
    flex: 1,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E8F8F5',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    borderRadius: 8,
    padding: 12,
    gap: 10,
    alignItems: 'flex-start',
    marginVertical: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.primary,
    lineHeight: 18,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.light,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  modalCancelText: {
    color: COLORS.dark,
    fontWeight: '600',
    fontSize: 14,
  },
  modalConfirmBtn: {
    flex: 1.2,
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  modalConfirmText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
