import React from "react";
import { api } from "../../auth/authApi";
import { MovieItem } from "../MovieItem/MovieItem";
import { MovieItemHeader } from "../MovieItemHeader/MovieItemHeader";
import styles from "./List.module.css";

// Внутри List.tsx изменить объявление пропсов:
interface ListProps {
  movies: Movie[];
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
  onEditClick: (movie: Movie) => void;
  onDeleteClick?: (id: number) => void;
}

interface Movie {
  id: number;
  name: string;
  release: string; // Формат даты YYYY-MM-DD
  torrentType: string;
}

export function List({ movies, setMovies, onEditClick }: ListProps): React.JSX.Element {
  const handleDeleteClick = async (movieId: number): Promise<void> => {
    if (!window.confirm("Вы уверены, что хотите удалить этот фильм?")) return;
    try {
      // Используем ваш эндпоинт из примера
      await api.delete(`/api/movies/delete/${movieId}`);
      setMovies((prevMovies) =>
        prevMovies.filter((movie) => movie.id !== movieId),
      );
    } catch (error) {
      console.error("Ошибка удаления:", error);
    }
  };

  return (
    <div className={styles.movieList}>
      <MovieItemHeader />

      {movies?.map((movie) => (
        <MovieItem
          key={movie.id}
          movie={movie}
          onEditClick={() => onEditClick(movie)}
          onDeleteClick={handleDeleteClick}
        />
      ))}
    </div>
  );
}
