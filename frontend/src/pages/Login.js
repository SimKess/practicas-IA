import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  CenteredContainer,
  Card,
  Title,
  Subtitle,
  FormGroup,
  Label,
  Input,
  Button,
  ErrorText,
} from '../styles/commonStyles';

/**
 * Página de login
 */
const Login = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [errors, setErrors] = useState({});
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  /**
   * Valida el formulario
   */
  const validateForm = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = 'El usuario es requerido';
    }

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const success = await login(username, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <CenteredContainer>
      <Card>
        <Title>🔐 Iniciar Sesión</Title>
        <Subtitle>Accede con tus credenciales</Subtitle>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="username">Usuario</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingresa tu usuario"
              disabled={loading}
              aria-invalid={!!errors.username}
            />
            {errors.username && <ErrorText>{errors.username}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              disabled={loading}
              aria-invalid={!!errors.password}
            />
            {errors.password && <ErrorText>{errors.password}</ErrorText>}
          </FormGroup>

          {error && (
            <div style={{ marginBottom: '16px' }}>
              <ErrorText style={{ margin: 0 }}>⚠️ {error}</ErrorText>
            </div>
          )}

          <Button type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>

        <Subtitle style={{ marginTop: '24px', fontSize: '0.875rem' }}>
          📝 Credenciales de prueba:<br />
          Usuario: <strong>admin</strong><br />
          Contraseña: <strong>admin123</strong>
        </Subtitle>
      </Card>
    </CenteredContainer>
  );
};

export default Login;
