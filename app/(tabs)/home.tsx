import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const ProductCard = ({ style = {} }: { style?: any }) => (
    <View style={[styles.productCard, style]}>
      <Image
        source={require("@/assets/images/cerezas.png")}
        style={styles.productImage}
        resizeMode="contain"
      />
      <Text style={styles.productName}>Nombre</Text>
      <Text style={styles.productOriginal}>Precio original</Text>
      <View style={styles.productBottom}>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Añadir</Text>
        </TouchableOpacity>
        <Text style={styles.productOffer}>Precio oferta</Text>
      </View>
    </View>
  );

  const GridCard = () => (
    <View style={styles.gridCard}>
      <Image
        source={require("@/assets/images/cerezas.png")}
        style={styles.gridImage}
        resizeMode="contain"
      />
      <Text style={styles.gridName}>Nombre</Text>
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Añadir</Text>
      </TouchableOpacity>
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
        <TouchableOpacity>
          <Image
            source={require("@/assets/images/lupa.png")}
            style={styles.lupaIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>¡Ofertas del día!</Text>
          <Text style={styles.sectionSubtitle}>
            Frutas a un 30 % ahora, aprovecha
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <ProductCard />
            <ProductCard />
            <ProductCard />
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>¡Productos de temporada!</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <ProductCard />
            <ProductCard />
            <ProductCard />
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nuestros productos</Text>
          <View style={styles.grid}>
            <GridCard />
            <GridCard />
            <GridCard />
            <GridCard />
          </View>
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
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerLogo: { width: 40, height: 40 },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#0A8F3E" },
  lupaIcon: { width: 26, height: 26 },
  scroll: { flex: 1 },
  section: { paddingHorizontal: 16, paddingTop: 16 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0A8F3E",
    marginBottom: 2,
  },
  sectionSubtitle: { fontSize: 12, color: "#555", marginBottom: 10 },
  productCard: {
    width: 130,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#0A8F3E",
    padding: 10,
    marginRight: 12,
    alignItems: "flex-start",
  },
  productImage: { width: 50, height: 50, alignSelf: "center", marginBottom: 6 },
  productName: { fontWeight: "bold", fontSize: 13, marginBottom: 2 },
  productOriginal: { fontSize: 11, color: "#555" },
  productBottom: {
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
  productOffer: { fontSize: 11, color: "#555" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 10 },
  gridCard: {
    width: "46%",
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#0A8F3E",
    padding: 12,
    alignItems: "flex-start",
  },
  gridImage: { width: 50, height: 50, alignSelf: "center", marginBottom: 8 },
  gridName: { fontWeight: "bold", fontSize: 13, marginBottom: 8 },
});
