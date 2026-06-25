import { Link } from "react-router-dom";
import styles from "./LogCuption.module.css";

interface LogCuptionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  question: string;
  value: string;
  path: string
}

export function LogCuption({ question, value, path }: LogCuptionProps) {
  return (
    <p className={styles.caption}>
      {question}{" "}
      <Link className={styles.link} to={path}>
        {value}
      </Link>
    </p>
  );
}
