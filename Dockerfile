# ====== FASE 1: CONSTRUCCION ======
FROM node:22-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build -- --configuration production

# ====== FASE 2: EJECUCION ======
FROM nginx:alpine

RUN apk add --no-cache gettext

COPY --from=builder /app/dist/hackaton-fe/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template

EXPOSE 80

CMD ["/bin/sh", "-c", "envsubst '${BACKEND_URL}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]

# =====================================================================
# COMANDOS PARA SUBIR IMAGEN ACTUALIZADA AL DOCKER HUB
# Ejecutar desde la carpeta hackaton-fe/ en PowerShell:
#
# 1. Buildear:
#    docker build -t gregoriormenosanchez/hackaton-frontend:latest .
#
# 2. Pushear:
#    docker push gregoriormenosanchez/hackaton-frontend:latest
#
# 3. En EC2 actualizar:
#    docker pull gregoriormenosanchez/hackaton-frontend:latest
#    docker compose -f docker-compose-fe.yml up -d
# =====================================================================
