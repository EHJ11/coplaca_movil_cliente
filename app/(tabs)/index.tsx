import { useRouter } from "expo-router";
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
import { api } from "@/services/api";
import { session } from "@/services/session";

export default function RegisterScreen() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [telefono, setTelefono] = useState("");
  const [street, setStreet] = useState("");
  const [streetNumber, setStreetNumber] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [error, setError] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  function validatePassword(): boolean {
    const errors: string[] = [];

    if (!password || !password.trim()) {
      errors.push('La contrasena es requerida');
    }

    if (!confirmPassword || !confirmPassword.trim()) {
      errors.push('La confirmacion de contrasena es requerida');
    }

    if (password && password.length < 8) {
      errors.push('La contrasena debe tener al menos 8 caracteres');
    }

    if (password && !/[A-Z]/.test(password)) {
      errors.push('La contrasena debe contener al menos una mayuscula');
    }

    if (password && !/[a-z]/.test(password)) {
      errors.push('La contrasena debe contener al menos una minuscula');
    }

    if (password && !/[0-9]/.test(password)) {
      errors.push('La contrasena debe contener al menos un numero');
    }

    if (password && confirmPassword && password !== confirmPassword) {
      errors.push('Las contrasenas no coinciden');
    }

    setPasswordErrors(errors);
    return errors.length === 0;
  }

  async function handleSignup() {
    if (!validatePassword()) {
      return;
    }

    const requiredValues = [nombre, apellidos, email, password, street, streetNumber, city, province, postalCode];
    if (requiredValues.some((value) => !value.trim())) {
      setError("Completa los datos obligatorios del domicilio.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await api.signup({
        email,
        password,
        firstName: nombre,
        lastName: apellidos,
        phoneNumber: telefono,
        address: {
          street,
          streetNumber,
          apartment,
          city,
          province,
          postalCode,
          additionalInfo,
          latitude: 0,
          longitude: 0,
        },
      });

      session.setToken(response.token);
      const profile = await api.getCurrentUser(response.token);
      session.setUser(profile);
      router.replace("/(tabs)/home" as any);
    } catch {
      setError("No se pudo completar el registro.");
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
      <ScrollView contentContainerStyle={styles.container}>
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

          <Text style={styles.label}>Confirmar contraseña</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="*************"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.passwordInput}
              placeholderTextColor="#999"
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeButton}
            >
              <Text style={styles.eyeIcon}>{showConfirmPassword ? "👁" : "🙈"}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Telefono</Text>
          <TextInput
            placeholder="Telefono"
            value={telefono}
            onChangeText={setTelefono}
            style={styles.input}
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Calle</Text>
          <TextInput
            placeholder="Calle"
            value={street}
            onChangeText={setStreet}
            style={styles.input}
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Numero</Text>
          <TextInput
            placeholder="Numero"
            value={streetNumber}
            onChangeText={setStreetNumber}
            style={styles.input}
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Piso/Apartamento</Text>
          <TextInput
            placeholder="Piso/Apartamento"
            value={apartment}
            onChangeText={setApartment}
            style={styles.input}
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Ciudad</Text>
          <TextInput
            placeholder="Ciudad"
            value={city}
            onChangeText={setCity}
            style={styles.input}
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Provincia</Text>
          <TextInput
            placeholder="Provincia"
            value={province}
            onChangeText={setProvince}
            style={styles.input}
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Codigo postal</Text>
          <TextInput
            placeholder="Codigo postal"
            value={postalCode}
            onChangeText={setPostalCode}
            style={styles.input}
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Info adicional</Text>
          <TextInput
            placeholder="Referencia de entrega"
            value={additionalInfo}
            onChangeText={setAdditionalInfo}
            style={styles.input}
            placeholderTextColor="#999"
          />

          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>{loading ? "Creando..." : "Crear"}</Text>
          </TouchableOpacity>

          {!!error && <Text style={styles.switchText}>{error}</Text>}
          {passwordErrors.map((passwordError) => (
            <Text key={passwordError} style={styles.passwordError}>
              {passwordError}
            </Text>
          ))}

          <Text style={styles.switchText}>
            ¿Ya tienes Cuenta?{" "}
            <Text
              style={styles.switchLink}
              onPress={() => router.push("/(tabs)/login" as any)}
            >
              Iniciar sesión
            </Text>
          </Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
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
  passwordError: { color: "#ffeb3b", marginTop: 6, fontSize: 12, fontWeight: "bold" },
  switchLink: { fontWeight: "bold", color: "#FFC107" },
});
