import React from "react";
import { Header } from "./Header/Header";
import { Sidebar } from "./Sidebar/Sidebar";
import { List } from "../components/List/List";
import "./MainPage.css";

export function MainPage(): React.JSX.Element {
  return (
    <div className="layout-container">
      <Header />
      <div className="layout-body">
        <Sidebar />

        <main className="layout-content">
          <h2>Список фильмов</h2>
          <List />
        </main>
      </div>
    </div>
  );
}
