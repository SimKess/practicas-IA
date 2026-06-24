// Estilos globales reutilizables

import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

export const CenteredContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

export const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 32px;
  max-width: 500px;
  width: 100%;
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  font-size: 0.95rem;
`;

export const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    outline: none;
    border-color: #1976d2;
    box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

export const Button = styled.button`
  padding: 12px 24px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.1s ease;

  &:hover:not(:disabled) {
    background-color: #1565c0;
    transform: translateY(-2px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const ErrorText = styled.p`
  color: #f44336;
  font-size: 0.875rem;
  margin-top: 4px;
  margin-bottom: 0;
`;

export const SuccessText = styled.p`
  color: #4caf50;
  font-size: 0.875rem;
  margin-top: 4px;
  margin-bottom: 0;
`;

export const Title = styled.h1`
  color: #333;
  text-align: center;
  margin-bottom: 32px;
  font-size: 2rem;
  font-weight: 700;
`;

export const Subtitle = styled.p`
  color: #666;
  text-align: center;
  margin-bottom: 24px;
  font-size: 1rem;
`;

export const Header = styled.header`
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  color: white;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 1.5rem;
`;

export const TokenInfo = styled.div`
  background: #f5f5f5;
  border-left: 4px solid #1976d2;
  padding: 16px;
  border-radius: 4px;
  margin: 24px 0;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  word-break: break-all;
`;

export const TokenLabel = styled.span`
  font-weight: 600;
  color: #333;
`;

export const CountdownTimer = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => {
    if (props.timeRemaining > 60) return '#4caf50';
    if (props.timeRemaining > 20) return '#ff9800';
    return '#f44336';
  }};
  text-align: center;
  margin: 16px 0;
`;

export const WelcomeMessage = styled.div`
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  margin-bottom: 24px;
`;

export const WelcomeTitle = styled.h2`
  color: #1976d2;
  margin: 0 0 8px 0;
  font-size: 1.5rem;
`;

export const WelcomeSubtitle = styled.p`
  color: #666;
  margin: 0;
  font-size: 1rem;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin: 24px 0;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoCard = styled.div`
  background: #fafafa;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #eee;
`;

export const InfoCardLabel = styled.p`
  margin: 0 0 4px 0;
  font-size: 0.875rem;
  color: #999;
  font-weight: 600;
  text-transform: uppercase;
`;

export const InfoCardValue = styled.p`
  margin: 0;
  font-size: 1.125rem;
  color: #333;
  font-weight: 600;
`;
