import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { session } from "@/services/session";

export default function RootLayout() {
  const [isSessionReady, setIsSessionReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const bootstrapSession = async () => {
      await session.init();
      if (mounted) {
        setIsSessionReady(true);
      }
    };

    bootstrapSession();

    return () => {
      mounted = false;
    };
  }, []);

  if (!isSessionReady) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
