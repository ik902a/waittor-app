import { Button } from "../Button/Button";
import styles from "./TorItem.module.css"

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
  { value: "OUR", name: "Отечественный" },
  { value: "SERIAL", name: "Сериал" },
  { value: "FOREIGN", name: "Зарубежный" },
];

type TorItemProps = {
  tor: Tor;
  onTorEdit: (tor: Tor) => void;
  onTorDelete: (torId: number) => void;
};

export function TorItem(props: TorItemProps) {
  const tor = props.tor;

  // Удаление фильма
  const handleDeleteClick = () => {
    props.onTorDelete(tor.id);
  };

  // Открытие формы для редактирования
  const handleEditClick = () => {
    props.onTorEdit(tor);
  };

  // Форматирование даты
  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU");
  };

  return (
    <>
      <div className={styles['tor-row']}>
        <div className={styles.torName}>{tor.name}</div>
        <div className={styles.torDate}>{formatDate(tor.release)}</div>
        <div>
          <span className={styles.torType}>
            {TORRENT_TYPES.find((t) => t.value === tor.torrentType)?.name ||
              tor.torrentType}
          </span>
        </div>
        <Button className="buttonEdit" onClick={handleEditClick}>✎</Button>
        <Button className="buttonDelete" onClick={handleDeleteClick}>×</Button>
      </div>
    </>
  );
}
