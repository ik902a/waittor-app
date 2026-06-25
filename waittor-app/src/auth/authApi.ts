import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  AxiosError,
} from "axios";
import { authService } from "./authService";

interface QueuePromise {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:9091",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Переменные для предотвращения множественного рефреша
let isRefreshing = false;
let failedQueue: QueuePromise[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

// 1. Интерцептор ЗАПРОСА
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = authService.getToken();
    if (token && config.headers) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error: AxiosError): Promise<never> => Promise.reject(error),
);

interface RefreshResponse {
  accessToken: string;
}

// 2. Интерцептор ОТВЕТА
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError): Promise<any> => {
    const originalRequest = error.config as
      | CustomInternalAxiosRequestConfig
      | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Обрабатываем только 401 ошибку и только если этот запрос ЕЩЕ НЕ отправлялся повторно
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Если мы УЖЕ обновляем токен прямо сейчас, ставим этот запрос в очередь
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        if (originalRequest.headers) {
          originalRequest.headers.set("Authorization", `Bearer ${token}`);
        }
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const response = await axios.post<RefreshResponse>(
        "http://localhost:9091/api/auth/refresh",
        {},
        {
          withCredentials: true,
        },
      );

      const newAccessToken = response.data.accessToken;
      authService.setToken(newAccessToken);

      if (originalRequest.headers) {
        originalRequest.headers.set(
          "Authorization",
          `Bearer ${newAccessToken}`,
        );
      }
      // Пропускаем все накопившиеся запросы из очереди с новым токеном
      processQueue(null, newAccessToken);

      return api(originalRequest);
    } catch (refreshError) {
      authService.clearToken();
      window.dispatchEvent(new Event("auth-expired"));

      // Ошибка обновления: чистим очередь, куки и триггерим разлогин в React
      processQueue(refreshError, null);

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
