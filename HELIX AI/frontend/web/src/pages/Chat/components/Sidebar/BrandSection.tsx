import React from 'react';
import styled from 'styled-components';

export const BrandSection: React.FC = () => {
  return (
    null
  );
};

const Container = styled.div`
  padding: 24px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.03);
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
`;

const LogoContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const LogoImg = styled.img`
  width: 32px;
  height: 32px;
  object-fit: contain;
`;

const LogoText = styled.h2`
  font-size: 1.25rem;
  font-weight: 800;
  color: #111827;
  margin: 0;
  letter-spacing: -0.02em;
  line-height: 1.2;
`;

const Subtitle = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: #9ca3af;
  letter-spacing: 0.02em;
`;

const Status = styled.div`
  font-size: 0.7rem;
  color: #4ade80;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(74, 222, 128, 0.1);
  width: fit-content;
  padding: 2px 8px;
  border-radius: 10px;
`;

const Dot = styled.span`
  width: 6px;
  height: 6px;
  background: #4ade80;
  border-radius: 50%;
  display: none; /* Icon already has emoji or dot */
`;
