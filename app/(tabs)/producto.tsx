import { router } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProductoScreen() {
  const [cantidad, setCantidad] = useState(1);

  const incrementar = () => setCantidad((prev) => prev + 1);
  const decrementar = () => setCantidad((prev) => (prev > 1 ? prev - 1 : 1));

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

      {/* Card principal */}
      <View style={styles.card}>
        {/* Imagen del producto */}
        <View style={styles.imageContainer}>
          <Image
            source={require("@/assets/images/cerezas.png")}
            style={styles.productImage}
            resizeMode="contain"
          />
        </View>

        {/* Nombre y precio */}
        <Text style={styles.productName}>Nombre</Text>
        <Text style={styles.productPrice}>Precio/peso</Text>

        {/* Contador de cantidad */}
        <View style={styles.counterRow}>
          <TouchableOpacity style={styles.counterBtn} onPress={decrementar}>
            <Text style={styles.counterBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.counterText}>{cantidad} kg</Text>
          <TouchableOpacity style={styles.counterBtn} onPress={incrementar}>
            <Text style={styles.counterBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Descripción */}
        <View style={styles.descContainer}>
          <Text style={styles.descText}>Descripcion</Text>
        </View>

        {/* Botón guardar */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => router.push("/(tabs)/pedidos")}
        >
          <Text style={styles.saveButtonText}>guardar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 16,
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
  card: {
    width: "88%",
    backgroundColor: "#4CAF7D",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
  },
  imageContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#FFC107",
    padding: 12,
    marginBottom: 16,
  },
  productImage: {
    width: 120,
    height: 120,
  },
  productName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 15,
    color: "#fff",
    marginBottom: 12,
  },
  counterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 24,
  },
  counterBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  counterBtnText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    lineHeight: 22,
  },
  counterText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  descContainer: {
    width: "100%",
    backgroundColor: "#3a9e68",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 24,
  },
  descText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  saveButton: {
    backgroundColor: "#FFC107",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 50,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});
