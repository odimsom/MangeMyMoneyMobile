import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const setToken = async (token: string) => {
  if (Platform.OS === "web") {
    localStorage.setItem("token", token);
  } else {
    await SecureStore.setItemAsync("token", token);
  }
};

export const getToken = async () => {
  if (Platform.OS === "web") {
    return localStorage.getItem("token");
  } else {
    return await SecureStore.getItemAsync("token");
  }
};

export const removeToken = async () => {
  if (Platform.OS === "web") {
    localStorage.removeItem("token");
  } else {
    await SecureStore.deleteItemAsync("token");
  }
};
