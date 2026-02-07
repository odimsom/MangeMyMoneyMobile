import {
    ApiResponse,
    AuthResponse,
    LoginRequest,
    RegisterRequest,
    User,
} from "@/types/auth";
import { removeToken, setToken } from "@/utils/storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import api from "./api";

const USER_KEY = "user";

const setUser = async (user: User) => {
  const jsonValue = JSON.stringify(user);
  if (Platform.OS === "web") {
    localStorage.setItem(USER_KEY, jsonValue);
  } else {
    await SecureStore.setItemAsync(USER_KEY, jsonValue);
  }
};

const getUser = async (): Promise<User | null> => {
  try {
    let jsonValue;
    if (Platform.OS === "web") {
      jsonValue = localStorage.getItem(USER_KEY);
    } else {
      jsonValue = await SecureStore.getItemAsync(USER_KEY);
    }
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("Error getting user", e);
    return null;
  }
};

const removeUser = async () => {
  if (Platform.OS === "web") {
    localStorage.removeItem(USER_KEY);
  } else {
    await SecureStore.deleteItemAsync(USER_KEY);
  }
};

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>(
      "/api/Auth/login",
      credentials,
    );
    const { data } = response;

    if (data.success && data.data) {
      await setToken(data.data.accessToken);
      await setUser(data.data.user);
      return data.data;
    }
    throw new Error(data.message || "Login failed");
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    // For mobile, we might need to handle verification URL differently or hardcode a generic one
    const payload = {
      ...data,
      verificationUrl: "https://managemymoney.com/verify",
    };

    const response = await api.post<ApiResponse<AuthResponse>>(
      "/api/Auth/register",
      payload,
    );
    const { data: responseData } = response;

    if (responseData.success && responseData.data) {
      await setToken(responseData.data.accessToken);
      await setUser(responseData.data.user);
      return responseData.data;
    }
    throw new Error(responseData.message || "Registration failed");
  },

  logout: async () => {
    await removeToken();
    await removeUser();
  },

  getCurrentUser: async (): Promise<User | null> => {
    return await getUser();
  },
};
