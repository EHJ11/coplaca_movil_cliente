import { Image, StyleSheet, Text, View } from "react-native";

export default function PerfilScreen() {
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
      <View style={styles.content}>
        <Text style={styles.text}>Perfil</Text>
      </View>
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
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20, color: "#0A8F3E", fontWeight: "bold" },
});
