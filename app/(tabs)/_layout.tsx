import { Redirect, Tabs, usePathname } from "expo-router";
import { Image } from "react-native";
import { session } from "@/services/session";

const AUTH_ROUTES = new Set(["/", "/index", "/login", "/(tabs)", "/(tabs)/index", "/(tabs)/login"]);

function TabIcon({ source }: Readonly<{ source: any }>) {
  return <Image source={source} style={{ width: 28, height: 28 }} resizeMode="contain" />;
}

const HOME_TAB_ICON = () => <TabIcon source={require("@/assets/images/bolsa.png")} />;
const CART_TAB_ICON = () => <TabIcon source={require("@/assets/images/carrito.png")} />;
const ORDERS_TAB_ICON = () => <TabIcon source={require("@/assets/images/Mail.png")} />;
const PROFILE_TAB_ICON = () => <TabIcon source={require("@/assets/images/persona.png")} />;

export default function TabLayout() {
  const pathname = usePathname();
  const isAuthenticated = Boolean(session.getToken());
  const isAuthRoute = AUTH_ROUTES.has(pathname);

  if (!isAuthenticated && !isAuthRoute) {
    return <Redirect href="/(tabs)/login" />;
  }

  if (isAuthenticated && isAuthRoute) {
    return <Redirect href="/(tabs)/home" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 2,
          borderTopColor: "#0A8F3E",
          backgroundColor: "#fff",
          display: isAuthRoute ? "none" : "flex",
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
          tabBarIcon: HOME_TAB_ICON,
        }}
      />
      <Tabs.Screen
        name="carrito"
        options={{
          tabBarIcon: CART_TAB_ICON,
        }}
      />
      <Tabs.Screen
        name="pedidos"
        options={{
          tabBarIcon: ORDERS_TAB_ICON,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          tabBarIcon: PROFILE_TAB_ICON,
        }}
      />
    </Tabs>
  );
}
