# --- Этап 1: Сборка и установка зависимостей ---
FROM node:20-alpine AS builder
WORKDIR /app

# Копируем файлы конфигурации зависимостей
COPY package*.json ./

# Устанавливаем ВСЕ зависимости (включая devDependencies, нужные для сборки)
RUN npm ci

# Копируем исходный код
COPY . .

# Собираем проект для продакшена (минификация, оптимизация)
RUN npm run build

# --- Этап 2: Финальный легковесный образ для продакшена ---
FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
# Копируем ваш кастомный конфиг Nginx внутрь образа
COPY nginx.conf /etc/nginx/conf.d/default.conf 
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]