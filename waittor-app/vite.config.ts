import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
  // Загружаем переменные окружения (.env файлы)
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 3000,
      host: true, // ВАЖНО: разрешает внешние подключения к контейнеру
      watch: {
        usePolling: true, // ВАЖНО: обеспечивает Hot Reload внутри Docker
      },
      proxy: {
        // Локально перенаправляем запросы на WebFlux
        "/api": {
          target: env.VITE_API_BASE_URL || "http://localhost:9091",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ""), // удалит /api перед отправкой на бэк
        },
      },
    },
    build: {
      // Собираем в стандартную папку dist внутри фронтенда
      outDir: "dist",
      sourcemap: false,
      // Оптимизация чанков для быстрой загрузки
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return "vendor";
            }
          },
        },
      },
    },
  };
});
