import { API_URL } from "@/constants/Config";
import { getToken, removeToken } from "@/utils/storage";
import axios, {
    AxiosError,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await removeToken();
      // TODO: Navigate to login screen when created
      console.warn("Unauthorized - redirecting to login");
      // router.replace('/login');
    }
    return Promise.reject(error);
  },
);

export default api;
