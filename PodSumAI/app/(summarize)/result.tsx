import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { ScrollView, Share, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function ResultScreen() {
  const summary = {
    title: "Billionaire's Brain vs Your Brain",
    author: 'Raj Shamani',
    duration: '45 min',
    keyPoints: [
      'The importance of mindset in achieving success',
      'How billionaires think differently about money and risk',
      'Building systems instead of setting goals',
      'The power of compound growth in business',
      'Learning from failure and pivoting quickly',
    ],
    fullSummary:
      'This podcast explores the fundamental differences in how billionaires approach problems and opportunities. The discussion covers various aspects of entrepreneurship, including risk-taking, decision-making, and long-term thinking. Key insights include the importance of creating systems that generate consistent results rather than relying on motivation alone.',
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this summary: ${summary.title}\n\n${summary.fullSummary}`,
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-[#2a2a2a]">
        <TouchableOpacity onPress={() => router.replace('/(app)')}>
          <Ionicons name="close" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-Jakarta-Bold">Summary</Text>
        <TouchableOpacity onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color="#0a7aff" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        {/* Success Badge */}
        <View className="items-center mb-6">
          <View className="w-16 h-16 bg-[#10b981]/20 rounded-full items-center justify-center mb-3">
            <Ionicons name="checkmark-circle" size={40} color="#10b981" />
          </View>
          <Text className="text-[#10b981] font-Jakarta-Bold text-lg">
            Summary Ready!
          </Text>
        </View>

        {/* Podcast Info */}
        <View className="bg-[#1e1e1e] rounded-2xl p-4 mb-6">
          <Text className="text-white text-xl font-Jakarta-Bold mb-2">
            {summary.title}
          </Text>
          <Text className="text-yellow-500 font-Jakarta-Medium mb-2">
            {summary.author}
          </Text>
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={16} color="#9ca3af" />
            <Text className="text-[#9ca3af] text-sm font-Jakarta-Regular ml-1">
              {summary.duration}
            </Text>
          </View>
        </View>

        {/* Key Points */}
        <Text className="text-white text-lg font-Jakarta-Bold mb-4">
          Key Points
        </Text>
        <View className="mb-6">
          {summary.keyPoints.map((point, index) => (
            <View key={index} className="flex-row mb-3">
              <View className="w-6 h-6 bg-[#0a7aff] rounded-full items-center justify-center mr-3">
                <Text className="text-white text-xs font-Jakarta-Bold">
                  {index + 1}
                </Text>
              </View>
              <Text className="flex-1 text-[#e5e7eb] font-Jakarta-Regular leading-6">
                {point}
              </Text>
            </View>
          ))}
        </View>

        {/* Full Summary */}
        <Text className="text-white text-lg font-Jakarta-Bold mb-4">
          Full Summary
        </Text>
        <Text className="text-[#e5e7eb] font-Jakarta-Regular leading-7 mb-6">
          {summary.fullSummary}
        </Text>

        {/* Actions */}
        <View className="flex-row gap-3 mb-8">
          <TouchableOpacity className="flex-1 bg-[#0a7aff] rounded-full py-4">
            <Text className="text-white text-center font-Jakarta-Bold">
              Save Summary
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-[#2a2a2a] rounded-full py-4">
            <Text className="text-white text-center font-Jakarta-Bold">
              Export PDF
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
