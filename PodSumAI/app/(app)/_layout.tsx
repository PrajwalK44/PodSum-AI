import { Ionicons } from "@expo/vector-icons";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";

import { HapticTab } from "@/components/haptic-tab";

export default function AppLayout() {
  // Get the device's current theme
  const colorScheme = useColorScheme();

  // Custom dark theme with your app colors
  const MyDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: "#121212",
      card: "#1e1e1e",
      border: "transparent",
    },
  };

  // Custom light theme (optional, but keeping consistency)
  const MyLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "#121212",
      card: "#1e1e1e",
      border: "transparent",
    },
  };

  // Select theme based on device setting (or force dark theme)
  const theme = colorScheme === "dark" ? MyDarkTheme : MyDarkTheme; // Force dark theme

  return (
    <ThemeProvider value={theme}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarActiveTintColor: "#0a7aff",
          tabBarInactiveTintColor: "#6b7280",
          tabBarStyle: {
            backgroundColor: "#1e1e1e",
            borderTopColor: "transparent",
            height: 75,
            paddingBottom: 10,
            paddingTop: 10,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 20,
          },
          tabBarLabelStyle: {
            fontFamily: "Jakarta-SemiBold",
            fontSize: 12,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            href: null,
            tabBarStyle: { display: "none" }, // Hide tab bar on splash
          }}
        />
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <Ionicons name="home" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: "History",
            tabBarIcon: ({ color }) => (
              <Ionicons name="time" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="live"
          options={{
            title: "Live",
            tabBarIcon: ({ color }) => (
              <Ionicons name="mic" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <Ionicons name="person" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="summarize"
          options={{
            href: null, // Hide from tab bar
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
}
