import { useAuth } from "@/services/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface TopBarProps {
  userName?: string;
  userEmail?: string;
}

interface PodcastSuggestion {
  id: string;
  title: string;
  author: string;
  thumbnail: string;
  views: string;
}

const mockSuggestions: PodcastSuggestion[] = [
  {
    id: "1",
    title: "Billionaire's Brain vs Your Brain",
    author: "Raj Shamani",
    thumbnail: "https://via.placeholder.com/200x120",
    views: "7.7M+ VIEWS",
  },
  {
    id: "2",
    title: "How to Build a Billion Dollar Company",
    author: "Naval Ravikant",
    thumbnail: "https://via.placeholder.com/200x120",
    views: "5.2M+ VIEWS",
  },
  {
    id: "3",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    thumbnail: "https://via.placeholder.com/200x120",
    views: "4.8M+ VIEWS",
  },
  {
    id: "4",
    title: "Startup Lessons from Y Combinator",
    author: "Paul Graham",
    thumbnail: "https://via.placeholder.com/200x120",
    views: "3.9M+ VIEWS",
  },
];

export default function TopBar({
  userName = "User",
  userEmail = "",
}: TopBarProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          setIsLoggingOut(true);
          setShowProfile(false);
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

  const getUserInitials = () => {
    return userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <View className="bg-[#1e1e1e] px-6  flex-row items-center justify-between border-b border-[#2a2a2a]">
        {/* Logo */}
        <Image
          source={require("../assets/images/app-icon.png")}
          className="w-[100px] h-[100px]"
          resizeMode="contain"
        />

        {/* Right Section */}
        <View className="flex-row items-center gap-4">
          {/* Search Icon */}
          <TouchableOpacity
            onPress={() => setShowSearch(true)}
            className="w-12 h-12 items-center justify-center"
          >
            <Ionicons name="search" size={32} color="#ffffff" />
          </TouchableOpacity>

          {/* User Profile */}
          <TouchableOpacity
            onPress={() => setShowProfile(!showProfile)}
            className="flex-row items-center gap-2"
          >
            <View className="w-12 h-12 bg-[#0a7aff] rounded-full items-center justify-center">
              <Text className="text-white font-Jakarta-Bold text-base">
                {getUserInitials()}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Dropdown */}
      {showProfile && (
        <View className="absolute top-16 right-6 bg-[#1e1e1e] rounded-xl border border-[#2a2a2a] overflow-hidden z-50 w-64">
          <View className="p-4 border-b border-[#2a2a2a]">
            <View className="flex-row items-center gap-3 mb-3">
              <View className="w-12 h-12 bg-[#0a7aff] rounded-full items-center justify-center">
                <Text className="text-white font-Jakarta-Bold text-lg">
                  {getUserInitials()}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-white font-Jakarta-Bold text-base">
                  {userName}
                </Text>
                <Text className="text-[#9ca3af] font-Jakarta-Regular text-sm">
                  {userEmail}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              setShowProfile(false);
              // Navigate to profile
            }}
            className="px-4 py-3 flex-row items-center gap-3 active:bg-[#2a2a2a]"
          >
            <Ionicons name="person-outline" size={20} color="#9ca3af" />
            <Text className="text-white font-Jakarta-Medium">My Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setShowProfile(false);
              // Navigate to settings
            }}
            className="px-4 py-3 flex-row items-center gap-3 active:bg-[#2a2a2a]"
          >
            <Ionicons name="settings-outline" size={20} color="#9ca3af" />
            <Text className="text-white font-Jakarta-Medium">Settings</Text>
          </TouchableOpacity>

          <View className="h-[1px] bg-[#2a2a2a]" />

          <TouchableOpacity
            onPress={handleLogout}
            className="px-4 py-3 flex-row items-center gap-3 active:bg-[#2a2a2a]"
          >
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            <Text className="text-[#ef4444] font-Jakarta-Medium">Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Search Modal */}
      <Modal
        visible={showSearch}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSearch(false)}
      >
        <View className="flex-1 bg-[#121212]">
          {/* Search Header */}
          <View className="bg-[#1e1e1e] px-6 py-4 border-b border-[#2a2a2a]">
            <View className="flex-row items-center gap-3">
              <TouchableOpacity onPress={() => setShowSearch(false)}>
                <Ionicons name="arrow-back" size={24} color="#ffffff" />
              </TouchableOpacity>
              <View className="flex-1 bg-[#2a2a2a] rounded-full px-4 py-3 flex-row items-center">
                <Ionicons name="search" size={20} color="#9ca3af" />
                <TextInput
                  placeholder="Search podcasts..."
                  placeholderTextColor="#9ca3af"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  className="flex-1 text-white ml-3 font-Jakarta-Regular"
                  autoFocus
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery("")}>
                    <Ionicons name="close-circle" size={20} color="#9ca3af" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          {/* Search Results */}
          <ScrollView className="flex-1 px-6 pt-6">
            <Text className="text-white text-xl font-Jakarta-Bold mb-4">
              Popular Podcasts
            </Text>

            {mockSuggestions.map((podcast) => (
              <TouchableOpacity
                key={podcast.id}
                className="bg-[#1e1e1e] rounded-2xl mb-4 overflow-hidden flex-row"
                onPress={() => {
                  // TODO: Navigate to podcast detail
                  setShowSearch(false);
                }}
              >
                {/* Thumbnail */}
                <View className="w-[200px] h-[120px] bg-[#2a2a2a]">
                  {/* Placeholder for thumbnail image */}
                  <View className="flex-1 items-center justify-center">
                    <Ionicons name="play-circle" size={48} color="#0a7aff" />
                  </View>
                  {/* Views Badge */}
                  <View className="absolute bottom-2 left-2 bg-black/80 px-2 py-1 rounded">
                    <Text className="text-white text-xs font-Jakarta-Bold">
                      {podcast.views}
                    </Text>
                  </View>
                </View>

                {/* Content */}
                <View className="flex-1 p-4 justify-between">
                  <View>
                    <Text
                      className="text-white text-base font-Jakarta-Bold mb-1"
                      numberOfLines={2}
                    >
                      {podcast.title}
                    </Text>
                    <Text className="text-yellow-500 text-sm font-Jakarta-Medium">
                      {podcast.author}
                    </Text>
                  </View>

                  <TouchableOpacity className="bg-[#0a7aff] rounded-full px-6 py-2 self-start">
                    <Text className="text-white font-Jakarta-Bold text-sm">
                      Summarize
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}
