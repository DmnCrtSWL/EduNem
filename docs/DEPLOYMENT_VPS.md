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
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_supabase
POSTGRES_USER=postgres
POSTGRES_PASSWORD=tu_password_seguro
POSTGRES_DB=edunam_db
PORT=3000
```

### 4. Ejecutar el Script de Despliegue Automatizado
Da permisos y ejecuta el script:
```bash
chmod +x scripts/deploy-vps.sh
./scripts/deploy-vps.sh
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
