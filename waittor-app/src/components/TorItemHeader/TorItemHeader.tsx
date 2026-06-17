import styles from './TorItemHeader.module.css'

export function TorItemHeader() {
  return (
    <div className={`${styles.torRow} ${styles.header}`}>
      <div>Название</div>
      <div>Дата Релиза</div>
      <div>Тип фильма</div>
      <div></div>
      <div></div>
    </div>
  );
}
