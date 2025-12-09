import { router } from 'expo-router'
import React, { useEffect, useRef } from 'react'
import { Animated, Image, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Startup() {
  const iconAnim = useRef(new Animated.Value(-200)).current
  const textAnim = useRef(new Animated.Value(-300)).current

  useEffect(() => {
    // Icon floats in from top with spring animation
    Animated.spring(iconAnim, {
      toValue: 0,
      tension: 40,
      friction: 7,
      useNativeDriver: true,
    }).start()

    // Text slides in from left with a delay
    Animated.timing(textAnim, {
      toValue: 0,
      duration: 800,
      delay: 300,
      useNativeDriver: true,
    }).start()

    // Navigate to onboarding index after 2.5 seconds
    const timer = setTimeout(() => {
      router.replace('/(onboarding)')
    }, 2500)

    return () => clearTimeout(timer)
  }, [iconAnim, textAnim])

  return (
    <SafeAreaView className="bg-[#121212] flex-1">
      <View className="flex-1 items-center justify-center">
        <Animated.View style={{ transform: [{ translateY: iconAnim }] }}>
          <Image
            source={require('../../assets/images/app-icon.png')}
            className="w-[420px] h-[420px]"
            resizeMode="contain"
          />
        </Animated.View>
      </View>
      <View className="pb-6 items-center">
        <Animated.View style={{ transform: [{ translateX: textAnim }] }}>
          <Text className="text-white font-bold text-[28px] font-Jakarta-Bold">
            Insights, Not Hours
          </Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  )
}
