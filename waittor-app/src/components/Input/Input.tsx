import React from "react";
import styles from "./Input.module.css"; // Если используете CSS-модули

// Расширяем стандартные атрибуты тега input, чтобы работали value, onChange, placeholder и т.д.
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean; // Добавляем новый проп
}

export function Input({ hasError, className, ...props }: InputProps): React.JSX.Element {
   const inputClass = `${styles.input} ${hasError ? styles.inputError : ""} ${className || ""}`;

  return (
      <input 
        className={inputClass} 
        {...props} // Сюда автоматически прокинутся type, value, onChange, placeholder, disabled
      />
  );
}