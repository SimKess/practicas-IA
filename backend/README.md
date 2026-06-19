# JWT FastAPI Application

Una aplicación Web API construida con **FastAPI** que implementa autenticación basada en **JWT** (JSON Web Tokens).

## Características

- ✅ Autenticación con usuario y contraseña
- ✅ Generación de tokens JWT con expiración configurable (300 segundos por defecto)
- ✅ Tokens de refresco para obtener nuevos access tokens
- ✅ Hashing seguro de contraseñas con `passlib` y `bcrypt`
- ✅ Validación y verificación de tokens JWT
- ✅ Documentación interactiva con Swagger UI
- ✅ Gestión de dependencias con Poetry
- ✅ Containerización con Docker

## Requisitos Previos

- Python 3.9 o superior
- Poetry
- Docker y Docker Compose (opcional, para despliegue en contenedores)

## Instalación

### 1. Clonar o descargar el proyecto

```bash
cd backend
```

### 2. Instalar dependencias con Poetry

```bash
poetry install
```

Esto creará un entorno virtual e instalará todas las dependencias definidas en `pyproject.toml`:
- `fastapi`: Framework web moderno
- `uvicorn`: Servidor ASGI
- `pyjwt`: Manejo de tokens JWT
- `passlib[bcrypt]`: Hashing de contraseñas
- `bcrypt >=3.2,<4.0`: Algoritmo de criptografía
- `pydantic`: Validación de datos
- `python-dotenv`: Variables de entorno

## Ejecución

### Opción 1: Ejecución Local

```bash
# Activar el entorno de Poetry
poetry shell

# Ejecutar la aplicación
python -m uvicorn app.main:app --reload
```

La API estará disponible en: `http://localhost:8000`

### Opción 2: Con Docker Compose

```bash
# Construir y ejecutar con Docker Compose
docker-compose up -d

# Ver logs
docker-compose logs -f api

# Detener los contenedores
docker-compose down
```

## Documentación de la API

Una vez que la aplicación esté corriendo, accede a:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Endpoints Principales

### 1. Login (Obtener Tokens)

**POST** `/login`

Autentica al usuario y retorna tokens de acceso y refresco.

**Credenciales de prueba:**
- Username: `admin`
- Password: `admin123`

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 300
}
```

### 2. Refrescar Token

**POST** `/refresh`

Genera un nuevo token de acceso usando un refresh token válido.

**Request:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 300
}
```

### 3. Health Check

**GET** `/`

Verifica que la API está funcionando correctamente.

**Response (200 OK):**
```json
{
  "message": "Bienvenido a JWT FastAPI API",
  "version": "0.1.0"
}
```

## Pruebas con cURL

### Login
```bash
curl -X POST "http://localhost:8000/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

### Refrescar Token
```bash
curl -X POST "http://localhost:8000/refresh" \
  -H "Content-Type: application/json" \
  -d '{"refresh_token": "tu_refresh_token_aqui"}'
```

## Estructura del Proyecto

```
backend/
├── app/
│   ├── __init__.py           # Inicializador de la aplicación
│   ├── main.py               # Punto de entrada principal
│   ├── auth.py               # Lógica de autenticación y JWT
│   └── models.py             # Modelos de Pydantic
├── pyproject.toml            # Configuración de Poetry
├── Dockerfile                # Configuración para Docker
├── docker-compose.yml        # Configuración de Docker Compose
└── README.md                 # Este archivo
```

## Configuración

### pyproject.toml

- **package-mode = false**: Indica que este es un proyecto de aplicación, no un paquete distribuible.
- **bcrypt >=3.2,<4.0**: Versión fija de bcrypt para compatibilidad con passlib 1.7.x
- **PYTHON 3.9+**: Versión mínima de Python requerida

### Variables de Entorno

Para usar variables de entorno, crear un archivo `.env`:

```
SECRET_KEY=tu-clave-secreta-muy-segura
ACCESS_TOKEN_EXPIRE_SECONDS=300
```

## Seguridad

⚠️ **IMPORTANTE**: 

1. **Cambiar la clave secreta**: En producción, cambiar `SECRET_KEY` en `app/auth.py` por una clave segura.
2. **Gestionar credenciales**: Los usuarios están hardcodeados. En producción, usar una base de datos.
3. **HTTPS**: Usar siempre HTTPS en producción.
4. **Tokens de larga vida**: Mantener `ACCESS_TOKEN_EXPIRE_SECONDS` bajo (300s = 5 minutos).

## Dependencias Principales

- **fastapi**: Framework web moderno
- **uvicorn**: Servidor ASGI de alto rendimiento
- **pyjwt**: Generación y verificación de tokens JWT
- **passlib[bcrypt]**: Hashing seguro de contraseñas
- **pydantic**: Validación y serialización de datos

## Notas Técnicas

### JWT Tokens

- **Access Token**: Expira en 300 segundos (5 minutos)
- **Refresh Token**: Expira en 7 días
- **Algoritmo**: HS256

### Hashing de Contraseñas

- **Esquema**: bcrypt
- **Versión bcrypt**: >=3.2,<4.0 (compatible con passlib 1.7.x)
- **Rounds**: Configuración automática por passlib

## Solución de Problemas

### Error: "ModuleNotFoundError: No module named 'app'"

Asegurar de ejecutar desde el directorio `backend`:
```bash
cd backend
poetry install
poetry shell
python -m uvicorn app.main:app --reload
```

### Error: "bcrypt version incompatible"

Verificar que bcrypt está en la versión correcta:
```bash
poetry show bcrypt
```

Debe ser >= 3.2 y < 4.0

### Error de Puerto 8000 en uso

Cambiar el puerto en la ejecución:
```bash
python -m uvicorn app.main:app --port 8001 --reload
```

## Desarrollo

Para agregar nuevas dependencias:

```bash
poetry add nombre-paquete
```

Para actualizar dependencias:

```bash
poetry update
```

## Licencia

Este proyecto es de código abierto y está disponible bajo licencia MIT.

## Autor

Admin - 2024
