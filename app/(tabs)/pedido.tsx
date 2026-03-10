import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

const items = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
];

export default function PedidoScreen() {
  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/coplaca.png")}
          style={styles.headerLogo}
          resizeMode="contain"
        />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {/* Info pedido */}
          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>ID Pedido</Text>
              <Text style={styles.infoLabel}>Fecha</Text>
            </View>
            <Text style={styles.infoEstado}>Estado</Text>
          </View>

          {/* Lista de productos */}
          {items.map((item) => (
            <View key={item.id} style={styles.productRow}>
              <Image
                source={require("@/assets/images/cerezas.png")}
                style={styles.productImage}
                resizeMode="contain"
              />
              <Text style={styles.productName}>Nombre</Text>
              <Text style={styles.productDetail}>Cantidad</Text>
              <Text style={styles.productDetail}>Precio/Peso</Text>
            </View>
          ))}

          {/* Total */}
          <Text style={styles.total}>Total pedido</Text>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 12,
  },
  headerLogo: {
    width: 100,
    height: 100,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0A8F3E",
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#4CAF7D",
    borderRadius: 24,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  infoBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#222",
  },
  infoEstado: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3a9e68",
    borderRadius: 14,
    padding: 10,
    marginBottom: 8,
    gap: 8,
  },
  productImage: {
    width: 36,
    height: 36,
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
  },
  productDetail: {
    fontSize: 12,
    color: "#fff",
    marginLeft: 4,
  },
  total: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginTop: 8,
  },
});
