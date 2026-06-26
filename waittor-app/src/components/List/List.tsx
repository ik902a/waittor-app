import React from "react";
import { api } from "../../auth/authApi";
import { TorItem } from "../TorItem/TorItem";
import { TorItemHeader } from "../TorItemHeader/TorItemHeader";
import styles from "./List.module.css";

// Внутри List.tsx изменить объявление пропсов:
interface ListProps {
  tors: Tor[];
  setTors: React.Dispatch<React.SetStateAction<Tor[]>>;
}

// Описание интерфейса сущности Tor (Movie)
interface Tor {
  id: number;
  name: string;
  release: string; // Формат даты YYYY-MM-DD
  torrentType: string;
}

export function List({ tors, setTors }: ListProps): React.JSX.Element {

  return (
    <div className={styles['tor-list']}>
      <TorItemHeader />

      {tors?.map((tor) => {
        // Удаление фильма
        const handleDeleteClick = async (torId: number): Promise<void> => {
          if (!window.confirm("Вы уверены?")) return;
          try {
            await api.delete(`/api/tors/delete/${torId}`);
            setTors(tors.filter((tor) => tor.id !== torId));
          } catch (error) {
            console.error("Ошибка удаления:", error);
          }
        };

        // // Открытие формы для редактирования
        // const handleEditClick = (tor: Tor): void => {
        //   setFormData({
        //     id: tor.id,
        //     name: tor.name,
        //     release: tor.release ? tor.release.split("T")[0] : "", // Формат YYYY-MM-DD для input type="date"
        //     torrentType: tor.torrentType,
        //   });
        //   setIsFormOpen(true);
        // };

        return (
          <TorItem
            tor={tor}
            onTorEdit={() => console.log("Update")}
            onTorDelete={handleDeleteClick}
            key={tor.id}
          />
        );
      })}
    </div>
  );
}
