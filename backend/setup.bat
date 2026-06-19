@echo off
REM Script para inicializar el desarrollo local en Windows

echo.
echo 🚀 Inicializando JWT FastAPI Application...
echo.

REM Crear archivo .env si no existe
if not exist .env (
    echo 📝 Creando archivo .env desde .env.example
    copy .env.example .env
)

REM Instalar dependencias con Poetry
echo 📦 Instalando dependencias...
poetry install

echo.
echo ✅ Inicialización completada!
echo.
echo Para empezar a desarrollar:
echo   1. Activar el entorno: poetry shell
echo   2. Ejecutar la app: python -m uvicorn app.main:app --reload
echo.
echo La API estará disponible en: http://localhost:8000
echo Documentación (Swagger): http://localhost:8000/docs
echo.
pause
