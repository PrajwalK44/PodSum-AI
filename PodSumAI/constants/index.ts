import onboarding1 from "../assets/images/onboarding1.png";
import onboarding2 from "@/assets/images/onboarding2.png";
import onboarding3 from "@/assets/images/onboarding3.png";

export const images = {
  onboarding1,
  onboarding2,
  onboarding3,
};

export const onboarding = [
  {
    id: 1,
    header: "Overwhelmed by Podcasts?",
    subtext: "Advanced AI transforms long podcasts into concise summaries.",
    image: images.onboarding1,
  },
  {
    id: 2,
    header: "Upload, Link, or Go Live",
    subtext: "Get summaries from files, links, or live audio.",
    image: images.onboarding2,
  },
  {
    id: 3,
    header: "Chat With Your Podcasts.",
    subtext: "Go beyond summaries. Ask questions for instant answers.",
    image: images.onboarding3,
  },
];

export const data = {
  onboarding,
};

// API Configuration - Change this for your environment
export const API_CONFIG = {
  // For physical device testing, set your computer's IP here
  // Your machine IP (as provided): 192.168.0.106
  PHYSICAL_DEVICE_IP: "192.168.0.106", // Set this to your IP for physical device testing
  PORT: 5000,
};
