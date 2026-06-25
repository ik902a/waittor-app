import React, { useState, type ChangeEvent } from 'react';
import { Button } from '../../components/Button/Button';
import './Sidebar.css';
import { api } from '../../auth/authApi';
import { getMovie } from '../../dal/torApi';

// Описание интерфейса для типа торрента (Enum аналог на фронтенде)
// interface TorrentTypeOption {
//   value: string;
//   name: string;
// }

// interface Tor {
//   id: number;
//   name: string;
//   release: string; // Формат даты YYYY-MM-DD
//   torrentType: string;
// }

// Структура данных формы (id может быть пустым при создании)
// interface TorFormData {
//   id: string | number;
//   name: string;
//   release: string;
//   torrentType: string;
// }

// const TORRENT_TYPES: TorrentTypeOption[] = [
//   { value: "OUR", name: "Отечественный" },
//   { value: "SERIAL", name: "Сериал" },
//   { value: "FOREIGN", name: "Зарубежный"}
// ];

// Функция для получения корректной локальной даты в формате YYYY-MM-DD
// const getLocalDateString = (): string => {
//   const date = new Date();
//   const offset = date.getTimezoneOffset();
//   const localDate = new Date(date.getTime() - offset * 60 * 1000);
//   return localDate.toISOString().split("T")[0];
// };

export function Sidebar(): React.JSX.Element {

      // Открытие формы для редактирования
//   const handleEditClick = (tor: Tor): void => {
//     setFormData({
//       id: tor.id,
//       name: tor.name,
//       release: tor.release ? tor.release.split("T")[0] : "", // Формат YYYY-MM-DD для input type="date"
//       torrentType: tor.torrentType,
//     });
//     setIsFormOpen(true);
//   };

    //   const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    //   const [formData, setFormData] = useState<TorFormData>({
    //     id: "",
    //     name: "",
    //     release: getLocalDateString(),
    //     torrentType: TORRENT_TYPES[0]?.value || "",
    //   });

    // Кнопка "Проверить"
    const handleCheck = async (): Promise<void> => {
      try {
        await api.get("/api/tors/check");
        console.log("Запрос на проверку успешно отправлен");
      } catch (error) {
        console.error("Ошибка:", error);
      }
    };

      // Открытие формы для создания нового фильма
  const handleAddClick = (): void => {
    // setFormData({
    //   id: "",
    //   name: "",
    //   release: new Date().toISOString().split("T")[0],
    //   torrentType: TORRENT_TYPES[0]?.value || "",
    // });
    // setIsFormOpen(true);
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

  return (
    <aside className="sidebar">
      <nav className="sidebar-menu">
        <Button className="sidebar-btn" onClick={handleAddClick}>
          + Добавить
        </Button>
        <Button className="sidebar-btn" onClick={handleCheck}>
          Проверить
        </Button>
      </nav>
    </aside>

    //       {/* Контейнер формы */}
    //   {isFormOpen && (
    //     <div style={{ marginTop: "20px" }} className="form-card">
    //       <form onSubmit={handleSubmit}>
    //         <input type="hidden" value={formData.id} />

    //         <input
    //           type="text"
    //           name="name"
    //           placeholder="Название"
    //           required
    //           value={formData.name}
    //           onChange={handleInputChange}
    //         />

    //         <input
    //           type="date"
    //           name="release"
    //           value={formData.release}
    //           onChange={handleInputChange}
    //         />

    //         <select
    //           name="torrentType"
    //           value={formData.torrentType}
    //           onChange={handleInputChange}
    //         >
    //           {TORRENT_TYPES.map((type) => (
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
  );
}
