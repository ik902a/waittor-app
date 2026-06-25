import logo from "/favicon.svg";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import styles from "./Header.module.css";
import { useAuth } from "../../auth/AuthContext";
import { Clock } from "../../components/Clock/Clock";

export function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  // Функция-обработчик для кнопки Выход
  const handleLogout = async () => {
    await logout();         // Вызываем очистку сессии на сервере и клиенте
    navigate("/login");     // Перенаправляем на страницу логина
  };

  return (
    <header>
      <div className={styles.logoGroup}>
        <img src={logo} alt="Logo" />
        <Clock />
      </div>

      {isAuthenticated ? (
        <div className={styles.buttonGroup}>
          <Button onClick={handleLogout}>Выход</Button>
        </div>
      ) : (
        <div className={styles.buttonGroup}>
          <Button onClick={() => navigate("/login")}>Вход</Button>
          <Button onClick={() => navigate("/registry")}>Регистрация</Button>
        </div>
      )}
    </header>
  );
}
