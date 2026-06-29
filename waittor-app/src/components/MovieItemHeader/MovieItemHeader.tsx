import styles from './MovieItemHeader.module.css'

export function MovieItemHeader() {
  return (
    <div className={styles.header}>
      <div>Название</div>
      <div>Дата Релиза</div>
      <div>Тип фильма</div>
      <div></div>
      <div></div>
    </div>
  );
}
