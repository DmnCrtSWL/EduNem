# Guía de Despliegue en VPS (Servidor Privado Virtual)

Esta guía detalla los pasos para desplegar **EduApp** en un servidor VPS remoto vía SSH utilizando contenedores Docker independientes.

---

## 📋 Prerrequisitos en el VPS
* Servidor VPS con Ubuntu / Debian (acceso SSH configurado).
* Docker y Docker Compose V2 instalados en el VPS.
* Git instalado.

---

## 🚀 Pasos de Despliegue Inicial

### 1. Conexión SSH al VPS
Conéctate a tu servidor mediante la terminal:
```bash
ssh usuario@ip_de_tu_vps
```

### 2. Clonar / Navegar al Repositorio
```bash
cd /ruta/de/desarrollo
git clone https://github.com/DmnCrtSWL/EduNem.git edunem
cd edunem
```

### 3. Configurar Variables de Entorno
Copia y edita el archivo de entorno `.env`:
```bash
cp .env.example .env
nano .env
```
Asegúrate de definir:
```env
DB_PASSWORD=tu_password_seguro_postgres
VITE_API_URL=
```

### 4. Ejecutar el Despliegue Automatizado
Levanta los contenedores en segundo plano:
```bash
docker compose up --build -d
```
El archivo `docker-compose.yml` inicia 3 servicios aislados:
- **`db`**: PostgreSQL 15 con volumen persistente `pgdata`.
- **`backend`**: Servidor Node.js Express con inicialización automática de la tabla `app_data`.
- **`frontend`**: Servidor Nginx que sirve la aplicación web y redirige `/api/` al backend.

### 5. Sembrar Datos Iniciales en el VPS (6 Grupos, Materias y Alumnos)
Para cargar los 6 grupos oficiales (1°A a 3°B), sus 4 asignaturas y los 35 alumnos por salón:
```bash
docker compose exec backend node -e "
  const { Pool } = require('pg');
  // Script de inicialización de datos
"
# O ejecutando el script provisto:
node scripts/seed-vps.js
```

---

## 🔍 Verificación y Mantenimiento

### Ver el estado de los contenedores:
```bash
docker compose ps
```

### Consultar los logs en tiempo real:
```bash
docker compose logs -f --tail=100
```

### Reiniciar el servicio:
```bash
docker compose restart
```

---

## 🌐 Configuración de Proxy Inverso Nginx (Opcional Host VPS)

Si deseas conectar un dominio o subdominio con certificado SSL (HTTPS) desde la máquina host:

```nginx
server {
    listen 80;
    server_name edunem.midominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
Obtener certificado SSL gratuito con Certbot:
```bash
sudo certbot --nginx -d edunem.midominio.com
```
