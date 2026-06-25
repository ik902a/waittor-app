import { useState } from "react";
import { Input } from "../../components/Input/Input";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../../components/Button/Button";
import styles from "./Registry.module.css";
import { LogCuption } from "../../components/LogCuption/LogCuption";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";

export function Registry() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setUser((prevUser) => ({
    ...prevUser,     // Копируем все текущие поля объекта
    [name]: value,   // Обновляем только то поле, у которого совпадает name
  }));
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Локальная проверка: совпадают ли пароли
    if (user.password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    setLoading(true);

    try {
      // Отправляем запрос на ваш WebFlux бэкенд (например, на /api/auth/register)
      await axios.post("http://localhost:9091/api/auth/register", user);

      // После успешной регистрации отправляем пользователя на страницу логина
      navigate("/login");
    } catch (err: any) {
      // Обработка ошибок от бэкенда (например, если логин уже занят)
      const serverMessage =
        err.response?.data?.message || "Ошибка при регистрации";
      setError(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Регистрация</h2>

      <Input
        type="text"
        name="username"
        value={user.username}
        onChange={handleChange}
        placeholder="Придумайте логин"
        disabled={loading}
        required
        minLength={3}
      />
      <Input
        type="password"
        name="password"
        value={user.password}
        onChange={handleChange}
        placeholder="Придумайте пароль"
        disabled={loading}
        required
        minLength={6}
      />
      <Input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Повторите пароль"
        disabled={loading}
        required
      />
      <Input
        type="email"
        name="email"
        value={user.email}
        onChange={handleChange}
        placeholder="Введите email"
        disabled={loading}
        required
      />

      <Button type="submit" disabled={loading}>
        {loading ? "Регистрация..." : "Создать аккаунт"}
      </Button>
      <LogCuption question="Уже есть аккаунт?" value="Войти" path="/login" />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </form>
  );
}
