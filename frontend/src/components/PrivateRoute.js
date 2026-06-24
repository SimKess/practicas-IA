import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Componente que protege rutas requiriendo autenticación
 */
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Mientras se verifica la autenticación, muestra un loader
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          fontSize: '1.125rem',
          color: '#666',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '16px', fontSize: '3rem' }}>⏳</div>
          Cargando sesión...
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirige a login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, muestra el componente
  return children;
};

export default PrivateRoute;
