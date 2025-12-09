import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  Animated,
  Dimensions,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

const { height } = Dimensions.get('window')

interface SummarizeModalProps {
  visible: boolean
  onClose: () => void
}

export default function SummarizeModal({
  visible,
  onClose,
}: SummarizeModalProps) {
  const [slideAnim] = useState(new Animated.Value(height))

  // Slide up animation when visible changes
  useEffect(() => {
    if (visible) {
      // Reset position and slide up
      slideAnim.setValue(height)
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start()
    }
  }, [visible])

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose()
    })
  }

  const handleUploadAudio = () => {
    // Navigate to upload audio screen
    handleClose()
    setTimeout(() => {
      router.push('/(summarize)/upload-audio')
    }, 300)
  }

  const handlePasteYouTube = () => {
    // Navigate to YouTube link screen
    handleClose()
    setTimeout(() => {
      router.push('/(summarize)/youtube-link')
    }, 300)
  }

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
    >
      {/* Blurred Backdrop */}
      <BlurView intensity={20} tint="dark" className="flex-1">
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleClose}
          className="flex-1 bg-black/30"
        >
          {/* Drawer */}
          <Animated.View
            style={{
              transform: [{ translateY: slideAnim }],
            }}
            className="absolute bottom-0 left-0 right-0 bg-[#1e1e1e] rounded-t-[30px] pb-8"
          >
            <TouchableOpacity activeOpacity={1}>
              {/* Handle Bar */}
              <View className="items-center pt-4 pb-6">
                <View className="w-12 h-1 bg-[#4a4a4a] rounded-full" />
              </View>

              {/* Title */}
              <Text className="text-white text-2xl font-Jakarta-Bold text-center mb-8">
                Summarize New Podcast
              </Text>

              {/* Upload Audio Files Option */}
              <TouchableOpacity
                onPress={handleUploadAudio}
                className="mx-6 mb-4 bg-gradient-to-r from-[#FFC107] to-[#FFD54F] rounded-3xl overflow-hidden"
                style={{
                  backgroundColor: '#FFC107',
                }}
              >
                <View className="flex-row items-center p-6">
                  <View className="flex-1">
                    <Text className="text-white text-xl font-Jakarta-Bold mb-1">
                      Upload Audio
                    </Text>
                    <Text className="text-white text-xl font-Jakarta-Bold">
                      Files
                    </Text>
                  </View>
                  {/* Audio Wave Icon */}
                  <View className="w-24 h-24 items-center justify-center">
                    <View className="flex-row items-end gap-1">
                      <View className="w-1.5 h-8 bg-[#4CAF50] rounded-full" />
                      <View className="w-1.5 h-16 bg-[#4CAF50] rounded-full" />
                      <View className="w-1.5 h-12 bg-[#4CAF50] rounded-full" />
                      <View className="w-1.5 h-20 bg-[#4CAF50] rounded-full" />
                      <View className="w-1.5 h-10 bg-[#4CAF50] rounded-full" />
                      <View className="w-1.5 h-16 bg-[#4CAF50] rounded-full" />
                      <View className="w-1.5 h-8 bg-[#4CAF50] rounded-full" />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Paste YouTube Link Option */}
              <TouchableOpacity
                onPress={handlePasteYouTube}
                className="mx-6 mb-4 rounded-3xl overflow-hidden"
                style={{
                  backgroundColor: '#C62828',
                }}
              >
                <View className="flex-row items-center p-6">
                  <View className="flex-1">
                    <Text className="text-white text-xl font-Jakarta-Bold mb-1">
                      Paste Youtube
                    </Text>
                    <Text className="text-white text-xl font-Jakarta-Bold">
                      Link
                    </Text>
                  </View>
                  {/* YouTube Icon */}
                  <View className="w-24 h-24 items-center justify-center">
                    <View
                      className="w-20 h-16 rounded-2xl items-center justify-center"
                      style={{
                        backgroundColor: '#FF5252',
                        transform: [{ rotate: '15deg' }],
                      }}
                    >
                      <View
                        className="w-16 h-12 rounded-xl items-center justify-center"
                        style={{
                          backgroundColor: '#EF5350',
                        }}
                      >
                        <Ionicons name="play" size={28} color="#ffffff" />
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Close Button */}
              <TouchableOpacity
                onPress={handleClose}
                className="mx-6 mt-2 py-3"
              >
                <Text className="text-[#9ca3af] text-center font-Jakarta-Medium text-base">
                  Cancel
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </BlurView>
    </Modal>
  )
}
