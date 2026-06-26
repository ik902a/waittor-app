import { useState } from "react";
import { Input } from "../../components/Input/Input";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../../components/Button/Button";
import { LogCuption } from "../../components/LogCuption/LogCuption";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";
import styles from "./Registry.module.css";

interface FieldErrors {
  login?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  global?: string;
}

export function Registry() {
  const [user, setUser] = useState({
    login: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser, // Копируем все текущие поля объекта
      [name]: value, // Обновляем только то поле, у которого совпадает name
    }));

    // Очищаем ошибку конкретного поля при начале ввода, чтобы не мозолить глаза
    if (errors[name as keyof FieldErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setErrors({});

    // Локальная проверка: совпадают ли пароли
    if (user.password !== confirmPassword) {
      setErrors({ confirmPassword: "Пароли не совпадают" });
      return;
    }

    setLoading(true);

    try {
      // Отправляем запрос на ваш WebFlux бэкенд (например, на /api/auth/register)
      await axios.post("http://localhost:9091/api/auth/register", user);

      // После успешной регистрации отправляем пользователя на страницу логина
      navigate("/login");
    } catch (err: any) {
      // Проверяем, прислал ли бэкенд мапу с ошибками валидации (статусы 400 и 409)
      if (
        err.response &&
        (err.response.status === 400 || err.response.status === 409)
      ) {
        // Сервер вернул объект вида { login: "Логин уже занят" }
        setErrors(err.response.data);
      } else {
        setErrors({
          global: "Произошла непредвиденная ошибка. Попробуйте позже.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Регистрация</h2>

      <div className={styles.inputWrapper}>
        <Input
          type="text"
          name="login"
          value={user.login}
          onChange={handleChange}
          placeholder="Придумайте логин"
          disabled={loading}
          required
          minLength={3}
          hasError={!!errors.login}
        />
        {errors.login && <ErrorMessage>{errors.login}</ErrorMessage>}
      </div>
      <div className={styles.inputWrapper}>
        <Input
          type="password"
          name="password"
          value={user.password}
          onChange={handleChange}
          placeholder="Придумайте пароль"
          disabled={loading}
          required
          minLength={6}
           hasError={!!errors.password}
        />
        {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
      </div>
      <div className={styles.inputWrapper}>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (errors.confirmPassword)
              setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
          }}
          placeholder="Повторите пароль"
          disabled={loading}
          required
           hasError={!!errors.confirmPassword} 
        />
        {errors.confirmPassword && (
          <ErrorMessage>{errors.confirmPassword}</ErrorMessage>
        )}
      </div>
      <div className={styles.inputWrapper}>
        <Input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          placeholder="Введите email"
          disabled={loading}
          required
          hasError={!!errors.email}
        />
        {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Регистрация..." : "Создать аккаунт"}
      </Button>
      <LogCuption question="Уже есть аккаунт?" value="Войти" path="/login" />
      {errors.global && <ErrorMessage>{errors.global}</ErrorMessage>}
    </form>
  );
}
