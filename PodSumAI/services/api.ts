import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { API_CONFIG } from "@/constants";

// Resolve API base URL in a device-friendly way:
// - If `API_CONFIG.PHYSICAL_DEVICE_IP` is set, use it (recommended for physical devices)
// - Android emulator uses 10.0.2.2 to reach host localhost
// - iOS simulator uses localhost
const DEFAULT_PORT = API_CONFIG?.PORT || 5000;
const PHYSICAL_IP = API_CONFIG?.PHYSICAL_DEVICE_IP;

// Build base URL and ensure it points to the /api prefix used by the backend
let API_BASE_URL = "";
if (PHYSICAL_IP) {
  API_BASE_URL = `http://${PHYSICAL_IP}:${DEFAULT_PORT}/api`;
} else if (Platform.OS === "android") {
  API_BASE_URL = `http://10.0.2.2:${DEFAULT_PORT}/api`;
} else {
  API_BASE_URL = `http://localhost:${DEFAULT_PORT}/api`;
}

// Exported for quick debug in app logs
export { API_BASE_URL };

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  USER_DATA: "user_data",
  HAS_ONBOARDED: "has_onboarded",
};

// Types
export interface User {
  name: string;
  email: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// Helper function to get auth token
const getAuthToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
};

// Helper function to make API requests with timeout
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const token = await getAuthToken();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Attempt to parse as JSON; fall back to text for error pages (HTML)
    const contentType = response.headers.get("content-type") || "";
    let parsed: any = null;
    let textBody: string | null = null;

    if (contentType.includes("application/json")) {
      parsed = await response.json();
    } else {
      // Non-JSON response (could be HTML error page) — read as text
      textBody = await response.text();
    }

    if (!response.ok) {
      // Prefer any message from parsed JSON; otherwise include status and text body
      const errorMessage =
        parsed?.message ||
        (textBody
          ? `HTTP ${response.status}: ${textBody}`
          : `HTTP ${response.status}`) ||
        "An error occurred";

      console.error("API non-OK response:", response.status, errorMessage);

      return {
        success: false,
        message: errorMessage,
      };
    }

    // Success: return parsed JSON when available, otherwise return raw text
    return {
      success: true,
      message: (parsed && parsed.message) || "Success",
      data: parsed ?? textBody,
    };
  } catch (error: any) {
    console.error("API Request Error:", error);

    if (error.name === "AbortError") {
      return {
        success: false,
        message:
          "Request timed out. Please check your connection and try again.",
      };
    }

    return {
      success: false,
      message: `Network error. Please ensure the backend server is running at ${API_BASE_URL}`,
    };
  }
};

// Auth API functions
export const authApi = {
  // Register a new user
  register: async (
    name: string,
    email: string,
    password: string
  ): Promise<ApiResponse> => {
    return apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  },

  // Login user
  login: async (
    email: string,
    password: string
  ): Promise<ApiResponse<{ token: string }>> => {
    const response = await apiRequest<{ token: string; message: string }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    );

    if (response.success && response.data?.token) {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
    }

    return response;
  },

  // Verify OTP
  verifyOTP: async (email: string, otp: string): Promise<ApiResponse> => {
    return apiRequest("/auth/verify", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });
  },

  // Resend OTP
  resendOTP: async (email: string): Promise<ApiResponse> => {
    return apiRequest("/auth/resend", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  // Logout user
  logout: async (): Promise<ApiResponse> => {
    const response = await apiRequest("/auth/logout", {
      method: "POST",
    });

    // Clear local storage regardless of API response
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.AUTH_TOKEN,
      STORAGE_KEYS.USER_DATA,
    ]);

    return response;
  },

  // Get user home data (protected route)
  getHome: async (): Promise<ApiResponse<{ name: string }>> => {
    return apiRequest("/auth/home", {
      method: "GET",
    });
  },

  // Check if user is authenticated
  isAuthenticated: async (): Promise<boolean> => {
    const token = await getAuthToken();
    if (!token) return false;

    // Optionally verify token by calling a protected route
    const response = await authApi.getHome();
    return response.success;
  },
};

// Onboarding helpers
export const onboardingApi = {
  // Check if user has completed onboarding
  hasOnboarded: async (): Promise<boolean> => {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.HAS_ONBOARDED);
    return value === "true";
  },

  // Mark onboarding as complete
  completeOnboarding: async (): Promise<void> => {
    await AsyncStorage.setItem(STORAGE_KEYS.HAS_ONBOARDED, "true");
  },

  // Reset onboarding (for testing)
  resetOnboarding: async (): Promise<void> => {
    await AsyncStorage.removeItem(STORAGE_KEYS.HAS_ONBOARDED);
  },
};

// User data helpers
export const userApi = {
  // Save user data locally
  saveUserData: async (user: User): Promise<void> => {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  },

  // Get saved user data
  getUserData: async (): Promise<User | null> => {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  },

  // Clear all user data (for logout)
  clearAllData: async (): Promise<void> => {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.AUTH_TOKEN,
      STORAGE_KEYS.USER_DATA,
    ]);
  },
};

export default {
  auth: authApi,
  onboarding: onboardingApi,
  user: userApi,
};
