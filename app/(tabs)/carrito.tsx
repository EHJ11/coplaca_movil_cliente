import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CarritoScreen() {
  const CartItem = () => (
    <View style={styles.cartItem}>
      <Image
        source={require("@/assets/images/cerezas.png")}
        style={styles.cartItemImage}
        resizeMode="contain"
      />
      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemName}>Nombre</Text>
        <Text style={styles.cartItemPrice}>Precio/Peso</Text>
        <View style={styles.cartItemQty}>
          <TouchableOpacity style={styles.qtyBtn}>
            <Text style={styles.qtyBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qtyText}>Cantidad</Text>
          <TouchableOpacity style={styles.qtyBtn}>
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const RecoCard = () => (
    <View style={styles.recoCard}>
      <Image
        source={require("@/assets/images/cerezas.png")}
        style={styles.recoImage}
        resizeMode="contain"
      />
      <Text style={styles.recoName}>Nombre</Text>
      <Text style={styles.recoOriginal}>Precio original</Text>
      <View style={styles.recoBottom}>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Añadir</Text>
        </TouchableOpacity>
        <Text style={styles.recoOffer}>Precio oferta</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require("@/assets/images/coplaca.png")}
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Coplaca</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.cartBox}>
          <Text style={styles.cartTitle}>Tu carrito</Text>
          <CartItem />
          <CartItem />
          <CartItem />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recomendaciones</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <RecoCard />
            <RecoCard />
            <RecoCard />
          </ScrollView>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      <TouchableOpacity style={styles.payButton}>
        <Text style={styles.payButtonText}>Pagar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 2,
    borderBottomColor: "#0A8F3E",
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerLogo: { width: 40, height: 40 },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#0A8F3E" },
  scroll: { flex: 1 },
  cartBox: {
    margin: 16,
    backgroundColor: "#FFC107",
    borderRadius: 20,
    padding: 16,
  },
  cartTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
    color: "#000",
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0A8F3E",
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
  },
  cartItemImage: { width: 55, height: 55, marginRight: 12 },
  cartItemInfo: { flex: 1 },
  cartItemName: { fontWeight: "bold", fontSize: 15, color: "#fff" },
  cartItemPrice: { fontSize: 12, color: "#d4f5d4", marginBottom: 6 },
  cartItemQty: { flexDirection: "row", alignItems: "center", gap: 8 },
  qtyBtn: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyBtnText: { fontWeight: "bold", fontSize: 16, color: "#0A8F3E" },
  qtyText: { color: "#fff", fontSize: 13 },
  section: { paddingHorizontal: 16, paddingTop: 16 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0A8F3E",
    marginBottom: 8,
  },
  recoCard: {
    width: 130,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#0A8F3E",
    padding: 10,
    marginRight: 12,
    alignItems: "flex-start",
  },
  recoImage: { width: 50, height: 50, alignSelf: "center", marginBottom: 6 },
  recoName: { fontWeight: "bold", fontSize: 13, marginBottom: 2 },
  recoOriginal: { fontSize: 11, color: "#555" },
  recoBottom: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
    flexWrap: "wrap",
  },
  addButton: {
    backgroundColor: "#FFC107",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  addButtonText: { fontWeight: "bold", fontSize: 12, color: "#000" },
  recoOffer: { fontSize: 11, color: "#555" },
  payButton: {
    backgroundColor: "#FFA500",
    marginHorizontal: 16,
    marginBottom: 8,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  payButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
