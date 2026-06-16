import React, { createContext, useState, useContext, useEffect } from "react";
import { authService } from "./authService";
import axios from "axios";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean; // Добавляем loading в контекст (пригодится)
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Изначально ставим false, так как реальный статус мы узнаем только после checkAuth
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const login = (token: string): void => {
    authService.setToken(token);
    setIsAuthenticated(true);
  };

  const logout = (): void => {
    authService.clearToken();
    setIsAuthenticated(false);
    // TODO: Вызвать API для удаления Refresh Token из кук
  };

  useEffect(() => {
    let isMounted = true; // Флаг для предотвращения Race Condition

    const handleAuthExpired = () => {
      if (isMounted) setIsAuthenticated(false);
    };
    window.addEventListener("auth-expired", handleAuthExpired);

    const checkAuth = async () => {
      try {
        const response = await axios.post<{ accessToken: string }>(
          '/api/auth/refresh',
          {},
          // { withCredentials: true },
          { _retry: true } as any // Флаг, чтобы интерцептор не зациклился
        );

        // Обновляем состояние, только если компонент еще жив
        if (isMounted) {
          authService.setToken(response.data.accessToken);
          setIsAuthenticated(true);
        }
      } catch (error) {
        // Безопасное логирование для TypeScript
        const message =
          error instanceof Error ? error.message : "Неизвестная ошибка";
        console.log("Сессия отсутствует или просрочена:", message);

        if (isMounted) {
          authService.clearToken();
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false; // Отменяем обновление состояния при размонтировании
      window.removeEventListener("auth-expired", handleAuthExpired);
    };
  }, []);

  if (loading) return <div>Загрузка...</div>;

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {/* {children} */}
            {/* Пока идет проверка, показываем один общий лоадер, чтобы роуты не делали редирект раньше времени */}
      {loading ? (
        <div className="global-loader">Загрузка приложения...</div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
