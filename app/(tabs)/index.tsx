import { useState } from "react";
import {
  Image,
  ImageBackground,
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

            <TouchableOpacity style={styles.button}>
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

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
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
  logoImage: {
    width: "80%",
    height: "80%",
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
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
  },
  eyeButton: {
    paddingLeft: 10,
  },
  eyeIcon: {
    fontSize: 18,
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
