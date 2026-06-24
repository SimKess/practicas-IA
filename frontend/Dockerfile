# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Copiar archivo .env desde .env.example si existe
RUN if [ -f .env.example ]; then cp .env.example .env; fi

# Construir la aplicación
RUN npm run build

# Stage 2: Producción
FROM node:18-alpine

WORKDIR /app

# Instalar serve para servir la aplicación estática
RUN npm install -g serve

# Copiar build desde la etapa anterior
COPY --from=builder /app/build ./build

# Copiar archivo .env.example para referencia
COPY .env.example ./

# Exponer puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Comando para ejecutar la aplicación
CMD ["serve", "-s", "build", "-l", "3000"]

# Copiar .env.example para referencia
COPY .env.example .env.example

# Exponer puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Comando para iniciar la aplicación
CMD ["serve", "-s", "build", "-l", "3000"]
