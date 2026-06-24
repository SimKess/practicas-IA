#!/bin/bash

# Script de configuración para el frontend

echo "================================"
echo "Setup Frontend - React App"
echo "================================"
echo ""

# Verificar que Node.js está instalado
if ! command -v node &> /dev/null
then
    echo "❌ Node.js no está instalado"
    exit 1
fi

echo "✅ Node.js versión: $(node --version)"
echo "✅ npm versión: $(npm --version)"
echo ""

# Copiar archivo de configuración
if [ ! -f .env ]; then
    echo "📝 Creando archivo .env desde .env.example..."
    cp .env.example .env
    echo "✅ Archivo .env creado"
else
    echo "ℹ️  Archivo .env ya existe"
fi
echo ""

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "================================"
    echo "✅ Setup completado exitosamente"
    echo "================================"
    echo ""
    echo "Próximos pasos:"
    echo "  1. Asegurar que el backend está corriendo en http://localhost:8000"
    echo "  2. Ejecutar: npm start"
    echo "  3. Abrir: http://localhost:3000"
    echo ""
else
    echo ""
    echo "❌ Error durante la instalación de dependencias"
    exit 1
fi
