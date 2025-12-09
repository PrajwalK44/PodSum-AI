import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useState } from 'react'
import { Alert, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function UploadAudioScreen() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  const handlePickFile = async () => {
    // TODO: Implement file picker using expo-document-picker
    Alert.alert('File Picker', 'Audio file picker will be implemented here')
  }

  const handleUploadAndSummarize = () => {
    if (!selectedFile) {
      Alert.alert('Error', 'Please select an audio file first')
      return
    }
    // TODO: Upload file and navigate to processing screen
    router.push('/(summarize)/processing')
  }

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      {/* Header */}
      <View className="flex-row items-center px-6 py-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-Jakarta-Bold ml-4">
          Upload Audio File
        </Text>
      </View>

      <View className="flex-1 px-6 pt-8">
        {/* Upload Area */}
        <TouchableOpacity
          onPress={handlePickFile}
          className="border-2 border-dashed border-[#4a4a4a] rounded-3xl p-12 items-center justify-center mb-6"
          style={{ minHeight: 250 }}
        >
          <View className="w-20 h-20 bg-[#FFC107] rounded-full items-center justify-center mb-4">
            <Ionicons name="cloud-upload-outline" size={40} color="#ffffff" />
          </View>
          <Text className="text-white text-lg font-Jakarta-Bold mb-2">
            Tap to Upload Audio
          </Text>
          <Text className="text-[#9ca3af] text-center font-Jakarta-Regular">
            Supported formats: MP3, WAV, M4A, etc.
          </Text>
        </TouchableOpacity>

        {/* Selected File */}
        {selectedFile && (
          <View className="bg-[#1e1e1e] rounded-2xl p-4 mb-6 flex-row items-center">
            <Ionicons name="musical-note" size={24} color="#0a7aff" />
            <View className="flex-1 ml-3">
              <Text className="text-white font-Jakarta-Medium">
                {selectedFile}
              </Text>
              <Text className="text-[#9ca3af] text-sm font-Jakarta-Regular">
                Ready to upload
              </Text>
            </View>
            <TouchableOpacity onPress={() => setSelectedFile(null)}>
              <Ionicons name="close-circle" size={24} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        )}

        {/* Upload Button */}
        <TouchableOpacity
          onPress={handleUploadAndSummarize}
          className={`rounded-full py-4 ${selectedFile ? 'bg-[#0a7aff]' : 'bg-[#2a2a2a]'}`}
          disabled={!selectedFile}
        >
          <Text className="text-white text-center font-Jakarta-Bold text-lg">
            Upload & Summarize
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
