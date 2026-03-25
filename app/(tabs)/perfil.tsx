import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Modal, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { api, UserDTO } from '@/services/api';
import { session } from '@/services/session';

const COLORS = {
  primary: '#0A8F3E',
  secondary: '#FF6B00',
  success: '#2ECC71',
  light: '#F5F5F5',
  dark: '#1A1A1A',
  border: '#E0E0E0',
  warning: '#FF6B6B',
};

export default function PerfilScreen() {
  const router = useRouter();
  const [user, setUser] = useState<UserDTO | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [street, setStreet] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [message, setMessage] = useState('');
  const [saldo, setSaldo] = useState(0);
  const [rechargeDialogOpen, setRechargeDialogOpen] = useState(false);
  const [cantidadInput, setCantidadInput] = useState('');
  const [metodoSaldo, setMetodoSaldo] = useState<'paypal' | 'tarjeta'>('paypal');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      void loadProfile();
    }, []),
  );

  async function loadProfile() {
    const token = session.getToken();
    if (!token) {
      setMessage('Inicia sesión para ver tu perfil.');
      return;
    }

    try {
      const profile = await api.getCurrentUser(token);
      setUser(profile);
      setSaldo(session.getBalance());
      session.setUser(profile);
      setFirstName(profile.firstName);
      setLastName(profile.lastName);
      setPhoneNumber(profile.phoneNumber || '');
      setStreet(profile.address?.street || '');
      setStreetNumber(profile.address?.streetNumber || '');
      setApartment(profile.address?.apartment || '');
      setCity(profile.address?.city || '');
      setProvince(profile.address?.province || '');
      setPostalCode(profile.address?.postalCode || '');
      setAdditionalInfo(profile.address?.additionalInfo || '');
      setMessage('');
    } catch {
      setMessage('No se pudo cargar el perfil.');
    }
  }

  async function saveProfile() {
    const token = session.getToken();
    if (!token) {
      setMessage('Inicia sesión para actualizar tu perfil.');
      return;
    }

    try {
      const updated = await api.updateCurrentUser(token, {
        firstName,
        lastName,
        phoneNumber,
        address: {
          street,
          streetNumber,
          apartment,
          city,
          province,
          postalCode,
          additionalInfo,
          latitude: 0,
          longitude: 0,
        },
      });
      setUser(updated);
      session.setUser(updated);
      setMessage('✅ Perfil actualizado correctamente.');
      setIsEditing(false);
      setTimeout(() => setMessage(''), 2000);
    } catch {
      setMessage('❌ No se pudo actualizar el perfil.');
    }
  }

  async function deleteAccount() {
    Alert.alert('Dar de baja', '¿Deseas eliminar tu cuenta? Esta acción no se puede deshacer.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          const token = session.getToken();
          if (!token) return;
          try {
            await api.deleteCurrentUser(token);
            session.clear();
            router.replace('/(tabs)/login' as any);
          } catch {
            setMessage('❌ No se pudo tramitar la baja de cuenta.');
          }
        },
      },
    ]);
  }

  function openRechargeDialog() {
    setRechargeDialogOpen(true);
    setCantidadInput('');
    setMetodoSaldo('paypal');
    setPaypalEmail('');
    setCardNumber('');
    setCardName('');
    setCardExpiry('');
    setCardCvv('');
  }

  function closeRechargeDialog() {
    setRechargeDialogOpen(false);
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

  function confirmarSaldo() {
    const cantidad = Number(cantidadInput) || 0;
    if (cantidad <= 0) {
      Alert.alert('Cantidad inválida', 'La cantidad debe ser mayor a 0 EUR.');
      return;
    }

    if (metodoSaldo === 'paypal' && !isValidEmail(paypalEmail)) {
      Alert.alert('Email inválido', 'Introduce un email de PayPal válido.');
      return;
    }

    if (metodoSaldo === 'tarjeta') {
      const cardNumberDigits = cardNumber.replace(/\s/g, '');
      if (!/^\d{16}$/.test(cardNumberDigits)) {
        Alert.alert('Tarjeta inválida', 'El número debe tener 16 dígitos.');
        return;
      }

      if (cardName.trim().length < 3) {
        Alert.alert('Nombre requerido', 'Introduce el nombre del titular.');
        return;
      }

      if (!isValidExpiry(cardExpiry)) {
        Alert.alert('Fecha inválida', 'Usa formato MM/AA y valida que no esté vencida.');
        return;
      }

      if (!/^\d{3,4}$/.test(cardCvv)) {
        Alert.alert('CVV inválido', 'El CVV debe tener 3 o 4 dígitos.');
        return;
      }
    }

    session.addBalance(cantidad);
    const newBalance = session.getBalance();
    setSaldo(newBalance);
    const method = metodoSaldo === 'paypal' ? 'PayPal' : 'Tarjeta';
    setMessage(`✅ Recarga de ${cantidad.toFixed(2)}€ completada con ${method}.`);
    closeRechargeDialog();
    setTimeout(() => setMessage(''), 3000);
  }

  async function logout() {
    Alert.alert('Cerrar sesión', '¿Deseas cerrar tu sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: () => {
          session.clear();
          router.replace('/(tabs)/login' as any);
        },
      },
    ]);
  }

  if (!user) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.emptyState}>
          <MaterialIcons name="account-circle" size={80} color={COLORS.light} />
          <Text style={styles.emptyStateText}>Cargando perfil...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>👤 Mi Perfil</Text>
          <Text style={styles.headerSubtitle}>{user.email}</Text>
        </View>
        <TouchableOpacity onPress={logout}>
          <MaterialIcons name="logout" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {message ? (
          <View style={[styles.messageAlert, message.includes('✅') ? styles.messageSuccess : styles.messageError]}>
            <MaterialIcons 
              name={message.includes('✅') ? 'check-circle' : 'error'} 
              size={18} 
              color={message.includes('✅') ? COLORS.success : COLORS.warning}
            />
            <Text style={styles.messageText}>{message}</Text>
          </View>
        ) : null}

        <View style={styles.walletCard}>
          <View style={styles.walletHeader}>
            <MaterialIcons name="account-balance-wallet" size={28} color={COLORS.primary} />
            <Text style={styles.walletLabel}>Saldo Disponible</Text>
          </View>
          <Text style={styles.walletAmount}>{saldo.toFixed(2)}€</Text>
          <TouchableOpacity style={styles.rechargeBtn} onPress={openRechargeDialog}>
            <MaterialIcons name="add-circle" size={18} color="white" />
            <Text style={styles.rechargeBtnText}>Recargar Saldo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones rápidas</Text>
          <TouchableOpacity style={styles.quickLinkBtn} onPress={() => router.push('/(tabs)/pedidos' as any)}>
            <MaterialIcons name="shopping-bag" size={20} color={COLORS.primary} />
            <Text style={styles.quickLinkText}>Mis Pedidos</Text>
            <MaterialIcons name="chevron-right" size={20} color={COLORS.border} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickLinkBtn} onPress={() => setIsEditing(!isEditing)}>
            <MaterialIcons name="edit" size={20} color={COLORS.primary} />
            <Text style={styles.quickLinkText}>{isEditing ? 'Ver Perfil' : 'Editar Información'}</Text>
            <MaterialIcons name="chevron-right" size={20} color={COLORS.border} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderWithIcon}>
            <MaterialIcons name="person" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Información Personal</Text>
          </View>
          
          {isEditing ? (
            <>
              <Text style={styles.fieldLabel}>Nombre</Text>
              <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} placeholder="Nombre" placeholderTextColor={COLORS.border} />
              <Text style={styles.fieldLabel}>Apellidos</Text>
              <TextInput style={styles.input} value={lastName} onChangeText={setLastName} placeholder="Apellidos" placeholderTextColor={COLORS.border} />
              <Text style={styles.fieldLabel}>Email</Text>
              <View style={styles.inputDisabled}>
                <Text style={styles.inputDisabledText}>{user.email}</Text>
              </View>
              <Text style={styles.fieldLabel}>Teléfono</Text>
              <TextInput style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} placeholder="Teléfono" keyboardType="phone-pad" placeholderTextColor={COLORS.border} />
              <Text style={styles.fieldLabel}>Almacén</Text>
              <View style={styles.inputDisabled}>
                <Text style={styles.inputDisabledText}>{user.warehouseName || 'Sin asignar'}</Text>
              </View>
            </>
          ) : (
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Nombre</Text>
                <Text style={styles.infoValue}>{firstName} {lastName}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Teléfono</Text>
                <Text style={styles.infoValue}>{phoneNumber || 'No configurado'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Almacén</Text>
                <Text style={styles.infoValue}>{user.warehouseName || 'Sin asignar'}</Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderWithIcon}>
            <MaterialIcons name="location-on" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Dirección</Text>
          </View>
          {isEditing ? (
            <>
              <Text style={styles.fieldLabel}>Calle</Text>
              <TextInput style={styles.input} value={street} onChangeText={setStreet} placeholder="Calle" placeholderTextColor={COLORS.border} />
              <View style={styles.rowInputs}>
                <View style={styles.rowInput}>
                  <Text style={styles.fieldLabel}>Nº</Text>
                  <TextInput style={styles.input} value={streetNumber} onChangeText={setStreetNumber} placeholder="Nº" placeholderTextColor={COLORS.border} />
                </View>
                <View style={styles.rowInput}>
                  <Text style={styles.fieldLabel}>Piso</Text>
                  <TextInput style={styles.input} value={apartment} onChangeText={setApartment} placeholder="3ºA" placeholderTextColor={COLORS.border} />
                </View>
              </View>
              <Text style={styles.fieldLabel}>Ciudad</Text>
              <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="Ciudad" placeholderTextColor={COLORS.border} />
              <View style={styles.rowInputs}>
                <View style={styles.rowInput}>
                  <Text style={styles.fieldLabel}>Provincia</Text>
                  <TextInput style={styles.input} value={province} onChangeText={setProvince} placeholder="Provincia" placeholderTextColor={COLORS.border} />
                </View>
                <View style={styles.rowInput}>
                  <Text style={styles.fieldLabel}>CP</Text>
                  <TextInput style={styles.input} value={postalCode} onChangeText={setPostalCode} placeholder="CP" placeholderTextColor={COLORS.border} />
                </View>
              </View>
              <Text style={styles.fieldLabel}>Info Adicional</Text>
              <TextInput style={[styles.input, { height: 80 }]} value={additionalInfo} onChangeText={setAdditionalInfo} placeholder="Portero, timbre..." multiline placeholderTextColor={COLORS.border} />
            </>
          ) : (
            <View style={styles.addressBox}>
              <Text style={styles.addressText}>{street}, {streetNumber}</Text>
              {apartment && <Text style={styles.addressText}>{apartment}</Text>}
              <Text style={styles.addressText}>{postalCode} {city}, {province}</Text>
              {additionalInfo && <Text style={styles.addressNote}>{additionalInfo}</Text>}
            </View>
          )}
        </View>

        <View style={styles.section}>
          {isEditing && (
            <TouchableOpacity style={styles.saveBtn} onPress={saveProfile}>
              <MaterialIcons name="check" size={18} color="white" />
              <Text style={styles.actionBtnText}>Guardar</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.dangerBtn} onPress={deleteAccount}>
            <MaterialIcons name="delete-forever" size={18} color="white" />
            <Text style={styles.actionBtnText}>Dar de Baja</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      <Modal visible={rechargeDialogOpen} animationType="slide" transparent onRequestClose={closeRechargeDialog}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Recargar Saldo</Text>
              <TouchableOpacity onPress={closeRechargeDialog}>
                <MaterialIcons name="close" size={24} color={COLORS.dark} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <Text style={styles.fieldLabel}>Cantidad (EUR)</Text>
              <TextInput style={styles.input} placeholder="25.00" value={cantidadInput} onChangeText={setCantidadInput} keyboardType="decimal-pad" placeholderTextColor={COLORS.border} />

              <Text style={styles.fieldLabel}>Método</Text>
              <View style={styles.methodsRow}>
                <TouchableOpacity style={[styles.methodBtn, metodoSaldo === 'paypal' && styles.methodBtnActive]} onPress={() => setMetodoSaldo('paypal')}>
                  <MaterialIcons name="account-balance-wallet" size={24} color={metodoSaldo === 'paypal' ? 'white' : COLORS.border} />
                  <Text style={[styles.methodBtnText, metodoSaldo === 'paypal' && styles.methodBtnTextActive]}>PayPal</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.methodBtn, metodoSaldo === 'tarjeta' && styles.methodBtnActive]} onPress={() => setMetodoSaldo('tarjeta')}>
                  <MaterialIcons name="credit-card" size={24} color={metodoSaldo === 'tarjeta' ? 'white' : COLORS.border} />
                  <Text style={[styles.methodBtnText, metodoSaldo === 'tarjeta' && styles.methodBtnTextActive]}>Tarjeta</Text>
                </TouchableOpacity>
              </View>

              {metodoSaldo === 'paypal' && (
                <>
                  <Text style={styles.fieldLabel}>Email PayPal</Text>
                  <TextInput style={styles.input} placeholder="user@paypal.com" value={paypalEmail} onChangeText={setPaypalEmail} keyboardType="email-address" autoCapitalize="none" placeholderTextColor={COLORS.border} />
                </>
              )}

              {metodoSaldo === 'tarjeta' && (
                <>
                  <Text style={styles.fieldLabel}>Número</Text>
                  <TextInput style={styles.input} placeholder="1234567890123456" value={cardNumber} onChangeText={setCardNumber} keyboardType="number-pad" placeholderTextColor={COLORS.border} />
                  <Text style={styles.fieldLabel}>Titular</Text>
                  <TextInput style={styles.input} placeholder="Juan García" value={cardName} onChangeText={setCardName} placeholderTextColor={COLORS.border} />
                  <View style={styles.rowInputs}>
                    <View style={styles.rowInput}>
                      <Text style={styles.fieldLabel}>MM/AA</Text>
                      <TextInput style={styles.input} placeholder="12/25" value={cardExpiry} onChangeText={setCardExpiry} placeholderTextColor={COLORS.border} />
                    </View>
                    <View style={styles.rowInput}>
                      <Text style={styles.fieldLabel}>CVV</Text>
                      <TextInput style={styles.input} placeholder="123" value={cardCvv} onChangeText={setCardCvv} keyboardType="number-pad" placeholderTextColor={COLORS.border} />
                    </View>
                  </View>
                </>
              )}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={closeRechargeDialog}>
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={confirmarSaldo}>
                <MaterialIcons name="check" size={18} color="white" />
                <Text style={styles.confirmBtnText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: COLORS.light },
  header: { backgroundColor: 'white', paddingTop: 40, paddingBottom: 16, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerContent: { flex: 1 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: COLORS.primary },
  headerSubtitle: { fontSize: 12, color: '#999', marginTop: 2 },
  scroll: { flex: 1, paddingHorizontal: 12, paddingTop: 12 },
  messageAlert: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 12, marginBottom: 16 },
  messageSuccess: { backgroundColor: '#E8F8F5', borderLeftWidth: 4, borderLeftColor: COLORS.success },
  messageError: { backgroundColor: '#FFE8E8', borderLeftWidth: 4, borderLeftColor: COLORS.warning },
  messageText: { flex: 1, fontSize: 12, fontWeight: '500', color: COLORS.dark },
  walletCard: { backgroundColor: 'white', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 2, borderColor: COLORS.primary },
  walletHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  walletLabel: { fontSize: 13, color: '#666', fontWeight: '500' },
  walletAmount: { fontSize: 32, fontWeight: '700', color: COLORS.primary, marginBottom: 16 },
  rechargeBtn: { flexDirection: 'row', backgroundColor: COLORS.primary, borderRadius: 12, padding: 12, alignItems: 'center', justifyContent: 'center', gap: 8 },
  rechargeBtnText: { color: 'white', fontWeight: '600', fontSize: 14 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.dark },
  sectionHeaderWithIcon: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  quickLinkBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 14, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border, gap: 12 },
  quickLinkText: { flex: 1, fontSize: 14, color: COLORS.dark, fontWeight: '500' },
  infoGrid: { backgroundColor: 'white', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: COLORS.border },
  infoItem: { marginBottom: 12 },
  infoLabel: { fontSize: 11, color: '#999', fontWeight: '600', marginBottom: 4 },
  infoValue: { fontSize: 13, fontWeight: '600', color: COLORS.dark },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: COLORS.dark, marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: 'white', borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: COLORS.dark },
  inputDisabled: { backgroundColor: COLORS.light, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
  inputDisabledText: { fontSize: 14, color: '#999' },
  rowInputs: { flexDirection: 'row', gap: 12 },
  rowInput: { flex: 1 },
  addressBox: { backgroundColor: 'white', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: COLORS.border },
  addressText: { fontSize: 13, color: COLORS.dark, fontWeight: '500', marginBottom: 4 },
  addressNote: { fontSize: 11, color: '#999', fontStyle: 'italic', marginTop: 8, borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 8 },
  saveBtn: { flexDirection: 'row', backgroundColor: COLORS.success, borderRadius: 12, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 },
  dangerBtn: { flexDirection: 'row', backgroundColor: COLORS.warning, borderRadius: 12, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', gap: 8 },
  actionBtnText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyStateText: { marginTop: 16, fontSize: 14, color: '#999' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: 12, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  modalTitle: { fontSize: 18, fontWeight: '700', color: COLORS.dark },
  modalScroll: { paddingHorizontal: 16, paddingTop: 16 },
  methodsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  methodBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 12, backgroundColor: COLORS.light, borderWidth: 2, borderColor: COLORS.border, gap: 8 },
  methodBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  methodBtnText: { fontSize: 12, fontWeight: '600', color: '#999' },
  methodBtnTextActive: { color: 'white' },
  modalActions: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, paddingVertical: 16, borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: COLORS.light },
  cancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  cancelBtnText: { color: COLORS.dark, fontWeight: '600', fontSize: 14 },
  confirmBtn: { flex: 1.2, flexDirection: 'row', backgroundColor: COLORS.primary, paddingVertical: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center', gap: 8 },
  confirmBtnText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
});
