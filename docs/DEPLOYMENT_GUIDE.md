# 🚀 Guía Completa de Despliegue en Producción — AmigoGasto

Esta guía describe detalladamente las dos opciones recomendadas para desplegar la arquitectura completa de **AmigoGasto (SplitWise Collab)**:
1. **Opción A (Recomendada):** Despliegue en Servidor VPS (Linux / Docker Compose) con Nginx y SSL.
2. **Opción B (Cloud / PaaS Serverless):** Despliegue desacoplado (Vercel + Render + MySQL Administrado).

---

## 📋 Arquitectura de Despliegue

```mermaid
graph LR
    Client((Usuarios Web / Mobile)) -->|HTTPS :443| NGINX[Nginx Reverse Proxy & SSL]
    NGINX -->|Servir Assets SPA| FRONTEND[React + Vite App]
    NGINX -->|Proxy /api/*| BACKEND[NestJS API :3001]
    BACKEND -->|TypeORM Connection :3306| DB[(MySQL 8.0 Contenedor Aislado)]
```

---

## 🖥️ Opción A: Despliegue en Servidor VPS con Docker Compose (Recomendado)

Esta opción permite levantar todo el stack (Frontend compilado en Nginx, Backend NestJS y Base de Datos MySQL 8.0) en cualquier servidor Linux (**Ubuntu 22.04 / 24.04 LTS, Debian, AWS EC2, DigitalOcean, Hetzner, GCP**).

### Prerrequisitos en el Servidor VPS:
1. Servidor con al menos **2 GB de RAM** y **1 vCPU**.
2. **Docker** y **Docker Compose** instalados:
   ```bash
   # Instalar Docker en Ubuntu/Debian
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER
   ```
3. Un dominio o subdominio apuntando a la IP pública del servidor (ej. `amigogasto.tudominio.com`).

---

### Paso 1: Clonar el repositorio en el servidor
```bash
git clone <URL_DEL_REPOSITORIO> /var/www/amigogasto
cd /var/www/amigogasto
```

---

### Paso 2: Configurar las variables de entorno de producción
Copia el archivo de ejemplo y define credenciales seguras:
```bash
cp .env.example .env
nano .env
```

Contenido recomendado para `.env`:
```env
PORT=3001
NODE_ENV=production
API_PREFIX=api

# Credenciales Fuertes de Base de Datos
DB_HOST=db
DB_PORT=3306
DB_USERNAME=amigouser
DB_PASSWORD=Password_Super_Seguro_2026_!
DB_NAME=amigogasto_db
DB_ROOT_PASSWORD=Root_Super_Password_2026_!
DB_SYNCHRONIZE=true
DB_LOGGING=false

# URL de API
VITE_API_URL=/api
```

---

### Paso 3: Construir y Levantar los Contenedores
Ejecuta el comando de build y despliegue:
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Verifica el estado de los contenedores:
```bash
docker compose -f docker-compose.prod.yml ps
```

Salida esperada:
- `amigogasto_prod_db`: Running (healthy) en el puerto `3306` interno.
- `amigogasto_prod_backend`: Running en el puerto `3001` interno.
- `amigogasto_prod_frontend`: Running en el puerto `80`.

---

### Paso 4: Configurar Dominio y Certificado SSL Gratuito (Certbot / HTTPS)
Para habilitar HTTPS (`port 443`) con Let's Encrypt mediante Certbot:
```bash
sudo apt update && sudo apt install -y certbot python3-certbot-nginx
```

Crea un archivo de configuración Nginx host en `/etc/nginx/sites-available/amigogasto.conf`:
```nginx
server {
    server_name amigogasto.tudominio.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Habilita el sitio y genera el certificado SSL automático:
```bash
sudo ln -s /etc/nginx/sites-available/amigogasto.conf /etc/nginx/sites-enabled/
sudo certbot --nginx -d amigogasto.tudominio.com
```

¡Listo! Tu aplicación estará disponible en `https://amigogasto.tudominio.com`.

---

## ☁️ Opción B: Despliegue PaaS / Cloud Serverless

Si prefieres no administrar infraestructura de servidores, puedes utilizar plataformas cloud administradas:

### 1. Base de Datos MySQL:
- **Proveedores Recomendados:** [Railway.app](https://railway.app), [Aiven.io](https://aiven.io), [PlanetScale](https://planetscale.com) o **AWS RDS**.
- Crea una base de datos MySQL 8.0 y copia la URL de conexión (`mysql://user:pass@host:port/dbname`).

---

### 2. Backend NestJS en Render / Railway:
1. Crea una cuenta en [Render.com](https://render.com) o [Railway.app](https://railway.app).
2. Conecta tu repositorio de GitHub.
3. Configuración del Servicio:
   - **Environment:** `Node.js`
   - **Root Directory:** `./`
   - **Build Command:** `yarn install && yarn workspace @amigogasto/backend build`
   - **Start Command:** `node apps/backend/dist/main`
4. Variables de Entorno en el Dashboard:
   - `PORT`: `3001`
   - `NODE_ENV`: `production`
   - `DB_HOST`: `<host_de_tu_mysql>`
   - `DB_PORT`: `3306`
   - `DB_USERNAME`: `<usuario>`
   - `DB_PASSWORD`: `<password>`
   - `DB_NAME`: `<nombre_bd>`
   - `DB_SYNCHRONIZE`: `true`

---

### 3. Frontend React + Vite en Vercel / Netlify:
1. Crea una cuenta en [Vercel.com](https://vercel.com).
2. Importa el repositorio de GitHub.
3. Configuración del Proyecto:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `apps/frontend`
   - **Build Command:** `yarn build`
   - **Output Directory:** `dist`
   - **Install Command:** `yarn install`
4. Variable de Entorno:
   - `VITE_API_URL`: `https://tu-backend-en-render.onrender.com/api`
5. Presiona **Deploy**.

---

## 🔒 Checklist de Seguridad para Producción

- [x] **CORS Restringido:** En producción, configurar el origen de CORS en `apps/backend/src/main.ts` con el dominio específico del frontend.
- [x] **Passwords Fuertes:** Generar contraseñas aleatorias de al menos 24 caracteres para `DB_PASSWORD` y `DB_ROOT_PASSWORD`.
- [x] **Backups de Base de Datos:** Configurar un cron job diario para volcar la base de datos:
  ```bash
  docker exec amigogasto_prod_db mysqldump -u root -p<ROOT_PASSWORD> amigogasto_db > /backups/backup_$(date +\%F).sql
  ```
- [x] **Monitoreo de Logs:** Consultar logs en vivo mediante `docker compose -f docker-compose.prod.yml logs -f backend`.
