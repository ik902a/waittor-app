import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { MainPage } from "./ui/MainPage";
import { Login } from "./ui/Login/Login";
import { Registry } from "./ui/Registry/Registry";

// Обертка для защищенных маршрутов
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();
  console.log("isAuthenticated-" + isAuthenticated);
  // Если не авторизован — принудительно перенаправляем на /login
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Публичный маршрут */}
          <Route path="/login" element={<Login />} />
          <Route path="/registry" element={<Registry />} />

          {/* Защищенные маршруты */}
          <Route
            path="/movies"
            element={
              <ProtectedRoute>
                <MainPage />
              </ProtectedRoute>
            }
          />

          {/* Редирект по умолчанию */}
          <Route path="*" element={<Navigate to="/movies" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
