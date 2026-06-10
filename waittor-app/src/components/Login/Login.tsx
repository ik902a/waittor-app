import React, { useState, type SubmitEvent } from "react";
import { useAuth } from "../../AuthContext";
import { api } from "../../api";

export const Login: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Отправляем запрос на бэкенд
      const response = await api.post<{ accessToken: string }>(
        "/api/auth/login",
        {
          username,
          password,
        },
      );

      // Бэкенд запишет Refresh Token в куки автоматически (благодаря withCredentials)
      // А Access Token мы передаем в метод login
      login(response.data.accessToken);
    } catch (error) {
      setError("Неверный логин или пароль");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Логин"
        disabled={loading}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Пароль"
        disabled={loading}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Вход...' : 'Войти'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};
