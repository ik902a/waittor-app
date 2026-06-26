import React from "react";
import styles from "./Button.module.css";
import { Loader } from "../Loader/Loader";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode; // Обязательный проп
  isLoading?: boolean; // Новый проп для лоадера
}

export function Button({
  children,
  className = "",
  isLoading,
  ...props
}: ButtonProps): React.JSX.Element {
  // Объединяем базовые стили, кастомные и стили загрузки
  const buttonClass = `
    ${styles.button} 
    ${isLoading ? styles.buttonLoading : ""} 
    ${styles[className] || ""}
  `.trim();

  console.log(className)
  console.log(buttonClass)

  return (
    <button
      className={buttonClass}
      {...props}
    >
      {isLoading ? <Loader /> : children}
    </button>
  );
}
