import { Button } from "../Button/Button";
import styles from "./MovieItem.module.css"

// Описание интерфейса сущности Tor (Movie)
interface Movie {
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
  { value: "OUR", name: "Отечественный" },
  { value: "SERIAL", name: "Сериал" },
  { value: "FOREIGN", name: "Зарубежный" },
];

type MovieItemProps = {
  movie: Movie;
  onEditClick: (movie: Movie) => void;
  onDeleteClick: (movieId: number) => void;
};

export function MovieItem(props: MovieItemProps) {
  const movie = props.movie;

  // Удаление фильма
  const handleDeleteClick = () => {
    props.onDeleteClick(movie.id);
  };

  // Открытие формы для редактирования
  const handleEditClick = () => {
    props.onEditClick(movie);
  };

  // Форматирование даты
  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU");
  };

  return (
      <div className={styles.movieRow}>
        <div className={styles.movieName}>{movie.name}</div>
        <div className={styles.movieDate}>{formatDate(movie.release)}</div>
        <div>
          <span className={styles.movieType}>
            {TORRENT_TYPES.find((t) => t.value === movie.torrentType)?.name ||
              movie.torrentType}
          </span>
        </div>
        <Button className="buttonEdit" onClick={handleEditClick}>✎</Button>
        <Button className="buttonDelete" onClick={handleDeleteClick}>×</Button>
      </div>
  );
}
