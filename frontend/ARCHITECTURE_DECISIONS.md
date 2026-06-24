# 🏗️ Decisiones de Arquitectura

Documento que detalla las decisiones arquitectónicas y patrones implementados en esta aplicación React de autenticación JWT.

## 📋 Tabla de Decisiones

| Decisión | Solución Elegida | Alternativas | Razón |
|----------|------------------|--------------|-------|
| Estado Global | Context API + hooks | Redux, Zustand, Atom | Simplicidad + overhead bajo |
| Almacenamiento de Tokens | localStorage | sessionStorage, Cookies | Persistencia + acceso simple |
| Gestión de Tokens | Timer + Interceptor | Solo interceptor | Feedback visual en tiempo real |
| HTTP Client | Axios | Fetch, HttpClient | Interceptores + cancelación |
| Estilos | Styled Components | CSS Modules, Tailwind | CSS-in-JS dinámico |
| Routing | React Router v6 | Wouter, Next.js | Estándar de facto |
| Componentes UI | Material UI + Styled | Bootstrap, Chakra | Personalizable + profesional |

---

## 1️⃣ Context API para Estado Global

### Decisión
Usar **React Context API** con el hook `useContext` para manejar el estado global de autenticación.

### Implementación
```javascript
// AuthContext.js
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const value = {
    user,
    isAuthenticated,
    login: async (username, password) => { ... },
    logout: () => { ... }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

### Ventajas
✅ Sin dependencias externas  
✅ Fácil de entender y mantener  
✅ Rendimiento adecuado  
✅ Integración natural con React hooks  

### Desventajas
❌ Re-renders si no se optimiza  
❌ Menos herramientas de debugging  
❌ Difícil de escalar muy grandes apps  

---

## 2️⃣ localStorage para Persistencia

### Decisión
Guardar tokens JWT en **localStorage** del navegador.

### Datos Almacenados
```
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "token_expiry": "1700000000000",
  "username": "admin"
}
```

### Ventajas
✅ Simple de implementar  
✅ Persiste entre recargas  
✅ Accesible desde JavaScript  
✅ No requiere configuración del servidor  

### Desventajas
❌ Vulnerable a XSS  
❌ No es HttpOnly  
❌ Visible en DevTools  

### Nota de Seguridad
> ⚠️ En producción considerar: Cookies HttpOnly + Secure + SameSite

---

## 3️⃣ Timer + Interceptor para Gestión de Tokens

### Decisión
Dos mecanismos para garantizar refresco de token:

1. **Countdown Timer**: Refresca 30s antes
2. **HTTP Interceptor**: Fallback automático

### Ventajas
✅ Refresco proactivo sin interrupciones  
✅ Fallback automático  
✅ Usuario ve estado en tiempo real  
✅ Manejo robusto de edge cases  

---

## 4️⃣ Axios como HTTP Client

### Decisión
Usar **Axios** en lugar del Fetch API.

### Por Qué Axios
- ✅ Interceptadores built-in (crucial para JWT)
- ✅ Cancelación automática
- ✅ Timeout global
- ✅ Transformación automática

### Trade-offs
- ❌ Dependencia externa (+13KB gzip)
- ✅ Pero worth it por los interceptadores

---

## 5️⃣ Styled Components para Estilos

### Decisión
Usar **Styled Components** (CSS-in-JS).

### Ventajas
✅ Props dinámicos  
✅ Sin conflictos CSS  
✅ Dead code elimination  
✅ Temas facilmente intercambiables  

### Por Qué (sobre alternativas)
- Mejor que CSS Modules para lógica condicional
- Mejor que Tailwind para estilos personalizados
- Mejor que CSS puro por evitar repetición

---

## 🔄 Flujos Principales

### Flujo de Login
```
Usuario ingresa credenciales
  ↓
Validación en cliente
  ↓
POST /login
  ↓
Backend valida y retorna tokens
  ↓
Almacenar en localStorage
  ├─ access_token
  ├─ refresh_token
  ├─ token_expiry
  └─ username
  ↓
Actualizar Context
  ├─ user = "admin"
  ├─ isAuthenticated = true
  └─ tokenTimeRemaining = 300
  ↓
Iniciar timer
  ↓
Redirigir a /dashboard
```

### Flujo de Refresco de Token
```
Timer cada 1 segundo:
  - tokenTimeRemaining--
  - Si <= 30 segundos:
    - POST /refresh
    - Actualizar tokens
    - Reiniciar timer

Fallback (Interceptor):
  - Si API retorna 401
    - POST /refresh
    - Reintentar request original
    - Si falla → logout
```

---

## 📊 Diagrama de Componentes

```
App (Router)
├── AuthProvider
│   ├── Login
│   │   ├── Title, Subtitle
│   │   ├── FormGroup (Input, Label, ErrorText)
│   │   └── Button
│   │
│   └── PrivateRoute
│       └── Dashboard
│           ├── Header + Logout button
│           ├── WelcomeMessage
│           ├── InfoGrid (InfoCards)
│           └── CountdownTimer (dinámico)
```

---

## 🔐 Consideraciones de Seguridad

| Componente | Riesgo | Mitigación |
|-----------|--------|-----------|
| localStorage | XSS | Sanitizar entrada, CSP headers |
| HTTP | MITM | HTTPS + HSTS |
| Formulario | CSRF | Token CSRF en backend |
| Token | Fuerza bruta | Rate limiting backend |
| Expiración | Token viejo | Auto-refresh antes expiración |

---

**Conclusión**: Esta arquitectura **prioriza** simplicidad, seguridad razonable y UX fluida.

**Última actualización**: 2024
```

**Alternativa:**
- Guards (middleware) al estilo Angular
- Menos idiomatic en React moderno

## 6. Estilos: Material-UI + Styled Components

### Decisión: Hybrid Approach
**Razones:**
- Material-UI: Componentes listos para usar, temas, responsive
- Styled Components: Estilos dinámicos, lógica de estilos en JS

**Ventajas:**
- Lo mejor de ambos mundos
- Componentes MUI base, personalizados con Styled Components
- Temas consistentes con Material Design

**Ejemplo:**
```javascript
const StyledContainer = styled(Container)`
  display: flex;
  justify-content: center;
  min-height: 100vh;
`;
```

## 7. Validación de Formularios: Manual vs Librerías

### Decisión: Validación Manual
**Razones:**
- Solo dos campos en login
- Simples de validar
- No requiere dependencias externas

**Para Aplicaciones Más Complejas:**
Se recomendaría usar:
- Formik + Yup
- React Hook Form
- Zod para validación

## 8. Componentes: Funcionales vs Clases

### Decisión: Componentes Funcionales
**Razones:**
- Estándar moderno de React
- Hooks más simples y poderosos
- Mejor performance
- Comunidad prefiere este enfoque

## 9. Manejo de Errores: Try-Catch vs .catch()

### Decisión: Try-Catch con Async/Await
**Razones:**
- Código más legible
- Más fácil de entender el flujo
- Mejor para múltiples operaciones asincrónicas

**Implementación:**
```javascript
try {
  const response = await authService.login(username, password);
  // Manejar éxito
} catch (error) {
  // Manejar error
}
```

## 10. Docker: Multi-stage Build

### Decisión: Build en múltiples etapas
**Razones:**
- Etapa 1: Build - Crea la aplicación
- Etapa 2: Runtime - Solo ejecuta
- Reduce el tamaño de la imagen final
- Mejor para producción

**Resultado:**
- Imagen ~250MB (con multi-stage)
- vs ~1.5GB (sin multi-stage)

## 11. Environment Variables

### Decisión: .env + .env.example
**Razones:**
- Configuración externalizada
- No commitear secretos
- Fácil de cambiar entre ambientes

**Configuración Actual:**
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_TOKEN_REFRESH_INTERVAL=280000
```

## 12. TypeScript vs JavaScript

### Decisión: JavaScript
**Razones:**
- Proyecto educativo
- Menos complejidad
- CRA soporta ambos sin cambios

**Para Producción:**
Se recomendaría migrar a TypeScript para:
- Mejor type checking
- Mejor IDE support
- Prevenir bugs

## 13. Testing: Jest vs Otros

### Decisión: Jest (default de CRA)
**Razones:**
- Incluido en CRA
- No requiere configuración
- Suficiente para testing unitario

**Estructura Propuesta:**
```
src/
├── __tests__/
│   ├── AuthContext.test.js
│   ├── api.test.js
│   └── components.test.js
```

## 14. Responsividad: Mobile-First vs Desktop-First

### Decisión: Mobile-First
**Razones:**
- Mayor adopción de móviles
- CSS más limpio
- Material Design es mobile-first

**Breakpoints MUI:**
- xs: 0px (mobile)
- sm: 600px (tablet)
- md: 960px (desktop)
- lg: 1280px (large desktop)

## 15. Logging: Console vs Logger Library

### Decisión: Console (simple)
**Razones:**
- Proyecto pequeño
- DevTools suficientes

**Para Producción:**
Se recomendaría:
- Sentry para error tracking
- LogRocket para session replay
- CloudFlare Analytics para performance

---

## Tabla de Trade-offs

| Decisión | Ventajas | Desventajas |
|----------|----------|-------------|
| Context API | Simple, sin deps | No escalable |
| localStorage | Persistente | Vulnerable a XSS |
| Refresh programado | Mejor UX | Consume recursos |
| Styled Components | Dinámico | Tamaño bundle |
| Validación manual | Ligero | No escalable |

## Próximas Mejoras

1. **TypeScript**: Migrar para type safety
2. **Testing**: Tests unitarios y E2E
3. **Performance**: Code splitting, lazy loading
4. **Seguridad**: HttpOnly cookies, CSP headers
5. **Analytics**: Integración con herramientas de tracking

---

**Versión**: 1.0.0  
**Última actualización**: 2024
