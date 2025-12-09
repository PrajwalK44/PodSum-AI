import { useAuth } from "@/services/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface VerificationModalProps {
  visible: boolean;
  onClose: () => void;
  email: string;
  onVerificationSuccess?: () => void;
}

export default function VerificationModal({
  visible,
  onClose,
  email,
  onVerificationSuccess,
}: VerificationModalProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const { verifyOTP, resendOTP, login } = useAuth();

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      value = value[0];
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      return;
    }

    setIsVerifying(true);
    try {
      const result = await verifyOTP(email, otpCode);

      if (result.success) {
        setIsSuccess(true);
        onVerificationSuccess?.();
      } else {
        Alert.alert("Verification Failed", result.message);
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleBrowseHome = () => {
    // Reset state before closing
    setOtp(["", "", "", "", "", ""]);
    setIsSuccess(false);
    onClose();
    // Navigate to login so user can login with verified account
    router.replace("/(auth)/login");
  };

  const handleClose = () => {
    // Reset state before closing
    setOtp(["", "", "", "", "", ""]);
    setIsSuccess(false);
    onClose();
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      const result = await resendOTP(email);

      if (result.success) {
        Alert.alert("Success", "A new OTP has been sent to your email");
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  if (isSuccess) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <View className="flex-1 bg-black/80 justify-center items-center px-6">
          <View className="bg-[#1e1e1e] rounded-3xl p-8 w-full max-w-md items-center">
            {/* Success Icon */}
            <View className="w-24 h-24 bg-green-500/20 rounded-full items-center justify-center mb-6">
              <Ionicons name="checkmark-circle" size={64} color="#10b981" />
            </View>

            {/* Success Message */}
            <Text className="text-white text-2xl font-Jakarta-Bold mb-2 text-center">
              Verification Successful!
            </Text>
            <Text className="text-[#9ca3af] text-center font-Jakarta-Regular mb-8">
              Your email has been verified. You can now login to your account.
            </Text>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleBrowseHome}
              className="w-full bg-[#0a7aff] rounded-full py-4"
            >
              <Text className="text-white text-center font-Jakarta-Bold text-lg">
                Login Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/80 justify-center items-center px-6">
        <View className="bg-[#1e1e1e] rounded-3xl p-8 w-full max-w-md">
          {/* Close Button */}
          <TouchableOpacity
            onPress={handleClose}
            className="absolute top-4 right-4 z-10"
          >
            <Ionicons name="close-circle" size={28} color="#6b7280" />
          </TouchableOpacity>

          {/* Email Icon */}
          <View className="w-20 h-20 bg-[#0a7aff]/20 rounded-full items-center justify-center mb-6 self-center">
            <Ionicons name="mail-outline" size={40} color="#0a7aff" />
          </View>

          {/* Title */}
          <Text className="text-white text-2xl font-Jakarta-Bold mb-2 text-center">
            Verify Your Email
          </Text>
          <Text className="text-[#9ca3af] text-center font-Jakarta-Regular mb-8">
            Enter the 6-digit code sent to{"\n"}
            <Text className="text-white font-Jakarta-Medium">{email}</Text>
          </Text>

          {/* OTP Input */}
          <View className="flex-row justify-between mb-6">
            {otp.map((digit: string, index: number) => (
              <TextInput
                key={index}
                ref={(ref: TextInput | null) => {
                  inputRefs.current[index] = ref;
                }}
                value={digit}
                onChangeText={(value: string) => handleOtpChange(value, index)}
                onKeyPress={({
                  nativeEvent: { key },
                }: {
                  nativeEvent: { key: string };
                }) => handleKeyPress(key, index)}
                keyboardType="number-pad"
                maxLength={1}
                className="w-12 h-14 bg-[#2a2a2a] rounded-xl text-white text-center text-xl font-Jakarta-Bold border border-[#3a3a3a]"
                style={{ textAlign: "center" }}
              />
            ))}
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            onPress={handleVerify}
            disabled={otp.join("").length !== 6 || isVerifying}
            className={`w-full rounded-full py-4 mb-4 ${
              otp.join("").length === 6 && !isVerifying
                ? "bg-[#0a7aff]"
                : "bg-[#2a2a2a]"
            }`}
          >
            <Text className="text-white text-center font-Jakarta-Bold text-lg">
              {isVerifying ? "Verifying..." : "Verify"}
            </Text>
          </TouchableOpacity>

          {/* Resend Code */}
          <View className="flex-row items-center justify-center">
            <Text className="text-[#9ca3af] font-Jakarta-Regular">
              Didn't receive code?{" "}
            </Text>
            <TouchableOpacity onPress={handleResend} disabled={isResending}>
              <Text className="text-[#0a7aff] font-Jakarta-Bold">
                {isResending ? "Sending..." : "Resend"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
