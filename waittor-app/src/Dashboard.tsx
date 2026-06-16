import React from "react";
import { Header } from "./components/Header/Header";
import "./Dashboard.css";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { List } from "./components/List/List";

export function Dashboard(): React.JSX.Element {
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
