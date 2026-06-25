import React from "react";
import styles from "./Input.module.css"; // Если используете CSS-модули

// Расширяем стандартные атрибуты тега input, чтобы работали value, onChange, placeholder и т.д.
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
}

export function Input({ className, ...props }: InputProps): React.JSX.Element {
  return (
      <input 
        className={`${styles.input} ${className || ""}`} 
        {...props} // Сюда автоматически прокинутся type, value, onChange, placeholder, disabled
      />
  );
}