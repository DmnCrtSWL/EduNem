#!/usr/bin/env bash
# ==============================================================================
# Script de Despliegue Automatizado para EduApp en Servidor VPS
# ==============================================================================

set -e # Terminar inmediatamente si un comando falla

echo "🚀 Iniciando despliegue de EduApp en VPS..."

# 1. Obtener los últimos cambios de la rama principal
echo "📦 Actualizando repositorio Git desde origin/main..."
git fetch origin main
git checkout main
git pull origin main

# 2. Verificar que exista el archivo .env
if [ ! -f .env ]; then
  echo "⚠️ Advertencia: No se encontró el archivo .env. Copiando desde .env.example..."
  cp .env.example .env
  echo "❗ Por favor revisa y actualiza las credenciales en .env antes de continuar."
fi

# 3. Construir y reiniciar contenedores Docker
echo "🐳 Reconstruyendo y levantando contenedores Docker en producción..."
docker compose up --build -d

# 4. Verificar salud de los contenedores
echo "🔍 Estado actual de los contenedores:"
docker compose ps

echo "✅ Despliegue completado con éxito. EduApp está ejecutándose en el VPS."
