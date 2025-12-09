import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function LiveScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <View className="flex-1 items-center justify-center">
        <Text className="text-white text-2xl font-Jakarta-Bold">Live</Text>
        <Text className="text-[#9ca3af] mt-2 font-Jakarta-Regular">
          Live podcast transcription
        </Text>
      </View>
    </SafeAreaView>
  )
}
