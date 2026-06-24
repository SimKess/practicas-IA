# 👨‍💻 Guía para Desarrolladores

Documento de referencia para desarrolladores que trabajan en el frontend.

## 📖 Introducción

Este proyecto utiliza:
- **React 18** con Hooks
- **React Router v6** para enrutamiento
- **Context API** para estado global
- **Material UI + Styled Components** para estilos
- **Axios** para HTTP

## 🛠️ Setup Inicial

### Primer Día
```bash
# 1. Navega a la carpeta
cd frontend

# 2. Instala dependencias
npm install

# 3. Configura variables de entorno
cp .env.example .env

# 4. Inicia servidor de desarrollo
npm start

# 5. Abre http://localhost:3000
```

## 📚 Componentes Principales

### 1. AuthContext.js
**Responsabilidad**: Gestionar estado de autenticación

```javascript
const { 
  user,                    // Usuario autenticado
  isAuthenticated,         // ¿Está logueado?
  loading,                 // Cargando sesión
  tokenTimeRemaining,      // Segundos hasta expiración
  error,                   // Mensaje de error
  login,                   // Función de login
  logout,                  // Función de logout
  refreshToken             // Refresca token
} = useAuth();
```

### 2. api.js (Axios Client)
**Responsabilidad**: Manejar peticiones HTTP y tokens

```javascript
import apiClient from '../services/api';

// Interceptores automáticos:
// - Añaden token a requests
// - Refrescan token en 401
// - Limpian sesión en fallos

const response = await apiClient.get('/endpoint');
```

### 3. PrivateRoute.js
**Responsabilidad**: Proteger rutas

```javascript
<PrivateRoute>
  <Dashboard />
</PrivateRoute>
```

## 🎨 Estilos (Styled Components)

### Archivo commonStyles.js
```javascript
import {
  Container,
  CenteredContainer,
  Card,
  Button,
  Input,
  // ... más componentes
} from '../styles/commonStyles';
```

### Uso
```javascript
export default function Login() {
  return (
    <CenteredContainer>
      <Card>
        <Title>Login</Title>
        <Button>Enviar</Button>
      </Card>
    </CenteredContainer>
  );
}
```

## 🔄 Flujos de Datos

### Flujo de Login
```
Login → handleSubmit()
  ↓
useAuth().login(username, password)
  ↓
api.js: POST /login
  ↓
Guardar tokens en localStorage
  ↓
Context: isAuthenticated = true
  ↓
Redirigir a /dashboard
  ↓
PrivateRoute verifica ✓
  ↓
Dashboard se renderiza
```

### Flujo de Token Expiry
```
Timer (cada 1 segundo):
  ├─ getTokenTimeRemaining()
  ├─ ¿<= 30 segundos?
  │   └─ SÍ → POST /refresh
  │   └─ NO → continúa
  └─ Repite
```

## 📋 Patrones Comunes

### 1. Usar contexto de autenticación
```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  return isAuthenticated ? (
    <div>Hola {user} <button onClick={logout}>Logout</button></div>
  ) : (
    <div>No autenticado</div>
  );
}
```

### 2. Hacer petición HTTP
```javascript
import { useEffect, useState } from 'react';
import apiClient from '../services/api';

function MyComponent() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get('/endpoint');
        setData(response.data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>Cargando...</div>;
  return <div>{JSON.stringify(data)}</div>;
}
```

### 3. Crear styled component
```javascript
import styled from 'styled-components';

export const MyCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  
  @media (max-width: 600px) {
    padding: 16px;
  }
`;
```

### 4. Proteger una ruta
```javascript
// En App.js
<Route 
  path="/admin"
  element={
    <PrivateRoute>
      <AdminPanel />
    </PrivateRoute>
  }
/>
```

## 🧪 Testing (Recomendaciones)

### Estructura
```
src/__tests__/
├── context/
│   └── AuthContext.test.js
├── pages/
│   ├── Login.test.js
│   └── Dashboard.test.js
└── services/
    └── api.test.js
```

### Ejecutar
```bash
npm test              # Modo watch
npm test -- --coverage  # Con cobertura
```

## 🐛 Debugging

### React DevTools
1. Instala "React Developer Tools"
2. F12 → "Components" tab
3. Inspecciona props y state

### Network Requests
1. DevTools → "Network" tab
2. Filtra por "XHR"
3. Ver POST /login, POST /refresh

### Console Logs
```javascript
// En cualquier componente
console.log('Auth:', { user, isAuthenticated });
console.error('Error:', error);
```

## 📝 Comandos Útiles

```bash
npm start              # Dev server
npm run build          # Build producción
npm test               # Tests
npm run eject          # Expone configuración (irreversible!)
make help              # Ver todos los Make commands
make docker-build      # Construir imagen Docker
make docker-run        # Ejecutar en Docker
```

## 📦 Dependencias Principales

```json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.18.0",
  "@mui/material": "^5.14.0",
  "styled-components": "^6.1.0",
  "axios": "^1.6.0"
}
```

## 🔐 Consideraciones de Seguridad

> ⚠️ En producción:
> - ✅ Usar HTTPS
> - ✅ Implementar CSRF protection
> - ✅ Considerar HttpOnly Cookies
> - ✅ Configurar CSP headers

## 🚀 Despliegue

### Build de Producción
```bash
npm run build
```

### Servir localmente
```bash
npm install -g serve
serve -s build -l 3000
```

### Docker
```bash
make docker-build
make docker-run
```

### Docker Compose
```bash
docker-compose -f frontend/docker-compose.yml up
```

## 📋 Checklist de Pull Request

- [ ] Código sigue la estructura existente
- [ ] Sin hardcoding de strings
- [ ] Error handling implementado
- [ ] Loading states mostrados
- [ ] Sin warnings en console
- [ ] Variables de entorno documentadas

## 🆘 Solución Rápida de Problemas

| Problema | Solución |
|----------|----------|
| `useAuth()` fuera de `AuthProvider` | Envuelve con `<AuthProvider>` |
| Token no persiste | Verifica `localStorage.setItem()` en api.js |
| Loop infinito de renders | Revisa dependencias en `useEffect` |
| API 401 no refresca | Verifica interceptor de response en api.js |

---

¡Feliz coding! 🚀

## 🐛 Problemas Comunes

### Puerto 3000 en Uso
```bash
# Linux/Mac: Encontrar y matar el proceso
lsof -i :3000
kill -9 <PID>

# Windows: Usar otro puerto
PORT=3001 npm start
```

### CORS Errors
Asegurar que el backend tiene CORS configurado:
```python
# Backend (FastAPI)
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Token No Se Refresca
1. Verificar `REACT_APP_TOKEN_REFRESH_INTERVAL` en `.env`
2. Revisar console para errores
3. Confirmar que el endpoint `/auth/token/refresh` existe en el backend

## 🚀 Tips de Performance

1. **Code Splitting**
   ```javascript
   import { lazy, Suspense } from 'react';
   const Dashboard = lazy(() => import('./pages/DashboardPage'));
   ```

2. **Memoización**
   ```javascript
   import { memo, useMemo } from 'react';
   const Component = memo(() => { /* ... */ });
   ```

3. **Lazy Loading de Rutas**
   Ya implementado en `App.js` con React Router

## 📚 Referencias

- [React Documentation](https://react.dev)
- [React Router](https://reactrouter.com)
- [Material-UI](https://mui.com)
- [Styled Components](https://styled-components.com)
- [Axios](https://axios-http.com)

---

**Última actualización**: 2024
