import React, { useEffect, useState, type ChangeEvent } from "react";
import { api } from "../../api";
import { getMovie } from "../../dal/requests";
import "./List.css"

// Описание интерфейса для типа торрента (Enum аналог на фронтенде)
interface TorrentTypeOption {
  value: string;
  name: string;
}

// Описание интерфейса сущности Tor (Movie)
interface Tor {
  id: number;
  name: string;
  release: string; // Формат даты YYYY-MM-DD
  torrentType: string;
}

// Структура данных формы (id может быть пустым при создании)
interface TorFormData {
  id: string | number;
  name: string;
  release: string;
  torrentType: string;
}

const TORRENT_TYPES: TorrentTypeOption[] = [
  { value: "OUR", name: "Отечественный" },
  { value: "SERIAL", name: "Сериал" },
  { value: "FOREIGN", name: "Зарубежный"}
];

// Функция для получения корректной локальной даты в формате YYYY-MM-DD
const getLocalDateString = (): string => {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split("T")[0];
};

export function List(): React.JSX.Element {
  const [tors, setTors] = useState<Tor[]>([]);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<TorFormData>({
    id: "",
    name: "",
    release: getLocalDateString(),
    torrentType: TORRENT_TYPES[0]?.value || "",
  });

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

  // Удаление фильма
  const handleDelete = async (id: string | number): Promise<void> => {
    if (!window.confirm("Вы уверены?")) return;
    try {
      await api.delete(`/api/tors/delete/${id}`);
      setTors(tors.filter((tor) => tor.id !== id));
    } catch (error) {
      console.error("Ошибка удаления:", error);
    }
  };

  // Открытие формы для редактирования
  const handleEditClick = (tor: Tor): void => {
    setFormData({
      id: tor.id,
      name: tor.name,
      release: tor.release ? tor.release.split("T")[0] : "", // Формат YYYY-MM-DD для input type="date"
      torrentType: tor.torrentType,
    });
    setIsFormOpen(true);
  };

  // // Общий обработчик изменений в полях формы
  // const handleInputChange = (
  //   e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  // ): void => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  // // Обработка отправки формы (Создание / Обновление)
  // const handleSubmit = async (e: SubmitEvent): Promise<void> => {
  //   e.preventDefault();

  //   try {
  //     await api.post("/api/tors/save", formData);
  //     setIsFormOpen(false);
  //     getMovie();
  //   } catch (error) {
  //     console.error("Ошибка сохранения:", error);
  //   }
  // };

  // Форматирование даты
  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU");
  };
  //
  return (
    // <div>
      <div className="tor-list">
        {/* Заголовки */}
        <div className="tor-row header">
          <div>Название</div>
          <div>Дата Релиза</div>
          <div>Тип фильма</div>
          <div></div>
          <div></div>
        </div>

        {/* Строки с данными */}
        {tors.map((tor) => (
          <div className="tor-row" key={tor.id}>
            <div style={{ fontWeight: 500 }}>{tor.name}</div>
            <div style={{ color: "#64748b" }}>{formatDate(tor.release)}</div>
            <div>
              <span
                style={{
                  background: "#dbeafe",
                  color: "#1e40af",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontSize: "0.85em",
                }}
              >
                {TORRENT_TYPES.find((t) => t.value === tor.torrentType)?.name ||
                  tor.torrentType}
              </span>
            </div>
            <button className="btn-edit" onClick={() => handleEditClick(tor)}>
              ✎
            </button>
            <button className="btn-del" onClick={() => handleDelete(tor.id)}>
              ×
            </button>
          </div>
        ))}
      </div>

      //{/* Контейнер формы
      // {isFormOpen && (
      //   <div style={{ marginTop: "20px" }} className="form-card">
      //     <form onSubmit={handleSubmit}>
      //       <input type="hidden" value={formData.id} />

      //       <input
      //         type="text"
      //         name="name"
      //         placeholder="Название"
      //         required
      //         value={formData.name}
      //         onChange={handleInputChange}
            // />

            // <input
            //   type="date"
            //   name="release"
            //   value={formData.release}
            //   onChange={handleInputChange}
            // />

            // <select
            //   name="torrentType"
            //   value={formData.torrentType}
            //   onChange={handleInputChange}
            // >
            //   {TORRENT_TYPES.map((type) => (
    //             <option key={type.value} value={type.value}>
    //               {type.name}
    //             </option>
    //           ))}
    //         </select>

    //         <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
    //           <button type="submit" className="btn">
    //             Сохранить
    //           </button>
    //           <button
    //             type="button"
    //             className="btn"
    //             style={{ background: "#94a3b8" }}
    //             onClick={() => setIsFormOpen(false)}
    //           >
    //             Отмена
    //           </button>
    //         </div>
    //       </form>
    //     </div>
    //   )} 
    //  </div> 
  );
}
