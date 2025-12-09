import { AntDesign } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Welcome() {
  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      {/* Header with overlayed logo */}
      <View className="w-full">
        <Image
          source={require('../../assets/images/header.png')}
          className="w-[450px] h-[450px]"
          resizeMode="contain"
        />
        {/* Logo overlayed on header - positioned at bottom center */}
        <View className="absolute bottom-0 left-0 right-0 items-center transform -translate-y-4 ">
          <Image
            source={require('../../assets/images/app-icon.png')}
            className="w-[400px] h-[350px]"
            resizeMode="contain"
          />
        </View>
      </View>

      <View className="flex-1 items-center px-3">
        <Text className="text-white text-3xl font-Jakarta-Bold  text-center">
          Let's get started
        </Text>
        <Text className="text-[#9ca3af] text-2xl font-Jakarta-Regular mt-2 mb-10 text-center">
          Access your personalized podcast summaries.
        </Text>

        <TouchableOpacity
          onPress={() => router.push('/(auth)/signup')}
          className="w-full bg-[#0a7aff] rounded-full py-4 mb-4"
        >
          <Text className="text-white text-center font-Jakarta-Bold text-lg">
            Sign Up
          </Text>
        </TouchableOpacity>

        {/* OR Divider */}
        <View className="w-full flex-row items-center mb-4">
          <View className="flex-1 h-[1px] bg-[#374151]" />
          <Text className="text-[#9ca3af] font-Jakarta-Regular mx-4">OR</Text>
          <View className="flex-1 h-[1px] bg-[#374151]" />
        </View>

        <TouchableOpacity
          onPress={() => router.push('/(auth)/login')}
          className="w-full bg-white rounded-full py-4 mb-4 flex-row items-center justify-center"
        >
          <AntDesign className="mt-1" name="google" size={20} color="black" />
          <Text className="text-black text-center font-Jakarta-Bold text-lg ml-2">
            Log In with Google
          </Text>
        </TouchableOpacity>

        <View className="flex-row items-center">
          <Text className="text-[#9ca3af] font-Jakarta-Regular">
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text className="text-[#2563eb] font-Jakarta-Bold">Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}
