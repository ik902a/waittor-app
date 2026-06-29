import React, { useState } from "react";
import { Button } from "../../components/Button/Button";
import { api } from "../../auth/authApi";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  onAddClick: () => void;
}

export function Sidebar({ onAddClick }: SidebarProps): React.JSX.Element {
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const handleCheck = async (): Promise<void> => {
    setIsChecking(true);
    // Запускаем таймер на 5 секунд для разблокировки
    const unlockTimer = new Promise((resolve) => setTimeout(resolve, 5000));
    try {
      await api.get("/api/movies/check");
      console.log("Запрос на проверку успешно отправлен");
    } catch (error) {
      console.error("Ошибка:", error);
    } finally {
      await unlockTimer;
      setIsChecking(false); // Выключаем режим загрузки в любом случае (успех/ошибка)
    }
  };

  return (
    <>
      <aside className={styles.sidebar}>
        <nav className={styles.sidebarMenu}>
          <Button className="buttonSidebar" onClick={onAddClick}>
            + Добавить
          </Button>
          <Button
            className="buttonSidebar"
            onClick={handleCheck}
            disabled={isChecking}
            isLoading={isChecking}
          >
            Проверить
          </Button>
        </nav>
      </aside>
    </>
  );
}
