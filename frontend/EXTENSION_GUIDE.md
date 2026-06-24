# Guía de Extensión de la Aplicación

Este documento muestra cómo agregar nuevas funcionalidades y componentes a la aplicación.

## 📝 Agregar una Nueva Página Protegida

### Paso 1: Crear el Componente de la Página

Crear `src/pages/ProfilePage.js`:

```javascript
import React from 'react';
import { Container, Paper, Box, Typography, Button } from '@mui/material';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const StyledContainer = styled(Container)`
  min-height: 100vh;
  padding: 40px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const StyledPaper = styled(Paper)`
  padding: 40px;
  border-radius: 10px;
`;

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <StyledContainer maxWidth="md">
      <StyledPaper elevation={3}>
        <Typography variant="h4" gutterBottom>
          Mi Perfil
        </Typography>
        <Typography variant="body1">
          Usuario: {user?.username}
        </Typography>
        <Box mt={3}>
          <Button 
            variant="contained" 
            onClick={() => navigate('/dashboard')}
          >
            Volver al Dashboard
          </Button>
        </Box>
      </StyledPaper>
    </StyledContainer>
  );
};

export default ProfilePage;
```

### Paso 2: Agregar la Ruta en `src/App.js`

```javascript
import ProfilePage from './pages/ProfilePage';

// Dentro de <Routes>
<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  }
/>
```

### Paso 3: Agregar el Enlace de Navegación

En `src/pages/DashboardPage.js`, agregar:

```javascript
import { Link as MuiLink } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

// En el JSX
<Button 
  variant="text" 
  onClick={() => navigate('/profile')}
>
  Mi Perfil
</Button>
```

---

## 🔌 Agregar un Nuevo Endpoint de API

### Paso 1: Extender `src/services/api.js`

```javascript
// Agregar nuevos métodos al authService
export const authService = {
  login: (username, password) => /* ... */,
  
  refreshToken: (refreshToken) => /* ... */,
  
  getProtected: () => api.get('/protected'),
  
  // ✨ Nuevo endpoint
  getUserProfile: () => api.get('/user/profile'),
  
  updateProfile: (data) => api.put('/user/profile', data),
};
```

### Paso 2: Usar en el Componente

```javascript
import { authService } from '../services/api';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authService.getUserProfile();
        setProfile(response.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    // JSX aquí
  );
};
```

---

## 🎨 Crear un Componente Reutilizable

### Paso 1: Crear el Componente

Crear `src/components/UserCard.js`:

```javascript
import React from 'react';
import { Card, CardContent, Typography, Avatar, Box } from '@mui/material';
import styled from 'styled-components';

const StyledCard = styled(Card)`
  && {
    text-align: center;
    transition: transform 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
    }
  }
`;

const UserCard = ({ username, email, avatar }) => {
  return (
    <StyledCard>
      <CardContent>
        <Avatar
          src={avatar}
          sx={{
            width: 80,
            height: 80,
            margin: '0 auto 20px',
          }}
        />
        <Typography variant="h6" gutterBottom>
          {username}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {email}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

export default UserCard;
```

### Paso 2: Usar en otras Páginas

```javascript
import UserCard from '../components/UserCard';

<UserCard 
  username="admin" 
  email="admin@example.com" 
  avatar="/path/to/avatar.jpg"
/>
```

---

## 📊 Agregar Persistencia de Datos

### Usando localStorage

```javascript
// Guardar
const saveUserPreferences = (preferences) => {
  localStorage.setItem(
    'user_preferences',
    JSON.stringify(preferences)
  );
};

// Recuperar
const getUserPreferences = () => {
  const stored = localStorage.getItem('user_preferences');
  return stored ? JSON.parse(stored) : null;
};
```

### En un Custom Hook

Crear `src/hooks/useLocalStorage.js`:

```javascript
import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};
```

Uso:
```javascript
const [theme, setTheme] = useLocalStorage('theme', 'light');
```

---

## 🔔 Agregar Notificaciones

### Opción 1: Toast Notifications (Simple)

Crear `src/components/Toast.js`:

```javascript
import React, { useState } from 'react';
import { Alert, Snackbar } from '@mui/material';

export const useToast = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');

  const showToast = (msg, sev = 'info') => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  const Toast = () => (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={() => setOpen(false)}
    >
      <Alert severity={severity}>{message}</Alert>
    </Snackbar>
  );

  return { showToast, Toast };
};
```

Uso:
```javascript
const { showToast, Toast } = useToast();

const handleLogin = async () => {
  try {
    await login(username, password);
    showToast('Login exitoso', 'success');
  } catch (error) {
    showToast('Error en login', 'error');
  }
};

return (
  <>
    {/* componentes */}
    <Toast />
  </>
);
```

---

## 🔄 Agregar Estados de Carga

### Loading State Pattern

```javascript
import { CircularProgress, Box } from '@mui/material';

const [loading, setLoading] = useState(false);

const fetchData = async () => {
  try {
    setLoading(true);
    const response = await api.get('/data');
    setData(response.data);
  } finally {
    setLoading(false);
  }
};

if (loading) {
  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <CircularProgress />
    </Box>
  );
}
```

---

## 🛡️ Agregar Validación Mejorada

### Con Formik + Yup

Instalar:
```bash
npm install formik yup
```

Ejemplo:
```javascript
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField } from '@mui/material';

const validationSchema = Yup.object({
  username: Yup
    .string('Username is required')
    .min(3, 'Mínimo 3 caracteres')
    .required('Requerido'),
  email: Yup
    .string('Email is required')
    .email('Email inválido')
    .required('Requerido'),
});

const formik = useFormik({
  initialValues: {
    username: '',
    email: '',
  },
  validationSchema: validationSchema,
  onSubmit: async (values) => {
    // Enviar
  },
});

return (
  <TextField
    name="username"
    value={formik.values.username}
    onChange={formik.handleChange}
    error={formik.touched.username && !!formik.errors.username}
    helperText={formik.touched.username && formik.errors.username}
  />
);
```

---

## 🧪 Escribir Tests

### Test de un Hook Personalizado

Crear `src/hooks/useLocalStorage.test.js`:

```javascript
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('debería guardar y recuperar un valor', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'initial'));
    
    expect(result.current[0]).toBe('initial');
    
    act(() => {
      result.current[1]('new value');
    });
    
    expect(result.current[0]).toBe('new value');
  });
});
```

### Test de un Componente

```javascript
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './pages/LoginPage';

describe('LoginPage', () => {
  it('debería renderizar el formulario', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Iniciar Sesión/i)).toBeInTheDocument();
  });
});
```

---

## 📱 Agregar Responsive Design Mejorado

### Usando Grid de MUI

```javascript
import { Grid, Box } from '@mui/material';

<Grid container spacing={2}>
  <Grid item xs={12} sm={6} md={4}>
    {/* Componente 1 */}
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
    {/* Componente 2 */}
  </Grid>
</Grid>
```

### Breakpoints Personalizados

```javascript
import { useMediaQuery, useTheme } from '@mui/material';

const Page = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      {isMobile ? (
        <MobileVersion />
      ) : (
        <DesktopVersion />
      )}
    </>
  );
};
```

---

## 🚀 Desplegar Cambios

### Localmente
```bash
npm start  # Hot reload automático
```

### Build de Producción
```bash
npm run build
```

### Con Docker
```bash
docker build -t auth-jwt-frontend .
docker run -p 3000:3000 auth-jwt-frontend
```

---

## 📚 Referencias Útiles

- [React Docs](https://react.dev)
- [Material-UI Components](https://mui.com/components)
- [Styled Components](https://styled-components.com)
- [React Router](https://reactrouter.com)
- [Axios Docs](https://axios-http.com)

---

## ✅ Checklist para Nuevas Características

- [ ] Crear componente/página
- [ ] Agregar ruta en `App.js`
- [ ] Agregar endpoint en `services/api.js` si es necesario
- [ ] Usar AuthContext si requiere autenticación
- [ ] Aplicar estilos con Material-UI + Styled Components
- [ ] Manejar estados de carga
- [ ] Agregar validación de entrada
- [ ] Escribir tests
- [ ] Probar en desarrollo (`npm start`)
- [ ] Build de producción (`npm run build`)

---

**¡Feliz desarrollo! 🚀**
