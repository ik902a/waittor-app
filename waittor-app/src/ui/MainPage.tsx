import React, { useEffect, useState } from "react";
import { Header } from "./Header/Header";
import { Sidebar } from "./Sidebar/Sidebar";
import { List } from "../components/List/List";
import { api } from "../auth/authApi";
import { Modal } from "../components/Modal/Modal";
import styles from "./MainPage.module.css";

interface Movie {
  id: number;
  name: string;
  release: string;
  torrentType: string;
}

export function MainPage(): React.JSX.Element {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const fetchMovies = async (): Promise<void> => {
    try {
      console.log("GET /api/movies");
      const response = await api.get<Movie[]>("/api/movies");
      setMovies(response.data);
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // Клик на "Добавить" в Sidebar
  const handleAddMovie = () => {
    setSelectedMovie(null); // Сбрасываем выбранный фильм для режима создания
    setIsModalOpen(true);
  };

  // Клик на "Редактировать" в List
  const handleEditMovie = (movie: Movie) => {
    setSelectedMovie(movie); // Записываем фильм для режима редактирования
    setIsModalOpen(true);
  };

  // Клик на "Удалить" в List
  const handleDeleteMovie = async (id: number) => {
    const confirmDelete = window.confirm(
      "Вы уверены, что хотите удалить этот фильм?",
    );
    if (!confirmDelete) return;

    try {
      console.log(`DELETE /api/tors/${id}`);
      await api.delete(`/api/movies/${id}`);
      await fetchMovies(); // Обновляем список после удаления
    } catch (error) {
      console.error("Ошибка при удалении фильма:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null); // Зануляем стейт при закрытии
  };

  return (
    <div className={styles.layoutContainer}>
      <Header />
      <div className={styles.layoutBody}>
        <Sidebar onAddClick={handleAddMovie} />

        <main className={styles.layoutContent}>
          <h2>Список фильмов</h2>
          <List
            movies={movies}
            setMovies={setMovies}
            onDeleteClick={handleDeleteMovie}
            onEditClick={handleEditMovie}
          />
        </main>
      </div>
      {/* Модалка рендерится на уровне страницы и имеет доступ к fetchTors */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        fetchTors={fetchMovies}
        editData={selectedMovie} // Передаем данные в модалку
      />
    </div>
  );
}
