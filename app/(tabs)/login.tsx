import { api } from "@/services/api";
import { session } from "@/services/session";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    if (!loginEmail || !loginPassword) {
      setError("Debes introducir email y contrasena.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await api.login(loginEmail, loginPassword);
      session.setToken(response.token);
      const profile = await api.getCurrentUser(response.token);
      session.setUser(profile);
      router.replace("/(tabs)/home" as any);
    } catch {
      setError("No se pudo iniciar sesion.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ImageBackground
      source={require("@/assets/images/Fondo-Hojas-Platanera.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>
                {loading ? "Entrando..." : "Entrar"}
              </Text>
            </TouchableOpacity>

            {!!error && <Text style={styles.switchText}>{error}</Text>}

            <Text style={styles.switchText}>
              ¿No tienes cuenta?{" "}
              <Text
                style={styles.switchLink}
                onPress={() => router.push("/(tabs)/" as any)}
              >
                Regístrate
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  keyboardContainer: { flex: 1 },
  container: {
    flexGrow: 1,
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
  button: {
    backgroundColor: "#0A8F3E",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  switchText: {
    textAlign: "center",
    marginTop: 15,
    color: "#FFC107",
  },
  switchLink: {
    fontWeight: "bold",
    color: "#FFC107",
  },
});
