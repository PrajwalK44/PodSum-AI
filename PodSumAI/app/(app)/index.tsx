import { View, Image } from "react-native";
import React from "react";

const SplashScreen = () => {
  return (
    <View className="flex-1 bg-[#121212] items-center justify-center">
      <Image
        source={require("../../assets/images/app-icon.png")}
        className="w-48 h-48"
        resizeMode="contain"
      />
    </View>
  );
};

export default SplashScreen;
