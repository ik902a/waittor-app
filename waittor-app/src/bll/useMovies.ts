import { useState, useCallback } from "react";
import { api } from "../auth/authApi";

interface Movie {
  id: number;
  name: string;
  release: string;
  torrentType: string;
}

interface PageResponse<T> {
  content: T[];
  totalPages: number;
}

interface SearchCriteria {
  search?: string;
  sortBy: string;
  order: string;
  page: number;
  size: number;
}

export function useMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState("id");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const size = 15;

  const fetchMovies = useCallback(async (targetPage: number, append: boolean, searchQuery?: string) => {
    setLoading(true);
    try {
      const params: SearchCriteria = {
        search: searchQuery, // заполняется извне
        sortBy: sort,
        order,
        page: targetPage,
        size,
      };
      const res = await api.get<PageResponse<Movie>>("/movies", { params });
      setMovies(prev => append ? [...prev, ...res.data.content] : res.data.content);
      setHasMore(targetPage < res.data.totalPages - 1);
    } finally {
      setLoading(false);
    }
  }, [sort, order]);

  // для обновления списка после изменений
  const refresh = useCallback(async () => {
    setPage(0);
    await fetchMovies(0, false, );
  }, [fetchMovies]);

  const handleSort = (field: string) => {
    const isAsc = sort === field && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setSort(field);
    setPage(0);
  };

  const deleteMovie = async (id: number) => {
    if (!window.confirm("Удалить фильм?")) return;
    await api.delete(`/movies/${id}`);
    refresh();
  };

  return {
    movies, setMovies, loading, hasMore, page, sort, order,
    setPage, fetchMovies, refresh, handleSort, deleteMovie
  };
}