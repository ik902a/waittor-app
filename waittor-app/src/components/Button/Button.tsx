import React from "react";
import styles from "./Button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode; // Обязательный проп
  // pro: () => void;
}

export function Button({
  children,
  className = "",
  ...props
}: ButtonProps): React.JSX.Element {
  return (
    <button
      // className={`btn btn-${variant} ${className}`}
      className={`${styles.button} ${styles[className]}`}
      {...props}
    >
      {children}
    </button>
  );
}
