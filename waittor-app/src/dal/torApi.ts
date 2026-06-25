import { api } from "../auth/authApi";

// Описание интерфейса сущности Tor (Movie)
interface Tor {
  id: number;
  name: string;
  release: string; // Формат даты YYYY-MM-DD
  torrentType: string;
}

export const getMovie = () => {
        try {
          return api.get<Tor[]>("/api/tors")
          .then(res => res.data);
        } catch (error) {
          console.error("Ошибка загрузки данных:", error);
        }
}