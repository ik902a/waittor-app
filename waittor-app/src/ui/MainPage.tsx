import React, { useEffect, useState } from "react";
import { Header } from "./Header/Header";
import { Sidebar } from "./Sidebar/Sidebar";
import { List } from "../components/List/List";
import { api } from "../auth/authApi";
import { Modal } from "../components/Modal/Modal";
import styles from "./MainPage.module.css";

interface Tor {
  id: number;
  name: string;
  release: string;
  torrentType: string;
}

export function MainPage(): React.JSX.Element {
  const [tors, setTors] = useState<Tor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Общая функция загрузки данных
  const fetchTors = async (): Promise<void> => {
    try {
      console.log("GET /api/tors");
      const response = await api.get<Tor[]>("/api/tors");
      setTors(response.data);
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    }
  };

  // Загружаем данные при старте приложения
  useEffect(() => {
    fetchTors();
  }, []);

  return (
    <div className={styles.layoutContainer}>
      <Header />
      <div className={styles.layoutBody}>
        <Sidebar onAddClick={() => setIsModalOpen(true)}/>

        <main className={styles.layoutContent}>
          <h2>Список фильмов</h2>
          <List tors={tors} setTors={setTors} />
        </main>
      </div>
            {/* Модалка рендерится на уровне страницы и имеет доступ к fetchTors */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        fetchTors={fetchTors}
      />
    </div>
  );
}
