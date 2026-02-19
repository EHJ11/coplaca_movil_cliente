import { useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <ImageBackground
      source={require("@/assets/images/Fondo-Hojas-Platanera.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Coplaca</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>Iniciar sesión</Text>

          <Text style={styles.label}>Email</Text>

          <TextInput
            placeholder="Tu email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Contraseña</Text>

          <TextInput
            placeholder="*************"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            placeholderTextColor="#999"
          />

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>

          <Text style={styles.registerText}>
            ¿No tienes cuenta?{" "}
            <Text style={styles.registerLink}>Regístrate</Text>
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
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

  logoText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1E8E3E",
  },

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

  label: {
    marginBottom: 5,
    color: "black",
    fontWeight: "bold",
  },

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

  registerText: {
    textAlign: "center",
    marginTop: 15,
    color: "#FFC107",
  },

  registerLink: {
    fontWeight: "bold",
  },
});
