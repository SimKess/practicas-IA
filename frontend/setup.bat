@echo off
REM Script de configuración para el frontend

echo ================================
echo Setup Frontend - React App
echo ================================
echo.

REM Verificar que Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo. ❌ Node.js no está instalado
    exit /b 1
)

echo ✅ Node.js version:
node --version
echo ✅ npm version:
npm --version
echo.

REM Copiar archivo de configuración
if not exist .env (
    echo 📝 Creando archivo .env desde .env.example...
    copy .env.example .env
    echo ✅ Archivo .env creado
) else (
    echo ℹ️  Archivo .env ya existe
)
echo.

REM Instalar dependencias
echo 📦 Instalando dependencias...
call npm install

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================
    echo ✅ Setup completado exitosamente
    echo ================================
    echo.
    echo Próximos pasos:
    echo   1. Asegurar que el backend está corriendo en http://localhost:8000
    echo   2. Ejecutar: npm start
    echo   3. Abrir: http://localhost:3000
    echo.
) else (
    echo.
    echo ❌ Error durante la instalación de dependencias
    exit /b 1
)
