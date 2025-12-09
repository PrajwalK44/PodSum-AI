import TopBar from "@/components/TopBar";
import { useAuth } from "@/services/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import {useState} from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SummarizeModal from "./summarize";

interface Podcast {
  id: string;
  title: string;
  author: string;
  thumbnail: string;
  views: string;
}

const recommendedPodcasts: Podcast[] = [
  {
    id: "1",
    title: "Billionaire's Brain vs Your Brain",
    author: "Raj Shamani",
    thumbnail: "https://picsum.photos/seed/podcast1/200/120",
    views: "7.7M+ VIEWS",
  },
  {
    id: "2",
    title: "How to Build a Billion Dollar Company",
    author: "Naval Ravikant",
    thumbnail: "https://picsum.photos/seed/podcast2/200/120",
    views: "5.2M+ VIEWS",
  },
  {
    id: "3",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    thumbnail: "https://picsum.photos/seed/podcast3/200/120",
    views: "4.8M+ VIEWS",
  },
  {
    id: "4",
    title: "Startup Lessons from Y Combinator",
    author: "Paul Graham",
    thumbnail: "https://picsum.photos/seed/podcast4/200/120",
    views: "3.9M+ VIEWS",
  },
  {
    id: "5",
    title: "The Art of Negotiation",
    author: "Chris Voss",
    thumbnail: "https://picsum.photos/seed/podcast5/200/120",
    views: "6.1M+ VIEWS",
  },
  {
    id: "6",
    title: "Deep Work and Focus",
    author: "Cal Newport",
    thumbnail: "https://picsum.photos/seed/podcast6/200/120",
    views: "4.5M+ VIEWS",
  },
  {
    id: "7",
    title: "Building in Public",
    author: "Pieter Levels",
    thumbnail: "https://picsum.photos/seed/podcast7/200/120",
    views: "2.8M+ VIEWS",
  },
  {
    id: "8",
    title: "Marketing Mastery",
    author: "Seth Godin",
    thumbnail: "https://picsum.photos/seed/podcast8/200/120",
    views: "5.7M+ VIEWS",
  },
  {
    id: "9",
    title: "AI and the Future",
    author: "Lex Fridman",
    thumbnail: "https://picsum.photos/seed/podcast9/200/120",
    views: "8.3M+ VIEWS",
  },
];

const recentlySummarized: Podcast[] = [
  {
    id: "10",
    title: "Atomic Habits Explained",
    author: "James Clear",
    thumbnail: "https://picsum.photos/seed/recent1/200/120",
    views: "9.2M+ VIEWS",
  },
  {
    id: "11",
    title: "Zero to One Summary",
    author: "Peter Thiel",
    thumbnail: "https://picsum.photos/seed/recent2/200/120",
    views: "7.5M+ VIEWS",
  },
  {
    id: "12",
    title: "Think and Grow Rich",
    author: "Napoleon Hill",
    thumbnail: "https://picsum.photos/seed/recent3/200/120",
    views: "6.8M+ VIEWS",
  },
  {
    id: "13",
    title: "The Lean Startup",
    author: "Eric Ries",
    thumbnail: "https://picsum.photos/seed/recent4/200/120",
    views: "5.4M+ VIEWS",
  },
  {
    id: "14",
    title: "Good to Great",
    author: "Jim Collins",
    thumbnail: "https://picsum.photos/seed/recent5/200/120",
    views: "4.9M+ VIEWS",
  },
  {
    id: "15",
    title: "The 4-Hour Work Week",
    author: "Tim Ferriss",
    thumbnail: "https://picsum.photos/seed/recent6/200/120",
    views: "8.1M+ VIEWS",
  },
  {
    id: "16",
    title: "Start With Why",
    author: "Simon Sinek",
    thumbnail: "https://picsum.photos/seed/recent7/200/120",
    views: "7.3M+ VIEWS",
  },
  {
    id: "17",
    title: "The Innovators Dilemma",
    author: "Clayton Christensen",
    thumbnail: "https://picsum.photos/seed/recent8/200/120",
    views: "3.6M+ VIEWS",
  },
  {
    id: "18",
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    thumbnail: "https://picsum.photos/seed/recent9/200/120",
    views: "10.2M+ VIEWS",
  },
];

const PodcastCard = ({
  podcast,
  buttonText = "Summarize",
}: {
  podcast: Podcast;
  buttonText?: string;
}) => (
  <TouchableOpacity className="bg-[#1e1e1e] rounded-2xl mb-3 overflow-hidden w-full">
    {/* Thumbnail */}
    <View className="w-full h-[120px] bg-[#2a2a2a]">
      <Image
        source={{ uri: podcast.thumbnail }}
        className="w-full h-full"
        resizeMode="cover"
      />
      {/* Views Badge */}
      <View className="absolute bottom-2 left-2 bg-black/80 px-2 py-1 rounded">
        <Text className="text-white text-xs font-Jakarta-Bold">
          {podcast.views}
        </Text>
      </View>
    </View>

    {/* Content */}
    <View className="p-4">
      <Text
        className="text-white text-base font-Jakarta-Bold mb-1"
        numberOfLines={2}
      >
        {podcast.title}
      </Text>
      <Text className="text-yellow-500 text-sm font-Jakarta-Medium mb-3">
        {podcast.author}
      </Text>

      <TouchableOpacity className="bg-[#0a7aff] rounded-full px-6 py-2 self-start">
        <Text className="text-white font-Jakarta-Bold text-sm">
          {buttonText}
        </Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

export default function HomeScreen() {
  const [showSummarizeModal, setShowSummarizeModal] = useState(false);
  const { user } = useAuth();

  const handleSummarizeNew = () => {
    setShowSummarizeModal(true);
  };

  const handleCloseModal = () => {
    setShowSummarizeModal(false);
  };

  // Split podcasts into columns of 3
  const getColumns = (podcasts: Podcast[]) => {
    const columns = [];
    for (let i = 0; i < podcasts.length; i += 3) {
      columns.push(podcasts.slice(i, i + 3));
    }
    return columns;
  };

  const recommendedColumns = getColumns(recommendedPodcasts);
  const recentColumns = getColumns(recentlySummarized);

  return (
    <SafeAreaView className="flex-1 bg-[#121212]" edges={["top"]}>
      <TopBar userName={user?.name || "User"} userEmail={user?.email || ""} />

      <ScrollView className="flex-1">
        {/* Recommended Podcasts Section */}
        <View className="mt-4">
          <Text className="text-white text-2xl font-Jakarta-Bold px-6 mb-4">
            Recommended Podcasts
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-6"
            contentContainerStyle={{ gap: 16 }}
          >
            {recommendedColumns.map((column, columnIndex) => (
              <View key={`rec-col-${columnIndex}`} className="w-[320px]">
                {column.map((podcast) => (
                  <PodcastCard key={podcast.id} podcast={podcast} />
                ))}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Recently Summarized Section */}
        <View className="mt-6">
          <Text className="text-white text-2xl font-Jakarta-Bold px-6 mb-4">
            Recently Summarized
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-6"
            contentContainerStyle={{ gap: 16 }}
          >
            {recentColumns.map((column, columnIndex) => (
              <View key={`recent-col-${columnIndex}`} className="w-[320px]">
                {column.map((podcast) => (
                  <PodcastCard
                    key={podcast.id}
                    podcast={podcast}
                    buttonText="Read"
                  />
                ))}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Bottom Spacing */}
        <View className="h-32" />
      </ScrollView>

      {/* Floating Summarize New Podcast Button */}
      <View className="absolute bottom-24 left-6 right-6">
        <TouchableOpacity
          onPress={handleSummarizeNew}
          className="bg-[#0a7aff] rounded-[15px] py-4 px-6 flex-row items-center justify-center gap-2 shadow-lg"
          style={{
            shadowColor: "#0a7aff",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Ionicons name="add-circle" size={24} color="#ffffff" />
          <Text className="text-white font-Jakarta-Bold text-lg">
            Summarize New Podcast
          </Text>
        </TouchableOpacity>
      </View>

      {/* Summarize Modal */}
      <SummarizeModal visible={showSummarizeModal} onClose={handleCloseModal} />
    </SafeAreaView>
  );
}
