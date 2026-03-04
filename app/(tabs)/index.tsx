import { useState } from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const [screen, setScreen] = useState("register");

  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [ubicacion, setUbicacion] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // ─── BOTTOM NAV (compartido) ───────────────────────────────────────────────
  const BottomNav = () => (
    <View style={homeStyles.bottomNav}>
      <TouchableOpacity
        style={homeStyles.navItem}
        onPress={() => setScreen("home")}
      >
        <Image
          source={require("@/assets/images/bolsa.png")}
          style={homeStyles.navIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={homeStyles.navItem}
        onPress={() => setScreen("carrito")}
      >
        <Image
          source={require("@/assets/images/carrito.png")}
          style={homeStyles.navIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity style={homeStyles.navItem}>
        <Image
          source={require("@/assets/images/Mail.png")}
          style={homeStyles.navIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity style={homeStyles.navItem}>
        <Image
          source={require("@/assets/images/persona.png")}
          style={homeStyles.navIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );

  // ─── CARRITO ───────────────────────────────────────────────────────────────
  if (screen === "carrito") {
    const CartItem = () => (
      <View style={cartStyles.cartItem}>
        <Image
          source={require("@/assets/images/cerezas.png")}
          style={cartStyles.cartItemImage}
          resizeMode="contain"
        />
        <View style={cartStyles.cartItemInfo}>
          <Text style={cartStyles.cartItemName}>Nombre</Text>
          <Text style={cartStyles.cartItemPrice}>Precio/Peso</Text>
          <View style={cartStyles.cartItemQty}>
            <TouchableOpacity style={cartStyles.qtyBtn}>
              <Text style={cartStyles.qtyBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={cartStyles.qtyText}>Cantidad</Text>
            <TouchableOpacity style={cartStyles.qtyBtn}>
              <Text style={cartStyles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );

    const RecoCard = () => (
      <View style={homeStyles.productCard}>
        <Image
          source={require("@/assets/images/cerezas.png")}
          style={homeStyles.productImage}
          resizeMode="contain"
        />
        <Text style={homeStyles.productName}>Nombre</Text>
        <Text style={homeStyles.productOriginal}>Precio original</Text>
        <View style={homeStyles.productBottom}>
          <TouchableOpacity style={homeStyles.addButton}>
            <Text style={homeStyles.addButtonText}>Añadir</Text>
          </TouchableOpacity>
          <Text style={homeStyles.productOffer}>Precio oferta</Text>
        </View>
      </View>
    );

    return (
      <View style={homeStyles.wrapper}>
        {/* HEADER */}
        <View style={homeStyles.header}>
          <View style={homeStyles.headerLeft}>
            <Image
              source={require("@/assets/images/coplaca.png")}
              style={homeStyles.headerLogo}
              resizeMode="contain"
            />
            <Text style={homeStyles.headerTitle}>Coplaca</Text>
          </View>
        </View>

        <ScrollView
          style={homeStyles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* TU CARRITO */}
          <View style={cartStyles.cartBox}>
            <Text style={cartStyles.cartTitle}>Tu carrito</Text>
            <CartItem />
            <CartItem />
            <CartItem />
          </View>

          {/* RECOMENDACIONES */}
          <View style={homeStyles.section}>
            <Text style={homeStyles.sectionTitle}>Recomendaciones</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={homeStyles.hScroll}
            >
              <RecoCard />
              <RecoCard />
              <RecoCard />
            </ScrollView>
          </View>

          <View style={{ height: 80 }} />
        </ScrollView>

        {/* BOTÓN PAGAR */}
        <TouchableOpacity style={cartStyles.payButton}>
          <Text style={cartStyles.payButtonText}>Pagar</Text>
        </TouchableOpacity>

        <BottomNav />
      </View>
    );
  }

  // ─── HOME ─────────────────────────────────────────────────────────────────
  if (screen === "home") {
    const ProductCard = ({ style = {} }: { style?: any }) => (
      <View style={[homeStyles.productCard, style]}>
        <Image
          source={require("@/assets/images/cerezas.png")}
          style={homeStyles.productImage}
          resizeMode="contain"
        />
        <Text style={homeStyles.productName}>Nombre</Text>
        <Text style={homeStyles.productOriginal}>Precio original</Text>
        <View style={homeStyles.productBottom}>
          <TouchableOpacity style={homeStyles.addButton}>
            <Text style={homeStyles.addButtonText}>Añadir</Text>
          </TouchableOpacity>
          <Text style={homeStyles.productOffer}>Precio oferta</Text>
        </View>
      </View>
    );

    const GridCard = () => (
      <View style={homeStyles.gridCard}>
        <Image
          source={require("@/assets/images/cerezas.png")}
          style={homeStyles.gridImage}
          resizeMode="contain"
        />
        <Text style={homeStyles.gridName}>Nombre</Text>
        <TouchableOpacity style={homeStyles.addButton}>
          <Text style={homeStyles.addButtonText}>Añadir</Text>
        </TouchableOpacity>
      </View>
    );

    return (
      <View style={homeStyles.wrapper}>
        {/* HEADER */}
        <View style={homeStyles.header}>
          <View style={homeStyles.headerLeft}>
            <Image
              source={require("@/assets/images/coplaca.png")}
              style={homeStyles.headerLogo}
              resizeMode="contain"
            />
            <Text style={homeStyles.headerTitle}>Coplaca</Text>
          </View>
          <TouchableOpacity>
            <Image
              source={require("@/assets/images/lupa.png")}
              style={homeStyles.lupaIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={homeStyles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* OFERTAS DEL DÍA */}
          <View style={homeStyles.section}>
            <Text style={homeStyles.sectionTitle}>¡Ofertas del día!</Text>
            <Text style={homeStyles.sectionSubtitle}>
              Frutas a un 30 % ahora, aprovecha
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={homeStyles.hScroll}
            >
              <ProductCard />
              <ProductCard />
              <ProductCard />
            </ScrollView>
          </View>

          {/* PRODUCTOS DE TEMPORADA */}
          <View style={homeStyles.section}>
            <Text style={homeStyles.sectionTitle}>
              ¡Productos de temporada!
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={homeStyles.hScroll}
            >
              <ProductCard />
              <ProductCard />
              <ProductCard />
            </ScrollView>
          </View>

          {/* NUESTROS PRODUCTOS */}
          <View style={homeStyles.section}>
            <Text style={homeStyles.sectionTitle}>Nuestros productos</Text>
            <View style={homeStyles.grid}>
              <GridCard />
              <GridCard />
              <GridCard />
              <GridCard />
            </View>
          </View>

          <View style={{ height: 80 }} />
        </ScrollView>

        <BottomNav />
      </View>
    );
  }

  // ─── LOGIN ─────────────────────────────────────────────────────────────────
  if (screen === "login") {
    return (
      <ImageBackground
        source={require("@/assets/images/Fondo-Hojas-Platanera.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image
              source={require("@/assets/images/coplaca.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.card}>
            <Text style={styles.title}>Iniciar sesión</Text>

            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="Tu email"
              value={loginEmail}
              onChangeText={setLoginEmail}
              style={styles.input}
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              placeholder="*************"
              value={loginPassword}
              onChangeText={setLoginPassword}
              style={styles.input}
              placeholderTextColor="#999"
              secureTextEntry
            />

            <TouchableOpacity
              style={styles.button}
              onPress={() => setScreen("home")}
            >
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>

            <Text style={styles.switchText}>
              ¿No tienes cuenta?{" "}
              <Text
                style={styles.switchLink}
                onPress={() => setScreen("register")}
              >
                Regístrate
              </Text>
            </Text>
          </View>
        </View>
      </ImageBackground>
    );
  }

  // ─── REGISTER ──────────────────────────────────────────────────────────────
  return (
    <ImageBackground
      source={require("@/assets/images/Fondo-Hojas-Platanera.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/coplaca.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>Registrar</Text>

          <Text style={styles.label}>Nombre</Text>
          <TextInput
            placeholder="Eduardo"
            value={nombre}
            onChangeText={setNombre}
            style={styles.input}
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Apellidos</Text>
          <TextInput
            placeholder="Apellidos"
            value={apellidos}
            onChangeText={setApellidos}
            style={styles.input}
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="TuEmail@TuDominio.com"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="*************"
              value={password}
              onChangeText={setPassword}
              style={styles.passwordInput}
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
            >
              <Text style={styles.eyeIcon}>{showPassword ? "👁" : "🙈"}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Ubicación</Text>
          <TextInput
            placeholder="C\Calle\Ciudad\Provincia"
            value={ubicacion}
            onChangeText={setUbicacion}
            style={styles.input}
            placeholderTextColor="#999"
          />

          <TouchableOpacity
            style={styles.button}
            onPress={() => setScreen("login")}
          >
            <Text style={styles.buttonText}>Crear</Text>
          </TouchableOpacity>

          <Text style={styles.switchText}>
            ¿Ya tienes Cuenta?{" "}
            <Text style={styles.switchLink} onPress={() => setScreen("login")}>
              Iniciar sesión
            </Text>
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}

// ─── ESTILOS AUTH ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  background: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  logoContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    borderWidth: 4,
    borderColor: "#FFC107",
  },
  logoImage: { width: "80%", height: "80%" },
  card: {
    width: "100%",
    backgroundColor: "rgba(0, 128, 0, 0.7)",
    padding: 25,
    borderRadius: 25,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
    color: "black",
    fontWeight: "bold",
  },
  label: { marginBottom: 5, color: "black", fontWeight: "bold" },
  input: {
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: "#FFC107",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 30,
    borderWidth: 3,
    borderColor: "#FFC107",
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  passwordInput: { flex: 1, paddingVertical: 12 },
  eyeButton: { paddingLeft: 10 },
  eyeIcon: { fontSize: 18 },
  button: {
    backgroundColor: "#0A8F3E",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  switchText: { textAlign: "center", marginTop: 15, color: "#FFC107" },
  switchLink: { fontWeight: "bold", color: "#FFC107" },
});

// ─── ESTILOS HOME ─────────────────────────────────────────────────────────────
const homeStyles = StyleSheet.create({
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
  sectionSubtitle: {
    fontSize: 12,
    color: "#555",
    marginBottom: 10,
  },
  hScroll: { flexDirection: "row" },
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 10,
  },
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
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 2,
    borderTopColor: "#0A8F3E",
    backgroundColor: "#fff",
  },
  navItem: { padding: 8 },
  navIcon: { width: 28, height: 28 },
});

// ─── ESTILOS CARRITO ──────────────────────────────────────────────────────────
const cartStyles = StyleSheet.create({
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
  cartItemQty: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
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
