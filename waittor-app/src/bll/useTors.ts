import { useEffect, useState } from "react";
import { api } from "../auth/authApi";

interface Tor {
  id: number;
  name: string;
  release: string; // Формат даты YYYY-MM-DD
  torrentType: string;
}

export function useTors() {
  const [tors, setTors] = useState<Tor[]>([]);

  // Загрузка списка фильмов при старте
  useEffect(() => {
    fetchTors();
    //  getMovie();
  }, []);

  const fetchTors = async (): Promise<void> => {
    // getMovie()
    try {
      console.log("/api/tors");
      const response = await api.get<Tor[]>("/api/tors");
      setTors(response.data);
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    }
  };

  return {
    tors,
  };
}
