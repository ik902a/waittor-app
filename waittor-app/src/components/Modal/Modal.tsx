import { useEffect, useState } from "react";
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
  editData: Movie | null;
}

interface FieldErrors {
  name?: string;
  release?: string;
  torrentType?: string;
  global?: string;
}

interface Movie {
  id?: number;
  name: string;
  release: string; // Формат даты YYYY-MM-DD
  torrentType: string;
}

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
  return today.toISOString().split("T")[0];
};

const initialFormState: Movie = {
  name: "",
  release: getTodayDateString(),
  torrentType: "",
};

export function Modal({
  isOpen,
  onClose,
  fetchTors,
  editData,
}: ModalProps): React.JSX.Element | null {
  const [movie, setMovie] = useState<Movie>(initialFormState);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  // Синхронизируем стейт с входящими данными при открытии модалки
  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setMovie(editData);
      } else {
        setMovie(initialFormState);
      }
      setErrors({});
    }
  }, [isOpen, editData]);

  if (!isOpen) return null;

  const isEditMode = !!movie.id;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setMovie((prevMovie) => ({
      ...prevMovie, // Копируем все текущие поля объекта
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
      if (isEditMode) {
        console.log(`PUT /api/tors/${movie.id}`, movie);
        await api.put<Movie>(`/api/movies/${movie.id}`, movie);
      } else {
        console.log("POST /api/tors", movie);
        await api.post<Movie>("/api/movies", movie);
      }

      await fetchTors();
      handleClose();
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        global: "Произошла ошибка при сохранении",
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setMovie(initialFormState);
    onClose();
  };

  return (
    // Backdrop — это полупрозрачный темный фон за модалкой. Клик по нему закрывает окно.
    <div className={styles.backdrop} onClick={handleClose}>
      {/* Остановка всплытия (stopPropagation), чтобы клик внутри самой модалки её не закрывал */}
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.headline}>
          {isEditMode ? "Редактирование фильма" : "Добавление фильма"}
        </h3>

        {errors.global && <ErrorMessage>{errors.global}</ErrorMessage>}

        <form onSubmit={handleSubmit}>

          <div className={styles.inputWrapper}>
            <Input
              type="text"
              name="name"
              value={movie.name}
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
              value={movie.release}
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
              value={movie.torrentType}
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
            {errors.torrentType && <ErrorMessage>{errors.torrentType}</ErrorMessage>}
          </div>

          <div className={styles.buttonGroup}>
            <Button type="button" onClick={handleClose}>Отмена</Button>
            <Button type="submit" disabled={loading} isLoading={loading}>
              Сохранить
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
