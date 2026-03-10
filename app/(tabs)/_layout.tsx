import { Tabs } from "expo-router";
import { Image } from "react-native";
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 2,
          borderTopColor: "#0A8F3E",
          backgroundColor: "#fff",
        },
        tabBarActiveTintColor: "#0A8F3E",
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="login" options={{ href: null }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
      <Tabs.Screen name="producto" options={{ href: null }} />
      <Tabs.Screen name="pedido" options={{ href: null }} />
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: () => (
            <Image
              source={require("@/assets/images/bolsa.png")}
              style={{ width: 28, height: 28 }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="carrito"
        options={{
          tabBarIcon: () => (
            <Image
              source={require("@/assets/images/carrito.png")}
              style={{ width: 28, height: 28 }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="pedidos"
        options={{
          tabBarIcon: () => (
            <Image
              source={require("@/assets/images/Mail.png")}
              style={{ width: 28, height: 28 }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          tabBarIcon: () => (
            <Image
              source={require("@/assets/images/persona.png")}
              style={{ width: 28, height: 28 }}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Tabs>
  );
}
