# EduApp - Control Escolar Inteligente (Mobile-First)

## Propósito del Proyecto
EduApp es una plataforma SaaS diseñada específicamente para erradicar la fricción y burocracia que sufren los docentes al momento de pasar asistencia, registrar calificaciones y planear sus clases. 

El proyecto nace como respuesta directa a los sistemas educativos deficientes (web apps no optimizadas) que generan ansiedad en el usuario final. 

## Filosofía y Arquitectura
- **Mobile-First Real:** No es una web responsiva, es una **Progressive Web App (PWA)** que se instala en el dispositivo móvil (ej. iPhone) y brinda una experiencia 100% nativa.
- **Diseño Anti-Fricción:** Elementos grandes (Thumb-friendly), gestos de swipe, botones sin carga cognitiva extraña (nada de "sellar" o "enviar"). Estética moderna, limpia, *soft* (glassmorphism y micro-animaciones).
- **Control Total (No BaaS):** Tras experimentar las limitantes de plataformas cerradas, el proyecto está diseñado para correr en una infraestructura propia (VPS) utilizando contenedores Docker.
- **Regla de Oro:** **NO SE MENCIONA A LA SEP** para evitar asociaciones con sistemas burocráticos engorrosos.

## Tech Stack
- **Frontend:** React 19 + Vite (Configurado con `vite-plugin-pwa` para instalabilidad).
- **Backend:** Node.js + Express (API REST ligera).
- **Base de Datos:** PostgreSQL puro.
- **Infraestructura:** Docker Compose (Nginx + Node + Postgres) alojado en un VPS privado.
- **Estilos:** CSS Vanilla estructurado con variables globales. Cero TailwindCSS para mantener control pixel-perfect sobre el diseño.

## Planeación y Futuro
Actualmente, el proyecto soporta:
- Pase de lista ultra-rápido (asistencia, retardo, inasistencia).
- Evaluación rápida usando criterios dinámicos (con opción de examen configurable en peso).
- Generador de planeaciones de clase potenciado por inteligencia artificial.
- Portal unificado para padres de familia (vista protegida para ver progreso).
- Perfiles de alumnos integrados con notas inter-docentes.

El siguiente hito es estabilizar la arquitectura Dockerizada y lanzar una demo beta en vivo sin fricciones.
