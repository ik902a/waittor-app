import React from 'react';
import { Button } from '../Button/Button';
import styles from "./Search.module.css";

interface SearchProps {
  searchValue: string;
  onSearch: (text: string) => void;
}

export function Search({ searchValue, onSearch }: SearchProps): React.JSX.Element {
   return (
    <div className={styles.searchGroup}>
      <input
        type="text"
        placeholder="Поиск фильмов..."
        value={searchValue}
        onChange={(e) => onSearch(e.target.value)}
        className={styles.searchInput}
      />
      {searchValue && (
        <Button
          onClick={() => onSearch("")}
          className="buttonClear"
          title="Очистить поиск"
        >
          ✕
        </Button>
      )}
    </div>
  );
}