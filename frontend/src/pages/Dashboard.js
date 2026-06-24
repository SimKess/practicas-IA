import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Header,
  HeaderTitle,
  WelcomeMessage,
  WelcomeTitle,
  WelcomeSubtitle,
  CountdownTimer,
  TokenInfo,
  TokenLabel,
  Button,
  InfoGrid,
  InfoCard,
  InfoCardLabel,
  InfoCardValue,
} from '../styles/commonStyles';

/**
 * Página del Dashboard (protegida)
 */
const Dashboard = () => {
  const { user, tokenTimeRemaining, logout } = useAuth();
  const navigate = useNavigate();
  const microsoftCertifications2026 = [
    {
      title: 'Azure AI Apps and Agents Developer Associate',
      detail: 'Reemplaza Azure AI Engineer Associate en especializaciones de IA (junio 2026).',
      source: 'Anuncios Microsoft Partner Center, junio 2026',
    },
    {
      title: 'Machine Learning Operations Engineer Associate',
      detail: 'Nueva opción de skilling para AI Platform en Azure tras retiro de Azure Data Scientist Associate.',
      source: 'Anuncios Microsoft Partner Center, junio 2026',
    },
    {
      title: 'Cloud and AI Security Engineer Associate',
      detail: 'Reemplaza Azure Security Engineer Associate para cambios previstos en julio 2026.',
      source: 'Anuncios Microsoft Partner Center, junio 2026',
    },
    {
      title: 'Agentic AI Business Solutions Architect',
      detail: 'Nueva certificación para escenarios de Dynamics 365 y Power Platform en 2026.',
      source: 'Anuncios Microsoft Partner Center, junio 2026',
    },
  ];

  /**
   * Formatea el tiempo restante a MM:SS
   */
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Maneja el logout
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  /**
   * Obtiene el token del localStorage para mostrar en la UI
   */
  const getTokenForDisplay = () => {
    const token = localStorage.getItem('access_token');
    if (!token) return 'No hay token';
    return token.substring(0, 50) + '...';
  };

  /**
   * Determina el color del mensaje de expiración
   */
  const getExpirationMessage = () => {
    if (tokenTimeRemaining > 60) {
      return `✅ Token válido - Expira en ${formatTime(tokenTimeRemaining)}`;
    } else if (tokenTimeRemaining > 20) {
      return `⏰ Token próximo a expirar - ${formatTime(tokenTimeRemaining)}`;
    } else if (tokenTimeRemaining > 0) {
      return `❌ Token a punto de expirar - ${formatTime(tokenTimeRemaining)}`;
    } else {
      return '⏱️ Sesión expirada';
    }
  };

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Header>
        <HeaderTitle>🏠 Dashboard</HeaderTitle>
        <Button
          onClick={handleLogout}
          style={{
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '1px solid white',
          }}
        >
          Cerrar Sesión
        </Button>
      </Header>

      {/* Contenido */}
      <Container style={{ paddingTop: '40px', maxWidth: '900px' }}>
        {/* Mensaje de bienvenida */}
        <WelcomeMessage>
          <WelcomeTitle>¡Bienvenido, {user}! 👋</WelcomeTitle>
          <WelcomeSubtitle>
            Has iniciado sesión correctamente. Tu sesión está protegida por autenticación JWT.
          </WelcomeSubtitle>
        </WelcomeMessage>

        <div
          style={{
            background: 'white',
            padding: '24px',
            borderRadius: '8px',
            marginBottom: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <h2 style={{ marginTop: 0, color: '#1976d2' }}>🎓 Certificaciones Microsoft 2026</h2>
          <InfoGrid>
            {microsoftCertifications2026.map((certification) => (
              <InfoCard key={certification.title}>
                <InfoCardLabel>{certification.title}</InfoCardLabel>
                <p style={{ margin: '0 0 8px 0', color: '#555', fontSize: '0.95rem' }}>{certification.detail}</p>
                <InfoCardValue style={{ fontSize: '0.8rem' }}>{certification.source}</InfoCardValue>
              </InfoCard>
            ))}
          </InfoGrid>
        </div>

        {/* Grid de información */}
        <InfoGrid>
          <InfoCard>
            <InfoCardLabel>Usuario Autenticado</InfoCardLabel>
            <InfoCardValue>{user}</InfoCardValue>
          </InfoCard>

          <InfoCard>
            <InfoCardLabel>Tiempo Restante del Token</InfoCardLabel>
            <InfoCardValue>{formatTime(tokenTimeRemaining)}</InfoCardValue>
          </InfoCard>
        </InfoGrid>

        {/* Contador de expiración */}
        <CountdownTimer timeRemaining={tokenTimeRemaining}>
          {getExpirationMessage()}
        </CountdownTimer>

        {/* Información del token */}
        <TokenInfo>
          <TokenLabel>Token de Acceso:</TokenLabel>
          <div style={{ marginTop: '8px', fontFamily: 'monospace', fontSize: '0.75rem' }}>
            {getTokenForDisplay()}
          </div>
        </TokenInfo>

        {/* Información adicional */}
        <div
          style={{
            background: 'white',
            padding: '24px',
            borderRadius: '8px',
            marginTop: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <h2 style={{ marginTop: 0, color: '#1976d2' }}>ℹ️ Información de Sesión</h2>

          <div style={{ marginBottom: '16px' }}>
            <strong>Características implementadas:</strong>
            <ul>
              <li>✅ Autenticación con JWT</li>
              <li>✅ Tokens de acceso (300 segundos)</li>
              <li>✅ Tokens de refresco automático</li>
              <li>✅ Contador de expiración en tiempo real</li>
              <li>✅ Interceptor de solicitudes HTTP</li>
              <li>✅ Manejo de errores de autenticación</li>
              <li>✅ Logout seguro con limpieza de datos</li>
            </ul>
          </div>

          <div>
            <strong>El token se refrescará automáticamente:</strong>
            <ul>
              <li>📱 Cuando expira el token de acceso</li>
              <li>🔄 A través del interceptor de respuestas HTTP</li>
              <li>⏰ Mantén esta ventana abierta para que funcione</li>
            </ul>
          </div>
        </div>

        {/* Botón de logout adicional */}
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Button
            onClick={handleLogout}
            style={{
              background: '#f44336',
              padding: '12px 32px',
            }}
          >
            🚪 Cerrar Sesión
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default Dashboard;
