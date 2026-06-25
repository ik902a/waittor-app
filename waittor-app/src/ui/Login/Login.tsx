import { useState, type SubmitEvent } from "react";
import { useAuth } from "../../auth/AuthContext";
import { api } from "../../auth/authApi";
import { useNavigate } from "react-router-dom"; // 1. Импортируем хук навигации
import styles from "./Login.module.css";
import { Button } from "../../components/Button/Button";
import { Input } from "../../components/Input/Input";
import { LogCuption } from "../../components/LogCuption/LogCuption";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate(); // 2. Инициализируем хук навигации
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
      // 3. ПЕРЕНАПРАВЛЯЕМ на рабочую страницу
      // replace: true заменяет /login в истории браузера, чтобы кнопка "Назад" не возвращала на форму входа
      navigate("/movies", { replace: true });
    } catch (error) {
      setError("Неверный логин или пароль");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Логин"
          disabled={loading}
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          disabled={loading}
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Вход..." : "Войти"}
        </Button>

        <LogCuption question="Впервые у нас?" value="Зарегистрироваться" path="/registry"/>

        {error && <ErrorMessage>{error}</ErrorMessage>}
      </form>
    </>
  );
}
