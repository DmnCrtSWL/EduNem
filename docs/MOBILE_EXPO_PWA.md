# Guía de Instalación y Acceso Móvil (PWA & Expo Go)

Esta guía documenta los pasos para acceder, instalar y probar **EduApp** en teléfonos celulares y dispositivos móviles.

---

## 📱 Option A: Instalación PWA Directa (iPhone / Android)

EduApp está configurada como una **Progressive Web App (PWA)** instalable con experiencia nativa.

### En iPhone / iPad (Safari)
1. Abre Safari en tu teléfono e ingresa a la dirección de tu servidor VPS:
   `http://74.208.149.57:9191`
2. Presiona el botón de **Compartir** (icono con cuadrado y flecha hacia arriba en la barra inferior).
3. Selecciona **"Agregar a Inicio"** (*Add to Home Screen*).
4. Asigna el nombre **EduApp** y presiona **Agregar**.
5. La aplicación aparecerá en tu pantalla de inicio como una app nativa sin barras de navegador.

### En Android (Chrome)
1. Abre Google Chrome en tu celular e ingresa a `http://74.208.149.57:9191`.
2. Aparecerá automáticamente un aviso en la parte inferior notificando **"Instalar EduApp"**.
3. Si no aparece, presiona los 3 puntos superiores de menú de Chrome y selecciona **"Instalar aplicación"** o **"Agregar a la pantalla principal"**.

---

## 🚀 Option B: Conexión mediante Expo Go / React Native Wrapper

Para probar componentes o flujos nativos desde la app cliente de Expo:

1. Abre la aplicación **Expo Go** en tu dispositivo móvil.
2. Ingresa la URL de la aplicación o escanea el código QR proyectado desde el servidor de desarrollo local:
   ```bash
   npx expo start --tunnel
   ```
3. Asegúrate de que las variables de entorno de tu cliente móvil apunten a la API o Supabase expuesta en la IP pública del VPS:
   `http://74.208.149.57:9191`
