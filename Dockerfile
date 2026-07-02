# ====== FASE 1: CONSTRUCCION ======
# Usa Node 22 Alpine (liviano) para compilar Angular
FROM node:22-alpine AS builder

WORKDIR /app

# Copia primero solo package.json para aprovechar el cache de Docker:
# si no cambian las dependencias, no re-instala en cada build
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Copia el resto del codigo y compila en modo produccion
COPY . .
RUN npm run build -- --configuration production

# ====== FASE 2: EJECUCION ======
# Imagen minima de nginx para servir los archivos estaticos
FROM nginx:alpine

# gettext provee envsubst, que reemplaza variables en nginx.conf
RUN apk add --no-cache gettext

# Copia los archivos compilados por Angular al directorio de nginx
# "browser" es la subcarpeta que genera Angular 19 en dist/
COPY --from=builder /app/dist/hackaton-fe/browser /usr/share/nginx/html

# Copia la plantilla de nginx (contiene ${BACKEND_URL} como variable)
COPY nginx.conf /etc/nginx/templates/default.conf.template

EXPOSE 80

# Al iniciar: reemplaza ${BACKEND_URL} en la plantilla y arranca nginx
CMD ["/bin/sh", "-c", "envsubst '${BACKEND_URL}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
