import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function PedidosScreen() {
  const PedidoCard = () => (
    <View style={styles.pedidoCard}>
      <View style={styles.pedidoRow}>
        <Text style={styles.pedidoLabel}>ID Pedido</Text>
        <Text style={styles.pedidoLabel}>Estado</Text>
      </View>
      <View style={styles.pedidoDivider} />
      <View style={styles.pedidoRow}>
        <Text style={styles.pedidoLabel}>Fecha</Text>
        <Text style={styles.pedidoLabel}>Total pedido</Text>
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
        <View style={styles.pedidoBox}>
          <Text style={styles.pedidoTitle}>Pedidos</Text>
          <Text style={styles.pedidoSubtitle}>
            Vista de todos los pedidos hechos
          </Text>
          <PedidoCard />
          <PedidoCard />
          <PedidoCard />
          <PedidoCard />
        </View>
        <View style={{ height: 20 }} />
      </ScrollView>
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
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerLogo: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0A8F3E",
  },
  scroll: { flex: 1 },
  pedidoBox: {
    margin: 16,
    backgroundColor: "#FFC107",
    borderRadius: 20,
    padding: 16,
  },
  pedidoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
    color: "#000",
  },
  pedidoSubtitle: {
    fontSize: 12,
    textAlign: "center",
    color: "#333",
    marginBottom: 14,
  },
  pedidoCard: {
    backgroundColor: "#0A8F3E",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  pedidoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  pedidoLabel: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  pedidoDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginVertical: 6,
  },
});
