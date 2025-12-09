import { onboarding } from "@/constants";
import { useAuth } from "@/services/AuthContext";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";

export default function OnboardingScreen() {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { completeOnboarding } = useAuth();

  const isLastSlide = activeIndex === onboarding.length - 1;

  const handleDone = async () => {
    // Mark onboarding as complete
    await completeOnboarding();
    // Navigate to auth welcome/signup screen
    router.replace("/(auth)/welcome");
  };

  return (
    <SafeAreaView className="flex h-full items-center justify-between bg-[#121212]">
      <TouchableOpacity
        onPress={handleDone}
        className="w-full flex justify-end items-end p-5"
      >
        <Text className="text-white text-md font-Jakarta-Bold">Skip</Text>
      </TouchableOpacity>

      <Swiper
        ref={swiperRef}
        loop={false}
        dot={
          <View className="w-[32px] h-[4px] mx-1 bg-[#334155] rounded-full" />
        }
        activeDot={
          <View className="w-[32px] h-[4px] mx-1 bg-[#2563eb] rounded-full" />
        }
        onIndexChanged={(index) => setActiveIndex(index)}
      >
        {onboarding.map((item) => (
          <View key={item.id} className="flex items-center justify-center p-5">
            <Image
              source={item.image}
              className="w-full ml-5 h-[400px]"
              resizeMode="contain"
            />
            <View className="flex flex-row items-center justify-center w-full mt-10">
              <Text className="text-white text-6xl font-bold mx-10 text-center font-Jakarta-Bold">
                {item.header}
              </Text>
            </View>
            <Text className="text-3xl font-Jakarta-SemiBold text-center text-[#9ca3af] mx-10 mt-10">
              {item.subtext}
            </Text>
          </View>
        ))}
      </Swiper>

      <TouchableOpacity
        onPress={() =>
          isLastSlide ? handleDone() : swiperRef.current?.scrollBy(1)
        }
        className="w-11/12 mt-10 mb-5 bg-[#2563eb] rounded-full py-4"
      >
        <Text className="text-white text-center font-Jakarta-Bold text-lg">
          {isLastSlide ? "Get Started" : "Next"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
