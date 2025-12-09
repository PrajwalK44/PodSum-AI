import { router } from 'expo-router'
import { useEffect } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function ProcessingScreen() {
  useEffect(() => {
    // Simulate processing - replace with actual API call
    const timer = setTimeout(() => {
      router.replace('/(summarize)/result')
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <View className="flex-1 items-center justify-center px-6">
        {/* Logo Animation */}
        <View className="w-32 h-32 bg-[#0a7aff]/20 rounded-full items-center justify-center mb-8">
          <ActivityIndicator size="large" color="#0a7aff" />
        </View>

        {/* Processing Text */}
        <Text className="text-white text-2xl font-Jakarta-Bold mb-3 text-center">
          Processing Your Podcast
        </Text>
        <Text className="text-[#9ca3af] text-center font-Jakarta-Regular mb-8">
          This may take a few moments...
        </Text>

        {/* Progress Steps */}
        <View className="w-full">
          <ProcessingStep step="Uploading file" completed />
          <ProcessingStep step="Extracting audio" completed />
          <ProcessingStep step="Generating summary" active />
          <ProcessingStep step="Finalizing" />
        </View>
      </View>
    </SafeAreaView>
  )
}

function ProcessingStep({
  step,
  completed = false,
  active = false,
}: {
  step: string
  completed?: boolean
  active?: boolean
}) {
  return (
    <View className="flex-row items-center mb-4">
      <View
        className={`w-6 h-6 rounded-full items-center justify-center ${
          completed ? 'bg-[#10b981]' : active ? 'bg-[#0a7aff]' : 'bg-[#2a2a2a]'
        }`}
      >
        {completed && <Text className="text-white text-xs">✓</Text>}
        {active && <ActivityIndicator size="small" color="#ffffff" />}
      </View>
      <Text
        className={`ml-3 font-Jakarta-Medium ${
          completed || active ? 'text-white' : 'text-[#6b7280]'
        }`}
      >
        {step}
      </Text>
    </View>
  )
}
