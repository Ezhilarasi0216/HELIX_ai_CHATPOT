import React from 'react';
import styled from 'styled-components';
import { Globe } from 'lucide-react';

interface Props {
  currentLang: 'EN' | 'TA';
  onToggle: (lang: 'EN' | 'TA') => void;
}

export const LanguageSwitcher: React.FC<Props> = ({ currentLang, onToggle }) => {
  return (
    <Container>
      <Label>
        Language
      </Label>
      <Options>
        <Lang $active={currentLang === 'EN'} onClick={() => onToggle('EN')}>EN</Lang>
        <Divider>|</Divider>
        <Lang $active={currentLang === 'TA'} onClick={() => onToggle('TA')}>தமிழ்</Lang>
      </Options>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  color: #374151;
`;

const Label = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.85rem;
`;

const Options = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
`;

const Lang = styled.span<{ $active: boolean }>`
  cursor: pointer;
  color: ${props => props.$active ? '#4f46e5' : 'inherit'};
  font-weight: ${props => props.$active ? '600' : '400'};
  
  &:hover {
    color: #111827;
  }
`;

const Divider = styled.span`
  color: rgba(0, 0, 0, 0.12);
  user-select: none;
`;
