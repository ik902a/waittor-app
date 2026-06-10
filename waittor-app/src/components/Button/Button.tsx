import React from "react";
import "./Button.css";

interface ButtonProps {
  children: React.ReactNode; // Обязательный проп
  click: () => void;
}

function Button({ children, click }: ButtonProps): React.JSX.Element {
  return (
    <button className="button" onClick={click}>
      {children}
    </button>
  );
}

export default Button;
