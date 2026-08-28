# Multi-stage Dockerfile para Frontend React + Vite con Nginx
FROM node:20-alpine AS builder

WORKDIR /app

# Argumento para URL del backend en tiempo de compilación
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

# Copiar manifiestos de Yarn
COPY package.json yarn.lock ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/frontend/package.json ./apps/frontend/

# Instalar dependencias
RUN yarn install --frozen-lockfile

# Copiar código fuente
COPY apps/frontend ./apps/frontend

# Compilar frontend
RUN yarn workspace @amigogasto/frontend build

# -------------------------------------------------------------
# Imagen Nginx de Producción
FROM nginx:alpine AS runner

# Copiar configuración Nginx
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copiar artefactos compilados al directorio de Nginx
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
