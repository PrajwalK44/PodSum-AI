import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useState } from 'react'
import {
  Alert,
  Animated,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function YouTubeLinkScreen() {
  const [podcastUrl, setPodcastUrl] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [fadeAnim] = useState(new Animated.Value(0))
  const [slideAnim] = useState(new Animated.Value(50))

  const isValidUrl = (url: string) => {
    // More generalized URL pattern for various podcast platforms
    const pattern =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|spotify\.com|soundcloud\.com|apple\.com|podcasts\.apple\.com).+/
    return pattern.test(url)
  }

  const handleUrlChange = (url: string) => {
    setPodcastUrl(url)

    // Show preview when valid URL is entered
    if (isValidUrl(url) && !showPreview) {
      setShowPreview(true)
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start()
    } else if (!isValidUrl(url) && showPreview) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => setShowPreview(false))
    }
  }

  const handleSummarize = () => {
    if (!podcastUrl.trim()) {
      Alert.alert('Error', 'Please enter a podcast URL')
      return
    }

    if (!isValidUrl(podcastUrl)) {
      Alert.alert('Error', 'Please enter a valid podcast URL')
      return
    }

    // TODO: Process podcast link and navigate to processing screen
    router.push('/(summarize)/processing')
  }

  const handlePaste = async () => {
    // TODO: Implement clipboard paste
    Alert.alert('Paste', 'Clipboard paste will be implemented here')
  }

  // Mock preview data - replace with actual API call
  const previewData = {
    title: 'Next Billion-Dollar Opportunity In India',
    author: 'Bill Gates',
    thumbnail: 'https://picsum.photos/seed/podcast1/300/200',
    views: '2M+ VIEWS',
    duration: '1 hours ago',
    category: '10k Views',
  }

  return (
    <SafeAreaView className="flex-1 bg-[#121212]" edges={['top']}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1">
          {/* Enhanced Header with Shadow */}
          <View
            className="bg-[#1e1e1e] px-6 py-6"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <View className="flex-row items-center mb-2">
              <TouchableOpacity onPress={() => router.back()} className="mr-3">
                <Ionicons name="arrow-back" size={28} color="#ffffff" />
              </TouchableOpacity>
              <Text className="text-white text-2xl font-Jakarta-Bold">
                Paste Podcast URL
              </Text>
            </View>
            <Text className="text-[#9ca3af] mt-2 ml-10 font-Jakarta-Regular">
              Enter the URL of the Podcast Episode
            </Text>
          </View>

          <View className="flex-1 px-6 pt-6">
            {/* URL Input */}
            <View className="mb-6">
              <View
                className={`bg-[#1e1e1e] rounded-xl p-4 flex-row items-center border ${isFocused ? 'border-[#0a7aff]' : 'border-[#2a2a2a]'}`}
              >
                <Ionicons name="link-outline" size={24} color="#6b7280" />
                <TextInput
                  placeholder="https://www.youtube.com/watch?v..."
                  placeholderTextColor="#6b7280"
                  value={podcastUrl}
                  onChangeText={handleUrlChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  autoCapitalize="none"
                  keyboardType="url"
                  className="flex-1 text-white ml-3 font-Jakarta-Regular"
                />
                {podcastUrl.length > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      setPodcastUrl('')
                      setShowPreview(false)
                    }}
                  >
                    <Ionicons name="close-circle" size={20} color="#9ca3af" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Preview Card - Animated */}
            {showPreview && (
              <Animated.View
                style={{
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }}
              >
                <View className="bg-[#2a2a2a] rounded-3xl overflow-hidden mb-6">
                  {/* Thumbnail */}
                  <View className="w-full h-48 bg-[#3a3a3a] relative">
                    <View className="flex-1 items-center justify-center">
                      <Ionicons name="play-circle" size={64} color="#0a7aff" />
                    </View>
                    {/* Views Badge */}
                    <View className="absolute bottom-3 left-3 bg-black/80 px-3 py-1.5 rounded-lg">
                      <Text className="text-white text-xs font-Jakarta-Bold">
                        {previewData.views}
                      </Text>
                    </View>
                    {/* Fire Icon */}
                    <View className="absolute bottom-3 right-3 bg-white w-10 h-10 rounded-full items-center justify-center">
                      <Ionicons name="flame" size={24} color="#ff4444" />
                    </View>
                  </View>

                  {/* Content */}
                  <View className="p-4">
                    <Text className="text-white text-lg font-Jakarta-Bold mb-1">
                      {previewData.title}
                    </Text>
                    <Text className="text-[#9ca3af] text-sm font-Jakarta-Regular mb-2">
                      By {previewData.author}
                    </Text>
                    <Text className="text-[#6b7280] text-xs font-Jakarta-Regular">
                      {previewData.category} • {previewData.duration}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            )}

            {/* Summarize Button */}
            <TouchableOpacity
              onPress={handleSummarize}
              className={`rounded-full py-4 ${podcastUrl.trim() && isValidUrl(podcastUrl) ? 'bg-[#0a7aff]' : 'bg-[#2a2a2a]'}`}
              disabled={!podcastUrl.trim() || !isValidUrl(podcastUrl)}
            >
              <Text className="text-white text-center font-Jakarta-Bold text-lg">
                Summarize
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  )
}
