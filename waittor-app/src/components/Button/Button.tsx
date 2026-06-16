import React from "react";
import "./Button.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
  children: React.ReactNode; // Обязательный проп
  // pro: () => void;
}

export function Button({ children, className = '', ...props }: ButtonProps): React.JSX.Element {
  return (
    <button
    // className={`btn btn-${variant} ${className}`}
    className={`button ${className}`}
     {...props}>
      {children}
    </button>
  );
}
