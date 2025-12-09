import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { authApi, onboardingApi, userApi, STORAGE_KEYS, User } from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  hasOnboarded: boolean;
  user: User | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  verifyOTP: (
    email: string,
    otp: string
  ) => Promise<{ success: boolean; message: string }>;
  resendOTP: (email: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Check initial auth state
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      setIsLoading(true);

      // Check onboarding status
      const onboarded = await onboardingApi.hasOnboarded();
      setHasOnboarded(onboarded);

      // Check if token exists
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

      if (token) {
        // Verify token is still valid by calling protected route
        const response = await authApi.getHome();

        if (response.success && response.data) {
          setIsAuthenticated(true);
          setUser({ name: response.data.name, email: "" });

          // Try to get cached user data for email
          const cachedUser = await userApi.getUserData();
          if (cachedUser) {
            setUser(cachedUser);
          }
        } else {
          // Token is invalid, clear it
          await userApi.clearAllData();
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking auth state:", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await authApi.login(email, password);

    if (response.success) {
      // Get user data
      const homeResponse = await authApi.getHome();
      if (homeResponse.success && homeResponse.data) {
        const userData: User = { name: homeResponse.data.name, email };
        await userApi.saveUserData(userData);
        setUser(userData);
      }
      setIsAuthenticated(true);
    }

    return { success: response.success, message: response.message };
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await authApi.register(name, email, password);
    return { success: response.success, message: response.message };
  };

  const verifyOTP = async (email: string, otp: string) => {
    const response = await authApi.verifyOTP(email, otp);
    return { success: response.success, message: response.message };
  };

  const resendOTP = async (email: string) => {
    const response = await authApi.resendOTP(email);
    return { success: response.success, message: response.message };
  };

  const logout = async () => {
    await authApi.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  const completeOnboarding = async () => {
    await onboardingApi.completeOnboarding();
    setHasOnboarded(true);
  };

  const refreshUser = async () => {
    const response = await authApi.getHome();
    if (response.success && response.data) {
      const cachedUser = await userApi.getUserData();
      setUser({
        name: response.data.name,
        email: cachedUser?.email || "",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        hasOnboarded,
        user,
        login,
        register,
        verifyOTP,
        resendOTP,
        logout,
        completeOnboarding,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
