# 🚀 Quick Start - Inicio Rápido

Guía para empezar a desarrollar en 5 minutos.

## ⚡ Inicio Rápido (Local)

### 1. Requisitos
```bash
# Verifica que tengas Node.js instalado
node --version  # v16 o superior
npm --version   # v7 o superior
```

### 2. Instalación
```bash
# Navega a la carpeta del frontend
cd frontend

# Instala dependencias (toma ~2 minutos)
npm install

# O usa el comando Make
make install
```

### 3. Inicia el servidor
```bash
# Modo desarrollo con hot-reload
npm start

# O con Make
make start
```

**La app se abre automáticamente en** `http://localhost:3000` 🎉

### 4. Login
- **Usuario**: `admin`
- **Contraseña**: `admin123`

¡Listo! Ya estás en el Dashboard.

---

## 🐳 Inicio Rápido (Docker)

### Con Docker Compose (Todo en Uno)
```bash
# Desde la raíz del proyecto
docker-compose -f frontend/docker-compose.yml up

# Frontend:  http://localhost:3000
# Backend:   http://localhost:8000
```

### Solo Frontend (Docker Manual)
```bash
cd frontend
make docker-build
make docker-run

# Disponible en http://localhost:3000
```

---

## 📁 Estructura Importante

```
src/
├── pages/          # Pantallas principales
│   ├── Login.js    # 🔐 Login
│   └── Dashboard.js # 📊 Dashboard protegido
├── context/
│   └── AuthContext.js  # 🔑 Estado de autenticación
├── services/
│   └── api.js      # 🌐 Cliente HTTP
└── components/
    └── PrivateRoute.js # 🛡️ Protección de rutas
```

---

## 🔑 Conceptos Clave

### 1. Auth Context
```javascript
const { user, isAuthenticated, tokenTimeRemaining, login, logout } = useAuth();
```

### 2. Rutas Protegidas
```javascript
<PrivateRoute>
  <Dashboard />
</PrivateRoute>
```

### 3. API Client
```javascript
import apiClient from '../services/api';
apiClient.get('/protected-endpoint');  // Token adjuntado automáticamente
```

---

## 📝 Tareas Comunes

### Añadir Nueva Página
```javascript
// 1. Crear src/pages/NewPage.js
import { useAuth } from '../context/AuthContext';

export default function NewPage() {
  const { user } = useAuth();
  return <div>Hola, {user}</div>;
}

// 2. Registrar ruta en App.js
<Route 
  path="/new-page"
  element={
    <PrivateRoute>
      <NewPage />
    </PrivateRoute>
  }
/>

// 3. Navegar
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
navigate('/new-page');
```

### Llamar al API
```javascript
import apiClient from '../services/api';

const fetchData = async () => {
  try {
    const response = await apiClient.get('/some-endpoint');
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

### Usar Estado de Autenticación
```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { isAuthenticated, user, logout } = useAuth();

  if (!isAuthenticated) return <p>No autenticado</p>;

  return (
    <>
      <p>Hola, {user}</p>
      <button onClick={logout}>Logout</button>
    </>
  );
}
```

---

## ⚙️ Configuración

### Variables de Entorno (.env)
```bash
# Backend
REACT_APP_API_BASE_URL=http://localhost:8000

# Timeout
REACT_APP_API_TIMEOUT=10000

# Refresco de token
REACT_APP_TOKEN_REFRESH_THRESHOLD=30
```

---

## 🐛 Debug

### DevTools del Navegador
```javascript
// En la consola:
localStorage.getItem('access_token')    // Ver token
localStorage.getItem('token_expiry')    // Ver expiración
```

### Logs de Red
1. Abre DevTools (F12)
2. Pestaña "Network"
3. Filtra por "login" o "refresh"
4. Ver peticiones y respuestas

---

## ✅ Checklist de Desarrollo

- [ ] Instalé dependencias con `npm install`
- [ ] Backend está corriendo en `http://localhost:8000`
- [ ] Frontend está corriendo en `http://localhost:3000`
- [ ] Puedo iniciar sesión con admin/admin123
- [ ] Veo el dashboard después del login
- [ ] El token cuenta hacia atrás
- [ ] El logout me lleva a login

---

## 🆘 Problemas Comunes

### "Address already in use :3000"
```bash
# Windows (PowerShell Admin):
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### "Cannot connect to backend"
```bash
# Verifica que el backend está corriendo
curl http://localhost:8000/
```

### "localhost:3000 refuses to connect"
```bash
rm -rf node_modules package-lock.json
npm install
npm start
```

---

¡Listo para empezar! 🚀

## 📁 Estructura de Archivos

```
frontend/
├── src/
│   ├── components/          # Componentes reutilizables
│   ├── context/             # Estado global (Auth)
│   ├── pages/               # Páginas (Login, Dashboard)
│   ├── services/            # API client
│   ├── styles/              # Estilos globales
│   ├── config/              # Constantes
│   ├── App.js               # App principal
│   └── index.js             # Entry point
├── public/
│   └── index.html           # HTML base
├── Dockerfile               # Image Docker
├── docker-compose.yml       # Orquestación
├── package.json             # Dependencias
├── .env.example             # Variables de entorno
└── README.md                # Documentación completa
```

---

## 🛠️ Variables de Entorno

Crear archivo `.env` (automático con setup.sh/setup.bat):

```env
# URL del backend
REACT_APP_API_URL=http://localhost:8000

# Intervalo de refresco del token (ms)
# 280 segundos = 280000 ms
REACT_APP_TOKEN_REFRESH_INTERVAL=280000
```

---

## ✨ Características

✅ **Login Seguro**: Formulario validado con JWT  
✅ **Token Refresh Automático**: 20 segundos antes de expirar  
✅ **Dashboard Protegido**: Solo accesible con autenticación  
✅ **UI Moderna**: Material-UI + Styled Components  
✅ **Responsive**: Mobile y Desktop  
✅ **Docker Ready**: Producción lista  

---

## 🚨 Problemas Comunes

### "Cannot POST /auth/token"
```bash
# Asegurar que el backend está corriendo
cd ../backend
python main.py
```

### "Port 3000 already in use"
```bash
# Linux/Mac
lsof -i :3000
kill -9 <PID>

# Windows (otra terminal con PowerShell as Admin)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

### "REACT_APP_API_URL is not set"
```bash
# Crear .env desde .env.example
cp .env.example .env
```

---

## 📚 Documentación Completa

- [README.md](README.md) - Documentación completa
- [DEVELOPERS.md](DEVELOPERS.md) - Guía para desarrolladores
- [ARCHITECTURE_DECISIONS.md](ARCHITECTURE_DECISIONS.md) - Decisiones de arquitectura

---

## 🤝 Próximos Pasos

1. ✅ Clonar/descargar proyecto
2. ✅ Instalar dependencias (`npm install`)
3. ✅ Configurar backend
4. ✅ Iniciar (`npm start`)
5. ✅ Abrir http://localhost:3000
6. ✅ Login con admin/admin123

---

## 📞 Soporte

Si encuentras problemas:
1. Revisa la sección de problemas comunes arriba
2. Consulta [DEVELOPERS.md](DEVELOPERS.md)
3. Revisa la documentación completa [README.md](README.md)

---

**Happy coding! 🎉**
