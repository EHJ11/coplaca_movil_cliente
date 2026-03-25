import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { api, OrderDTO } from '@/services/api';
import { session } from '@/services/session';

export default function PedidosScreen() {
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [error, setError] = useState('');

  useFocusEffect(
    useCallback(() => {
      void loadOrders();
    }, []),
  );

  async function loadOrders() {
    const token = session.getToken();
    if (!token) {
      setError('Inicia sesion para ver tus pedidos.');
      setOrders(session.getOrders());
      return;
    }

    try {
      const result = await api.getMyOrders(token);
      const mergedOrders = session.mergeWithStored(result);
      session.saveOrders(mergedOrders);
      setOrders(mergedOrders);
      setError('');
    } catch {
      const localOrders = session.getOrders();
      setOrders(localOrders);
      setError(
        localOrders.length > 0
          ? 'Mostrando pedidos guardados localmente (sin conexion).'
          : 'No se pudieron cargar los pedidos.',
      );
    }
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Image source={require('@/assets/images/coplaca.png')} style={styles.headerLogo} resizeMode="contain" />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.pedidoBox}>
          <Text style={styles.pedidoTitle}>Pedidos</Text>
          <Text style={styles.pedidoSubtitle}>Vista de todos los pedidos hechos</Text>
          {!!error && <Text style={styles.error}>{error}</Text>}
          {orders.map((order) => (
            <View key={order.id} style={styles.pedidoCard}>
              <View style={styles.pedidoRow}>
                <Text style={styles.pedidoLabel}>ID {order.orderNumber || order.id}</Text>
                <Text style={styles.pedidoLabel}>{order.status}</Text>
              </View>
              <View style={styles.pedidoDivider} />
              <View style={styles.pedidoRow}>
                <Text style={styles.pedidoLabel}>{order.createdAt?.replace('T', ' ').slice(0, 16) || '-'}</Text>
                <Text style={styles.pedidoLabel}>{order.totalPrice.toFixed(2)} EUR</Text>
              </View>
              {order.items.map((item) => (
                <Text key={`${order.id}-${item.productId}`} style={styles.itemText}>
                  {item.productName}: {item.quantity} kg
                </Text>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#fff' },
  header: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#0A8F3E',
  },
  headerLogo: { width: 40, height: 40 },
  scroll: { flex: 1 },
  pedidoBox: { margin: 16, backgroundColor: '#FFC107', borderRadius: 20, padding: 16 },
  pedidoTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 4, color: '#000' },
  pedidoSubtitle: { fontSize: 12, textAlign: 'center', color: '#333', marginBottom: 14 },
  error: { color: '#8A0000', fontWeight: 'bold', marginBottom: 10 },
  pedidoCard: {
    backgroundColor: '#0A8F3E',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  pedidoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  pedidoLabel: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  pedidoDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.3)', marginVertical: 6 },
  itemText: { color: '#fff', fontSize: 12, marginTop: 3 },
});
