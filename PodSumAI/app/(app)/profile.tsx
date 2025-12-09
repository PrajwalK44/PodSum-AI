import { useAuth } from "@/services/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          setIsLoggingOut(true);
          try {
            await logout();
            router.replace("/(auth)/welcome");
          } catch (error) {
            Alert.alert("Error", "Failed to logout. Please try again.");
          } finally {
            setIsLoggingOut(false);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <ScrollView className="flex-1 px-6">
        {/* Header */}
        <View className="py-6">
          <Text className="text-white text-3xl font-Jakarta-Bold">Profile</Text>
          <Text className="text-[#9ca3af] mt-2 font-Jakarta-Regular">
            Manage your account settings
          </Text>
        </View>

        {/* User Info Card */}
        <View className="bg-[#1e1e1e] rounded-2xl p-6 mb-6">
          <View className="flex-row items-center">
            <View className="w-16 h-16 bg-[#0a7aff]/20 rounded-full items-center justify-center">
              <Ionicons name="person" size={32} color="#0a7aff" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-white text-xl font-Jakarta-Bold">
                {user?.name || "User"}
              </Text>
              <Text className="text-[#9ca3af] font-Jakarta-Regular">
                {user?.email || "No email"}
              </Text>
            </View>
          </View>
        </View>

        {/* Settings Options */}
        <View className="bg-[#1e1e1e] rounded-2xl mb-6">
          <TouchableOpacity className="flex-row items-center p-4 border-b border-[#2a2a2a]">
            <View className="w-10 h-10 bg-[#2a2a2a] rounded-full items-center justify-center">
              <Ionicons name="person-outline" size={20} color="#9ca3af" />
            </View>
            <Text className="flex-1 text-white font-Jakarta-Medium ml-3">
              Edit Profile
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center p-4 border-b border-[#2a2a2a]">
            <View className="w-10 h-10 bg-[#2a2a2a] rounded-full items-center justify-center">
              <Ionicons
                name="notifications-outline"
                size={20}
                color="#9ca3af"
              />
            </View>
            <Text className="flex-1 text-white font-Jakarta-Medium ml-3">
              Notifications
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center p-4 border-b border-[#2a2a2a]">
            <View className="w-10 h-10 bg-[#2a2a2a] rounded-full items-center justify-center">
              <Ionicons name="shield-outline" size={20} color="#9ca3af" />
            </View>
            <Text className="flex-1 text-white font-Jakarta-Medium ml-3">
              Privacy & Security
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center p-4">
            <View className="w-10 h-10 bg-[#2a2a2a] rounded-full items-center justify-center">
              <Ionicons name="help-circle-outline" size={20} color="#9ca3af" />
            </View>
            <Text className="flex-1 text-white font-Jakarta-Medium ml-3">
              Help & Support
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          disabled={isLoggingOut}
          className={`rounded-2xl p-4 mb-10 flex-row items-center justify-center ${
            isLoggingOut ? "bg-red-500/30" : "bg-red-500/20"
          }`}
        >
          {isLoggingOut ? (
            <ActivityIndicator color="#ef4444" />
          ) : (
            <>
              <Ionicons name="log-out-outline" size={24} color="#ef4444" />
              <Text className="text-red-500 font-Jakarta-Bold text-lg ml-2">
                Logout
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
