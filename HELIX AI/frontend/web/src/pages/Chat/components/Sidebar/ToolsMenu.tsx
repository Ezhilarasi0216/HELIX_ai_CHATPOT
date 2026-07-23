import React from 'react';
import styled from 'styled-components';
import { LayoutDashboard, Bell, Brain, Mic, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ToolsMenu: React.FC = () => {
  const navigate = useNavigate();

  const tools = [
    { label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard' },
    { label: 'Reminders', icon: <Bell size={18} />, path: '/calendar' },
    { label: 'Safety Hub', icon: <ShieldCheck size={18} />, path: '/help' },
  ];

  return (
    <Container>
      {tools.map((tool) => (
        <ToolItem key={tool.label} onClick={() => navigate(tool.path)}>
          <LabelWrapper>
            <Label>{tool.label}</Label>
          </LabelWrapper>
        </ToolItem>
      ))}
    </Container>
  );
};

const Container = styled.div`
  padding: 0;
`;

const Title = styled.h4`
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #9ca3af;
  margin-bottom: 12px;
  letter-spacing: 0.05em;
`;

const ToolItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  color: #374151;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #4f46e5;
    background: rgba(79, 70, 229, 0.05);
  }
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
`;

const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
`;

const Label = styled.span`
  font-weight: 500;
`;


