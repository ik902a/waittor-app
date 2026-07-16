import React, { useCallback, useEffect, useRef, useState } from "react";
import { Header } from "./Header/Header";
import { Sidebar } from "./Sidebar/Sidebar";
import { List } from "../components/List/List";
import { api } from "../auth/authApi";
import { Modal } from "../components/Modal/Modal";
import styles from "./MainPage.module.css";
import { Loader } from "../components/Loader/Loader";

interface Movie {
  id: number;
  name: string;
  release: string;
  torrentType: string;
}

// 2. Добавляем интерфейс ответа пагинации
interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}

export function MainPage(): React.JSX.Element {
  const [movies, setMovies] = useState<Movie[]>([]);

  // 1. РАЗДЕЛЯЕМ СТЕМ: inputValue для инпута, debouncedSearch для запросов
  const [inputValue, setInputValue] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  const [sort, setSort] = useState<string>("id");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState<number>(0);
  const [size] = useState<number>(10); // Фиксированный размер страницы (например, 10 элементов)

  const [hasMore, setHasMore] = useState<boolean>(true); // Есть ли еще данные на бэке
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Реф для отслеживания самого последнего элемента списка
  const observerRef = useRef<IntersectionObserver | null>(null);

    // 2. ДЕБАУНС-ЭФФЕКТ: Переносит значение из инпута в поисковый стейт с задержкой в 500мс
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(inputValue);
    }, 500); // Время задержки в миллисекундах

    return () => {
      clearTimeout(handler); // Очищаем таймер при каждом новом нажатии клавиши
    };
  }, [inputValue]);

  // 3. Обновленная функция запроса с query-параметрами
  const fetchMovies = useCallback(
    async (targetPage: number, isAppend: boolean): Promise<void> => {
      setLoading(true);
      try {
        console.log(
          `GET /movies?query=${debouncedSearch }&sort=${sort}&order=${order}&page=${page}`,
        );

        const response = await api.get<PageResponse<Movie>>("/movies", {
          params: {
            search: debouncedSearch  || undefined, // Если строка пустая, параметр не пойдет в URL
            sort,
            order,
            page: targetPage,
            size,
          },
        });

        const newMovies = response.data.content;
        // Сохраняем контент и метаданные отдельно
        setMovies((prev) => (isAppend ? [...prev, ...newMovies] : newMovies));

        // Проверяем, не дошли ли мы до конца всех страниц
        setHasMore(targetPage < response.data.totalPages - 1);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch , sort, order, size],
  );

  useEffect(() => {
    setPage(0);
    fetchMovies(0, false);
  }, [debouncedSearch , sort, order, fetchMovies]);

  // Эффект 2: Срабатывает ТОЛЬКО при пагинации (когда страница инкрементируется скроллом)
  useEffect(() => {
    if (page > 0) {
      fetchMovies(page, true); // true означает: добавить к текущему списку в конец
    }
  }, [page, fetchMovies]);

  // Функция-колбэк для IntersectionObserver (отслеживание конца списка)
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        // Если элемент появился в зоне видимости и на бэке еще есть данные
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1); // Переключаем страницу, сработает Эффект 2
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore],
  );

  // Хэндлер для поиска (передадим его в Header)
  const handleSearch = (text: string) => {
    setInputValue(text);
  };

  // Хэндлер для сортировки (можно вызывать по клику на колонки)
  const handleSort = (field: string) => {
    const isAsc = sort === field && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setSort(field);
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

  // Клик на "Удалить" в List
  const handleDeleteMovie = async (id: number) => {
    const confirmDelete = window.confirm(
      "Вы уверены, что хотите удалить этот фильм?",
    );
    if (!confirmDelete) return;

    try {
      console.log(`DELETE /api/tors/${id}`);
      await api.delete(`/movies/${id}`);
      setPage(0);
      await fetchMovies(0, false); // Обновляем список после удаления
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
      <Header onSearch={handleSearch} searchValue={inputValue}/>
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
            <div style={{ fontSize: "14px", color: "#666" }}>
              Сортировка:
              <button
                onClick={() => handleSort("name")}
                style={{
                  marginLeft: "5px",
                  fontWeight: sort === "name" ? "bold" : "normal",
                }}
              >
                По названию {sort === "name" && (order === "asc" ? "🔼" : "🔽")}
              </button>
              <button
                onClick={() => handleSort("release")}
                style={{
                  marginLeft: "10px",
                  fontWeight: sort === "release" ? "bold" : "normal",
                }}
              >
                По релизу{" "}
                {sort === "release" && (order === "asc" ? "🔼" : "🔽")}
              </button>
            </div>
          </div>
          {loading ? (
            <Loader />
          ) : (
            <List
              movies={movies}
              setMovies={setMovies}
              onDeleteClick={handleDeleteMovie}
              onEditClick={handleEditMovie}
            />
          )}
          {/* Контейнер-триггер для бесконечного скролла */}
          <div ref={lastElementRef} style={{ height: "20px" }} />
        </main>
      </div>
      {/* Модалка рендерится на уровне страницы и имеет доступ к fetchTors */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        fetchMovies={fetchMovies}
        editData={selectedMovie} // Передаем данные в модалку
      />
    </div>
  );
}
