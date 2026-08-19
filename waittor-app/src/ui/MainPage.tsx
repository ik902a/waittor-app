import React, { useEffect, useState } from "react";
import { Header } from "./Header/Header";
import { Sidebar } from "./Sidebar/Sidebar";
import { List } from "../components/List/List";
import { Modal } from "../components/Modal/Modal";
import styles from "./MainPage.module.css";
import { Loader } from "../components/Loader/Loader";
import { useMovieSearch } from "../bll/useMovieSearch";
import { useMovies } from "../bll/useMovies";
import { useInfiniteScroll } from "../bll/useInfiniteScroll";
import { SortControl } from "../components/SortControl/SortControl";

interface Movie {
  id: number;
  name: string;
  release: string;
  torrentType: string;
}

export function MainPage(): React.JSX.Element {
  // 1. РАЗДЕЛЯЕМ СТЕМ: inputValue для инпута, debouncedSearch для запросов
  const { inputValue, setInputValue, debouncedSearch } = useMovieSearch();
  const {
    movies,
    setMovies,
    loading,
    hasMore,
    page,
    sort,
    order,
    setPage,
    fetchMovies,
    refresh,
    handleSort,
    deleteMovie,
  } = useMovies();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // начальная загрузка при изменении поиска/сортировки
  useEffect(() => {
    setPage(0);
    fetchMovies(0, false, debouncedSearch);
  }, [debouncedSearch, sort, order]);

  // подгрузка при скролле
  useEffect(() => {
    if (page > 0) fetchMovies(page, true, debouncedSearch);
  }, [page]);

  const loadMore = () => {
    if (!loading && hasMore) setPage((p) => p + 1);
  };

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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null); // Зануляем стейт при закрытии
  };

  const lastElementRef = useInfiniteScroll(loadMore, {
    enabled: !loading && hasMore,
  });

  return (
    <div className={styles.layoutContainer}>
      <Header onSearch={setInputValue} searchValue={inputValue} />
      <div className={styles.layoutBody}>
        <Sidebar onAddClick={handleAddMovie} />

        <main className={styles.layoutContent}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2>Список фильмов</h2>
            <SortControl sort={sort} order={order} onSort={handleSort} />
          </div>
          {loading && movies.length === 0 ? (
            <Loader />
          ) : (
            <>
              <List
                movies={movies}
                setMovies={setMovies}
                onDeleteClick={deleteMovie}
                onEditClick={handleEditMovie}
              />
              <div ref={lastElementRef} style={{ height: "20px" }} />
            </>
          )}
        </main>
      </div>
      {/* Модалка рендерится на уровне страницы и имеет доступ к fetchTors */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        fetchMovies={refresh}
        editData={selectedMovie} // Передаем данные в модалку
      />
    </div>
  );
}
