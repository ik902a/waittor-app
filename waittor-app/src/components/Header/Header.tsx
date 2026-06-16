import React from "react";
import { useEffect, useState } from "react";
import logo from "/favicon.svg";
import { useNavigate } from "react-router-dom";
import { Button } from "../Button/Button";
import "./Header.css";

export function Header(): React.JSX.Element {
  const [now, setNow] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <header>
      <div className="logo-group">
        <img src={logo} alt="" />
        <br />
        <span>{now.toLocaleTimeString()}</span>
      </div>

      <div className="button-group">
        <Button onClick={() => navigate("/login")}>Вход</Button>
        <Button onClick={() => navigate("/register")}>Регистрация</Button>
      </div>
    </header>
  );
}
