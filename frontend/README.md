# 🔐 Frontend React con Autenticación JWT

Aplicación web moderna desarrollada con **React**, **Create React App (CRA)** y **JavaScript** que implementa un sistema completo de autenticación JWT integrado con una API backend FastAPI.

## 📋 Tabla de Contenidos

1. [Características](#características)
2. [Requisitos Previos](#requisitos-previos)
3. [Instalación y Configuración](#instalación-y-configuración)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Decisiones de Arquitectura](#decisiones-de-arquitectura)
6. [Guía de Uso](#guía-de-uso)
7. [Despliegue](#despliegue)
8. [Solución de Problemas](#solución-de-problemas)

---

## ✨ Características

### 🔐 Autenticación Segura

- **Login con Validación**: Formulario con validación de campos en el cliente
- **Credenciales de Prueba**: Usuario `admin` / Contraseña `admin123` (preconfiguradas)
- **Token JWT**: Almacenamiento seguro de tokens en `localStorage`
- **Refresh Token**: Sistema dual de tokens (acceso + refresco)
- **Token Expiration**: Monitoreo en tiempo real de expiración (300 segundos)

### 🔄 Gestión Automática de Tokens

- **Auto-Refresh**: El token se refresca automáticamente 30 segundos antes de expirar
- **Interceptor HTTP**: Intercepta respuestas 401 y refresca token automáticamente
- **Manejo de Errores**: Limpieza automática de sesión en caso de error
- **Event Listener**: Detecta cambios de estado de autenticación

### 🛡️ Rutas Protegidas

- **PrivateRoute**: Componente que protege rutas requiriendo autenticación
- **Redirección Automática**: Redirección a login si el token expira
- **Loading State**: Indicador de carga mientras se verifica la sesión

### 📊 Dashboard Protegido

- **Acceso Restringido**: Solo para usuarios autenticados
- **Información de Sesión**: Muestra usuario, token y tiempo restante
- **Contador en Vivo**: Actualización en tiempo real del temporizador
- **Código de Color**: Verde (válido) → Amarillo (próximo a expirar) → Rojo (expirado)
- **Token Display**: Muestra los primeros caracteres del token JWT

### 🎨 Diseño y UX

- **Material UI (MUI)**: Componentes profesionales y accesibles
- **Styled Components**: Estilos CSS-in-JS con soporte para temas
- **Responsivo**: Adaptable a todos los tamaños de pantalla
- **Animaciones**: Transiciones suaves en botones y elementos
- **Temas Personalizados**: Colores y tipografía ajustables

---

## 📦 Requisitos Previos

### Sistema

- **Node.js**: v16 o superior
- **npm**: v7 o superior (incluido con Node.js)
- **Docker**: (opcional, para despliegue en contenedores)
- **Docker Compose**: (opcional, para ejecutar todo el stack)

### Backend

La aplicación requiere que el backend FastAPI esté en ejecución:

- URL: `http://localhost:8000`
- Endpoints requeridos:
  - `POST /login` - Autenticación
  - `POST /refresh` - Refresco de token

---

## 🚀 Instalación y Configuración

### 1. Instalación Local

```bash
# Navegar a la carpeta del frontend
cd frontend

# Instalar dependencias
npm install

# Crear archivo .env (copiar del .env.example)
cp .env.example .env

# Iniciar la aplicación en modo desarrollo
npm start
```

La aplicación se abrirá automáticamente en `http://localhost:3000`

### 2. Configuración de Variables de Entorno

El archivo `.env` controla la conexión con el backend:

```bash
# Backend API Configuration
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_API_TIMEOUT=10000

# Token Configuration
REACT_APP_TOKEN_REFRESH_THRESHOLD=30
```

**Explicación de variables:**

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `REACT_APP_API_BASE_URL` | URL base de la API backend | `http://localhost:8000` |
| `REACT_APP_API_TIMEOUT` | Timeout en ms para peticiones HTTP | `10000` |
| `REACT_APP_TOKEN_REFRESH_THRESHOLD` | Segundos antes de expirar para refrescar | `30` |

### 3. Build para Producción

```bash
# Crear build optimizado
npm run build

# Servir el build localmente
npm start
```

---

## 📁 Estructura del Proyecto

```
frontend/
├── public/
│   ├── index.html                 # Archivo HTML principal
│   └── favicon.ico                # Ícono de la aplicación
│
├── src/
│   ├── components/
│   │   └── PrivateRoute.js        # HOC para proteger rutas
│   │
│   ├── context/
│   │   └── AuthContext.js         # Context API - Estado global de autenticación
│   │
│   ├── pages/
│   │   ├── Login.js               # Página de login
│   │   └── Dashboard.js           # Dashboard protegido
│   │
│   ├── services/
│   │   └── api.js                 # Cliente Axios con interceptores
│   │
│   ├── config/
│   │   └── constants.js           # Constantes de la aplicación
│   │
│   ├── styles/
│   │   └── commonStyles.js        # Componentes styled-components reutilizables
│   │
│   ├── App.js                     # Componente raíz con Router
│   ├── index.js                   # Punto de entrada
│   └── index.html                 # Template HTML
│
├── Dockerfile                     # Imagen Docker para producción
├── docker-compose.yml             # Orquestación con backend
├── package.json                   # Dependencias y scripts
├── .env.example                   # Variables de entorno (ejemplo)
├── .env                           # Variables de entorno (local)
├── .gitignore                     # Archivos ignorados por git
└── README.md                      # Este archivo
```

---

## 🏗️ Decisiones de Arquitectura

### 1. **Context API vs Redux**

**Decisión**: Usar **Context API** con `useContext` y `useReducer`

**Razón**: Para una aplicación de este tamaño, Context API es suficiente y no añade dependencias innecesarias. Redux sería excesivo.

**Implementación**:
```javascript
// AuthContext.js proporciona:
- user: Usuario actual
- isAuthenticated: Estado de autenticación
- tokenTimeRemaining: Tiempo restante del token
- login(): Función para iniciar sesión
- logout(): Función para cerrar sesión
- refreshToken(): Función para refrescar token manualmente
```

### 2. **Almacenamiento de Tokens**

**Decisión**: Usar **localStorage** para persistencia

**Rationale**: 
- ✅ Simple y directo para esta aplicación
- ✅ Permite persistencia entre recargas
- ❌ No es completamente seguro contra XSS
- 📝 En producción considerar: HttpOnly cookies + CSRF tokens

**Alternativas Consideradas**:
- sessionStorage (no persiste entre recargas)
- Cookies (HttpOnly es más seguro pero requiere backend)
- Memory (se pierde al recargar)

### 3. **Gestión de Expiración de Token**

**Decisión**: Timer en el frontend con evento de expiración

**Flujo**:
1. **Countdown**: `setInterval` actualiza cada segundo
2. **Umbral**: Si `timeRemaining <= 30s`, ejecuta `refreshToken()`
3. **Interceptor**: Si la API retorna 401, intenta refrescar
4. **Fallback**: Si falla, limpia sesión y redirige a login

**Ventajas**:
- ✅ Usuario ve en tiempo real cuando expira el token
- ✅ Refresco proactivo antes de expiración
- ✅ Manejo de errores graceful

### 4. **Interceptores HTTP**

**Decisión**: Usar Axios interceptors para manejo centralizado

**Implementación**:

```javascript
// Request Interceptor: Añade token a cada petición
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response Interceptor: Refresca token si expira
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Intenta refrescar y reintentar
      // Si falla, limpia sesión
    }
  }
);
```

**Ventajas**:
- ✅ Centralizado (no repetir lógica en cada componente)
- ✅ Transparente (los componentes no saben de tokens)
- ✅ Manejo consistente de errores

### 5. **Componentes Styled Components vs CSS Modules**

**Decisión**: **Styled Components** para estilos reutilizables

**Razón**:
- ✅ Soporte para props dinámicos
- ✅ Temas facilmente intercambiables
- ✅ Mejor rendimiento (solo CSS necesario)
- ✅ Integración natural con React

**Ejemplo**:
```javascript
export const CountdownTimer = styled.div`
  color: ${props => props.timeRemaining > 60 ? '#4caf50' : '#f44336'};
`;
```

### 6. **Rutas Protegidas**

**Decisión**: Componente HOC `<PrivateRoute>`

**Flujo**:
```
PrivateRoute
├── ¿Cargando? → Spinner
├── ¿Autenticado? → Mostrar componente
└── No autenticado → Redirigir a /login
```

**Ventajas**:
- ✅ Simple y reutilizable
- ✅ Protección contra acceso sin token
- ✅ UX fluida con indicador de carga

---

## 📖 Guía de Uso

### Flujo de Autenticación

#### 1️⃣ **Iniciar Sesión**

```
1. Usuario ingresa a http://localhost:3000
2. Se redirige automáticamente a /login
3. Ingresa credenciales (admin / admin123)
4. Click en "Iniciar Sesión"
5. Backend valida y retorna tokens
6. Aplicación almacena tokens en localStorage
7. Redirige a /dashboard
```

#### 2️⃣ **Acceso al Dashboard**

```
1. El PrivateRoute verifica autenticación
2. Si válido, muestra el Dashboard
3. Se muestra:
   - Nombre de usuario
   - Token JWT (primeros caracteres)
   - Contador en vivo (MM:SS)
4. El contador es verde/amarillo/rojo según tiempo restante
```

#### 3️⃣ **Refresco Automático de Token**

```
Escenario: El token expira en 300 segundos

t=0s   → Token válido (verde)
t=240s → Token válido (verde)
t=270s → Token próximo a expirar (amarillo)
        → Automáticamente se ejecuta /refresh
        → Recibe nuevo token
        → Reinicia contador (300s nuevamente)
t=330s → Usuario puede seguir usando la app sin interrupciones
```

#### 4️⃣ **Cerrar Sesión**

```
1. Click en botón "Cerrar Sesión"
2. Aplicación limpia localStorage
3. Redirige a /login
4. Sesión completamente terminada
```

### Casos de Uso Adicionales

**¿Qué pasa si el token expira naturalmente?**

```
Si el usuario deja la aplicación sin refrescar:
1. Token expira
2. Contador llega a 0:00
3. Aplicación detecta expiración
4. Se limpia la sesión
5. Usuario es redirigido a login
6. En próxima petición, backend retorna 401
7. Interceptor refrescar falla (no hay refresh token válido)
8. Sesión se limpia completamente
```

**¿Qué pasa si el backend no responde?**

```
Timeout de 10 segundos (REACT_APP_API_TIMEOUT)
- Si la API no responde en ese tiempo, se genera error
- Usuario ve mensaje de error
- Puede reintentar login
```

---

## 🐳 Despliegue

### Opción 1: Docker Compose (Recomendado)

```bash
# Desde la carpeta raíz del proyecto
docker-compose -f frontend/docker-compose.yml up -d

# La aplicación estará disponible en http://localhost:3000
# El backend estará en http://localhost:8000
```

**Proceso**:
1. Construye imagen del frontend
2. Construye imagen del backend
3. Inicia ambos servicios en una red personalizada
4. Frontend → Backend comunicación interna

### Opción 2: Docker Manual

```bash
# Construir imagen
cd frontend
docker build -t jwt-frontend:latest .

# Ejecutar contenedor
docker run -p 3000:3000 \
  -e REACT_APP_API_BASE_URL=http://localhost:8000 \
  jwt-frontend:latest
```

### Opción 3: Deployer en Vercel

```bash
# Requiere cuenta en Vercel y Git

# 1. Conectar repositorio a Vercel
# 2. Configurar variables de entorno
# 3. Deploy automático en cada push
```

---

## 🔍 Solución de Problemas

### Problema: "No se puede conectar al backend"

**Síntomas**: Error `Network Error` al intentar login

**Soluciones**:
```bash
# 1. Verificar que el backend está en ejecución
curl http://localhost:8000/

# 2. Verificar variable de entorno
cat .env | grep REACT_APP_API_BASE_URL

# 3. Si usa Docker, verificar red
docker network ls
docker inspect auth-network

# 4. Ver logs
docker logs auth-jwt-backend
docker logs auth-jwt-frontend
```

### Problema: Token no se refresca automáticamente

**Síntomas**: Token expira y se debe volver a login manualmente

**Soluciones**:
```bash
# 1. Verificar que la ventana está activa
#    El timer se pausa si la pestaña está inactiva en algunos navegadores

# 2. Ver logs en console (F12)
#    Buscar mensajes de refresh token

# 3. Verificar endpoint /refresh en backend
curl -X POST http://localhost:8000/refresh \
  -H "Content-Type: application/json" \
  -d '{"refresh_token": "YOUR_TOKEN"}'
```

### Problema: "Invalid or expired token"

**Síntomas**: Se muestra error en login

**Soluciones**:
```bash
# 1. Limpiar localStorage
# En browser console:
localStorage.clear()

# 2. Recargar la página
location.reload()

# 3. Verificar credenciales en backend
# En backend console, verificar usuarios registrados
```

### Problema: Puerto 3000 ya en uso

**Síntomas**: Error `EADDRINUSE: address already in use :::3000`

**Soluciones**:
```bash
# En Windows (PowerShell como Admin):
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# En macOS/Linux:
lsof -i :3000
kill -9 <PID>

# O cambiar puerto en package.json:
"start": "PORT=3001 react-scripts start"
```

### Problema: Cambios no se reflejan en el navegador

**Síntomas**: Edito un archivo pero el navegador no actualiza

**Soluciones**:
```bash
# 1. Hot reload debería funcionar automáticamente
# Si no:

# 2. Limpiar cache de npm
npm cache clean --force

# 3. Reinstalar módulos
rm -rf node_modules package-lock.json
npm install

# 4. Ctrl+Shift+R para limpiar cache del navegador
```

---

## 📚 Dependencias Principales

```json
{
  "react": "^18.2.0",              // Framework principal
  "react-dom": "^18.2.0",          // Renderizado DOM
  "react-router-dom": "^6.18.0",   // Enrutamiento
  "@mui/material": "^5.14.0",      // Componentes Material UI
  "styled-components": "^6.1.0",   // CSS-in-JS
  "axios": "^1.6.0"                // Cliente HTTP
}
```

---

## 🔐 Consideraciones de Seguridad

> ⚠️ **IMPORTANTE**: Esta aplicación es un ejemplo educativo. Para producción:

1. **Tokens en HttpOnly Cookies**: No guardes tokens en localStorage
2. **HTTPS**: Siempre usa HTTPS en producción
3. **CORS**: Configura CORS correctamente (no `allow_origins=["*"]`)
4. **Rate Limiting**: Implementa rate limiting en el backend
5. **CSRF Protection**: Implementa tokens CSRF
6. **Content Security Policy**: Configura CSP headers

---

## 📝 Scripts Disponibles

```bash
npm start          # Inicia en modo desarrollo (http://localhost:3000)
npm build          # Crea build optimizado para producción
npm test           # Ejecuta tests
npm eject          # Expone configuración de CRA (irreversible)
```

---

## 🤝 Contribuciones

Para reportar bugs o sugerir mejoras, por favor abre un issue o pull request.

---

## 📄 Licencia

Este proyecto está bajo licencia MIT.

---

**Última actualización**: 2024

### Componentes Principales

#### **AuthContext** (`src/context/AuthContext.js`)
- Gestiona el estado de autenticación global
- Métodos: `login()`, `logout()`, `refreshAccessToken()`
- Hook personalizado: `useAuth()` para acceder al contexto
- Programación automática del refresh del token
- Persistencia de datos en localStorage

#### **API Service** (`src/services/api.js`)
- Cliente Axios configurado con interceptores
- Interceptor de request: Agrega token a cada solicitud
- Interceptor de response: Maneja errores y refresh automático
- Métodos: `login()`, `refreshToken()`, `getProtected()`

#### **ProtectedRoute** (`src/components/ProtectedRoute.js`)
- Componente wrapper para rutas que requieren autenticación
- Redirige a login si el usuario no está autenticado

#### **LoginPage** (`src/pages/LoginPage.js`)
- Formulario de login con validación
- Campos precompletados (admin/admin123)
- Manejo de errores con feedback visual
- Redirección automática si ya está autenticado

#### **DashboardPage** (`src/pages/DashboardPage.js`)
- Vista protegida con información de sesión
- Contador de expiración en tiempo real
- Barra de progreso del ciclo de vida del token
- Botón de logout prominente

## 🚀 Instalación Local

### Requisitos
- Node.js 16+ 
- npm o yarn

### Pasos

1. **Clonar o ubicarse en el proyecto**
   ```bash
   cd frontend
   ```

2. **Copiar archivo de configuración**
   ```bash
   cp .env.example .env
   ```

3. **Instalar dependencias**
   ```bash
   npm install
   ```

4. **Asegurar que el backend esté ejecutándose**
   - El backend debe estar en http://localhost:8000
   - Verificar que los endpoints de autenticación estén disponibles

5. **Iniciar el servidor de desarrollo**
   ```bash
   npm start
   ```

   La aplicación se abrirá en http://localhost:3000

## 🐳 Despliegue con Docker

### Opción 1: Docker Compose (Frontend + Backend)

Desde la raíz del proyecto:

```bash
docker-compose up --build
```

Esto levantará:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000

### Opción 2: Solo Frontend con Docker

```bash
# Construir imagen
docker build -t auth-jwt-frontend .

# Ejecutar contenedor
docker run -p 3000:3000 \
  -e REACT_APP_API_URL=http://localhost:8000 \
  auth-jwt-frontend
```

### Opción 3: Frontend en Docker + Backend Local

```bash
# Asegurar que el backend esté corriendo localmente
cd ../backend
python main.py  # o tu comando específico

# Luego en otra terminal, construir y ejecutar frontend
docker build -t auth-jwt-frontend .

docker run -p 3000:3000 \
  -e REACT_APP_API_URL=http://host.docker.internal:8000 \
  auth-jwt-frontend
```

## 📝 Variables de Entorno

Archivo `.env` (creado desde `.env.example`):

```env
# URL base del backend API
REACT_APP_API_URL=http://localhost:8000

# Intervalo para verificar expiración del token (en milisegundos)
# 280 segundos = 4:40 (se refresca 20 segundos antes de los 300)
REACT_APP_TOKEN_REFRESH_INTERVAL=280000
```

## 🔐 Flujo de Autenticación

```
1. Usuario ingresa credenciales en LoginPage
2. Envía al endpoint POST /auth/token
3. Backend responde con:
   {
     "access_token": "...",
     "refresh_token": "...",
     "expires_in": 300,
     "user": {"username": "admin"}
   }
4. Cliente almacena tokens y programa refresh
5. Cada request incluye Authorization: Bearer {access_token}
6. A los 280 segundos, se ejecuta refresh automático
7. Si token expira sin refresh, se redirige a login

Ciclo del Token:
- Token válido: 300 segundos
- Refresh automático: -20 segundos (280s)
- Si falla refresh: Logout automático
```

## 🧪 Pruebas Manual

### Test 1: Login Exitoso
1. Navegar a http://localhost:3000/login
2. Ingresar: admin / admin123
3. Verificar redirección a /dashboard
4. Confirmar que se muestra el token y su tiempo restante

### Test 2: Token Refresh Automático
1. Acceder al dashboard
2. Observar el contador de tiempo
3. Esperar hasta ver que se reinicia (refresh automático)
4. Verificar en consola que no hay errores

### Test 3: Rutas Protegidas
1. Limpiar localStorage (DevTools)
2. Navegar a http://localhost:3000/dashboard
3. Verificar redirección a /login

### Test 4: Logout
1. En el dashboard, hacer click en "Cerrar Sesión"
2. Verificar redirección a /login
3. Confirmar que localStorage está limpio

## 📦 Dependencias Principales

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| react | 18.2.0 | Framework principal |
| react-dom | 18.2.0 | Renderizado DOM |
| react-router-dom | 6.14.0 | Enrutamiento |
| @mui/material | 5.14.0 | Componentes UI |
| @emotion/react | 11.11.0 | Motor de estilos MUI |
| styled-components | 6.0.0 | Estilos dinámicos |
| axios | 1.4.0 | Cliente HTTP |

## 🛠️ Scripts Disponibles

```bash
# Iniciar en modo desarrollo
npm start

# Construir para producción
npm run build

# Ejecutar tests
npm test

# Eyectar de CRA (irreversible)
npm eject
```

## 🎨 Personalización

### Cambiar URL del Backend
Modificar en `.env`:
```env
REACT_APP_API_URL=https://tu-api.com
```

### Cambiar Tiempo de Refresh
Modificar en `.env` (en milisegundos):
```env
REACT_APP_TOKEN_REFRESH_INTERVAL=240000  # 4 minutos
```

### Personalizar Tema
En `src/index.js`, modificar `createTheme()`:
```javascript
const theme = createTheme({
  palette: {
    primary: { main: '#tu-color' },
    secondary: { main: '#otro-color' }
  }
});
```

## 🐛 Solución de Problemas

### "Cannot POST /auth/token"
- Verificar que el backend está corriendo
- Verificar REACT_APP_API_URL en .env
- Revisar CORS en backend

### Token expira inmediatamente
- Verificar que expires_in en backend es 300
- Revisar que el reloj del servidor está sincronizado

### "ProtectedRoute debe ser usado dentro de AuthProvider"
- Asegurar que AuthProvider envuelve todo el app en App.js

### En Docker: Cannot reach backend
- Usar `http://backend:8000` en docker-compose
- Usar `http://host.docker.internal:8000` en Docker Desktop

## 📄 Licencia

Este proyecto es de uso educativo.

## 👤 Autor

Aplicación desarrollada para demostración de autenticación JWT con React y Material UI.

---

**Última actualización**: 2024
