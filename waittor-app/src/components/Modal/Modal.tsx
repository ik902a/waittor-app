import { useState } from "react";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";
import styles from "./Modal.module.css";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { api } from "../../auth/authApi";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  fetchTors: () => Promise<void>;
}

interface FieldErrors {
  name?: string;
  release?: string; //date
  torrentType?: string; // enum
  global?: string;
}

// Описание интерфейса сущности Tor (Movie)
interface Tor {
  id: number;
  name: string;
  release: string; // Формат даты YYYY-MM-DD
  torrentType: string;
}

// Описание интерфейса для типа торрента (Enum аналог на фронтенде)
interface TorrentTypeOption {
  value: string;
  name: string;
}

const TORRENT_TYPES: TorrentTypeOption[] = [
  { value: "", name: "Выберите тип..." },
  { value: "OUR", name: "Отечественный" },
  { value: "SERIAL", name: "Сериал" },
  { value: "FOREIGN", name: "Зарубежный" },
];

const getTodayDateString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function Modal({
  isOpen,
  onClose,
  fetchTors,
}: ModalProps): React.JSX.Element | null {
  const [tor, setTor] = useState({
    name: "",
    release: getTodayDateString(),
    torrentType: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  // Если состояние isOpen === false, компонент ничего не рендерит
  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setTor((prevTor) => ({
      ...prevTor, // Копируем все текущие поля объекта
      [name]: value, // Обновляем только то поле, у которого совпадает name
    }));

    // Очищаем ошибку конкретного поля при начале ввода, чтобы не мозолить глаза
    if (errors[name as keyof FieldErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      console.log("POST /api/tors", tor);
      // Отправляем POST-запрос с объектом данных tor
      // Типизируем ответ как <Tor>, где Tor — ваш интерфейс сущности с бэкенда
      await api.post<Tor>("/api/tors", tor);

      await fetchTors();

      onClose();
      setTor({
        name: "",
        release: getTodayDateString(),
        torrentType: "",
      });
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        global: "Произошла ошибка при сохранении",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    // Backdrop — это полупрозрачный темный фон за модалкой. Клик по нему закрывает окно.
    <div className={styles.backdrop} onClick={onClose}>
      {/* Остановка всплытия (stopPropagation), чтобы клик внутри самой модалки её не закрывал */}
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginTop: 0, marginBottom: "16px" }}>
          Добавление фильма
        </h3>

        <form onSubmit={handleSubmit}>
          {/* <input type="hidden" value={formData.id} /> */}

          <div className={styles.inputWrapper}>
            <Input
              type="text"
              name="name"
              value={tor.name}
              onChange={handleChange}
              placeholder="Название фильма"
              disabled={loading}
              required
              hasError={!!errors.name}
            />
            {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
          </div>

          <div className={styles.inputWrapper}>
            <Input
              type="date"
              name="release"
              value={tor.release}
              onChange={handleChange}
              placeholder="Дата релиза"
              disabled={loading}
              hasError={!!errors.release}
              required
            />
            {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
          </div>

          <div className={styles.inputWrapper}>
            <select
              name="torrentType"
              value={tor.torrentType}
              onChange={handleChange}
              disabled={loading}
              required
            >
              {TORRENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div
            style={{
              display: "flex",
              gap: "8px",
              justifyContent: "flex-end",
              marginTop: "24px",
            }}
          >
            <Button onClick={onClose}>Отмена</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
