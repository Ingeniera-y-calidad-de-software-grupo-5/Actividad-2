# Multi-stage Dockerfile para Backend NestJS en Producción
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar Yarn y copiar manifiestos
COPY package.json yarn.lock ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/frontend/package.json ./apps/frontend/

# Instalar dependencias completas
RUN yarn install --frozen-lockfile

# Copiar código fuente
COPY apps/backend ./apps/backend
COPY tsconfig.json ./

# Compilar backend
RUN yarn workspace @amigogasto/backend build

# -------------------------------------------------------------
# Imagen de Producción Ligera
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY package.json yarn.lock ./
COPY apps/backend/package.json ./apps/backend/

# Instalar sólo dependencias de producción
RUN yarn install --production --frozen-lockfile && yarn cache clean

# Copiar artefactos compilados
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist

EXPOSE 3001

CMD ["node", "apps/backend/dist/main"]
