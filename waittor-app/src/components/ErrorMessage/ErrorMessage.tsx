import styles from "./ErrorMessage.module.css";

interface ErrorMessageProps {
    children: React.ReactNode; 
}

export function ErrorMessage({ children }: ErrorMessageProps) {
  return (
    <p className={styles.error}>
      {children}
    </p>
  );
}
