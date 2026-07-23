import React from 'react';
import styled, { keyframes } from 'styled-components';

export const TypingIndicator: React.FC = () => {
  return (
    <Container>
      <Bubble>
        <Dot />
        <Dot $delay="0.2s" />
        <Dot $delay="0.4s" />
      </Bubble>
    </Container>
  );
};

const bounce = keyframes`
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  margin: 4px 0;
  padding: 0 20px;
`;

const Bubble = styled.div`
  padding: 12px 16px;
  border-radius: 18px;
  border-top-left-radius: 4px;
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.03);
  display: flex;
  gap: 4px;
`;

const Dot = styled.div<{ $delay?: string }>`
  width: 6px;
  height: 6px;
  background: #64748b;
  border-radius: 50%;
  animation: ${bounce} 1.4s infinite ease-in-out both;
  animation-delay: ${props => props.$delay || '0s'};
`;
