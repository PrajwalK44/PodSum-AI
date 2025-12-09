import { useFonts } from "expo-font";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "../global.css";
import { AuthProvider, useAuth } from "@/services/AuthContext";

// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isAuthenticated, isLoading, hasOnboarded } = useAuth();
  const [isNavigated, setIsNavigated] = useState(false);

  useEffect(() => {
    const init = async () => {
      // Only navigate once and only after loading is complete
      if (!isLoading && !isNavigated) {
        let targetRoute: string;

        if (!hasOnboarded) {
          // New user, show onboarding
          targetRoute = "/(onboarding)/startup";
        } else if (isAuthenticated) {
          // User is logged in, go to app
          targetRoute = "/(app)";
        } else {
          // User has onboarded but not logged in, show auth
          targetRoute = "/(auth)/welcome";
        }

        await SplashScreen.hideAsync();
        setIsNavigated(true);

        // Use setTimeout to ensure navigation happens after layout is mounted
        setTimeout(() => {
          router.replace(targetRoute as any);
        }, 100);
      }
    };

    init();
  }, [isLoading]); // Remove hasOnboarded and isAuthenticated from deps to prevent re-triggers

  // Keep splash screen visible while loading
  if (isLoading) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: "#121212" },
        headerTintColor: "#ffffff",
      }}
    />
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    "Jakarta-Bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "Jakarta-ExtraBold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "Jakarta-ExtraLight": require("../assets/fonts/PlusJakartaSans-ExtraLight.ttf"),
    "Jakarta-Light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
    "Jakarta-Medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "Jakarta-Regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "Jakarta-SemiBold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
