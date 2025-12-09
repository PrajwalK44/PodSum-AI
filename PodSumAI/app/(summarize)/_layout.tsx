import { Stack } from 'expo-router'

export default function SummarizeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#121212' },
      }}
    >
      <Stack.Screen name="upload-audio" />
      <Stack.Screen name="youtube-link" />
      <Stack.Screen name="processing" />
      <Stack.Screen name="result" />
    </Stack>
  )
}
