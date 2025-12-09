import VerificationModal from "@/components/VerificationModal";
import { useAuth } from "@/services/AuthContext";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showVerification, setShowVerification] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      const result = await register(
        name.trim(),
        email.trim().toLowerCase(),
        password
      );

      if (result.success) {
        // Show verification modal
        setShowVerification(true);
      } else {
        Alert.alert("Registration Failed", result.message);
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1">
          {/* Header Image with title overlapping */}
          <View className="w-full items-center -mb-80">
            <Image
              source={require("../../assets/images/header.png")}
              className="w-[450px] h-[450px]"
              resizeMode="contain"
            />
          </View>

          <KeyboardAvoidingView className="flex-1 px-6 z-10">
            <Text className="text-white text-3xl font-Jakarta-Bold mb-6">
              Create Your Account
            </Text>

            {/* Name Input */}
            <Text className="text-white text-sm font-Jakarta-Medium mb-2">
              Name
            </Text>
            <View
              className={`bg-[#1e1e1e] rounded-xl p-4 mb-4 flex-row items-center border ${focusedField === "name" ? "border-[#0a7aff]" : "border-[#2a2a2a]"}`}
            >
              <Ionicons name="person-outline" size={20} color="#6b7280" />
              <TextInput
                placeholder="Enter name"
                placeholderTextColor="#6b7280"
                value={name}
                onChangeText={setName}
                className="flex-1 text-white ml-3 font-Jakarta-Bold"
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            {/* Email Input */}
            <Text className="text-white text-sm font-Jakarta-Medium mb-2">
              Email
            </Text>
            <View
              className={`bg-[#1e1e1e] rounded-xl p-4 mb-4 flex-row items-center border ${focusedField === "email" ? "border-[#0a7aff]" : "border-[#2a2a2a]"}`}
            >
              <Ionicons name="mail-outline" size={20} color="#6b7280" />
              <TextInput
                placeholder="example@gmail.com"
                placeholderTextColor="#6b7280"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                className="flex-1 text-white ml-3 font-Jakarta-Bold"
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            {/* Password Input */}
            <Text className="text-white text-sm font-Jakarta-Medium mb-2">
              Password
            </Text>
            <View
              className={`bg-[#1e1e1e] rounded-xl p-4 mb-6 flex-row items-center border ${focusedField === "password" ? "border-[#0a7aff]" : "border-[#2a2a2a]"}`}
            >
              <Ionicons name="lock-closed-outline" size={20} color="#6b7280" />
              <TextInput
                placeholder="Enter password"
                placeholderTextColor="#6b7280"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                className="flex-1 text-white ml-3 font-Jakarta-Bold"
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#6b7280"
                />
              </TouchableOpacity>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              onPress={handleSignUp}
              disabled={isLoading}
              className={`w-full rounded-full py-4 mb-4 ${isLoading ? "bg-[#0a7aff]/50" : "bg-[#0a7aff]"}`}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-white text-center font-Jakarta-Bold text-lg">
                  Sign Up
                </Text>
              )}
            </TouchableOpacity>

            {/* OR Divider */}
            <View className="w-full flex-row items-center mb-4">
              <View className="flex-1 h-[1px] bg-[#374151]" />
              <Text className="text-[#9ca3af] font-Jakarta-Regular mx-4">
                OR
              </Text>
              <View className="flex-1 h-[1px] bg-[#374151]" />
            </View>

            {/* Google Sign In Button */}
            <TouchableOpacity
              onPress={() => {
                // TODO: Implement Google sign in
              }}
              className="w-full bg-white rounded-full py-4 mb-4 flex-row items-center justify-center"
            >
              <AntDesign name="google" size={20} color="#DB4437" />
              <Text className="text-black text-center font-Jakarta-Bold text-lg ml-2">
                Log in with Google
              </Text>
            </TouchableOpacity>

            {/* Already have account */}
            <View className="flex-row items-center justify-center">
              <Text className="text-[#9ca3af] font-Jakarta-Regular">
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                <Text className="text-[#0a7aff] font-Jakarta-Bold">Log in</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>

      {/* Verification Modal */}
      <VerificationModal
        visible={showVerification}
        onClose={() => setShowVerification(false)}
        email={email}
      />
    </SafeAreaView>
  );
}
