import React from 'react';
import styled from 'styled-components';
import { BrandSection } from './BrandSection';
import { ChatHistory } from './ChatHistory';
import { ToolsMenu } from './ToolsMenu';

import { ProfileSection } from './ProfileSection';
import { Phone, ShieldAlert } from 'lucide-react';

interface Props {
  onNewChat: () => void;
  onTriggerSOS: () => void;
  isTamilMode: boolean;
  onLanguageToggle: (lang: 'EN' | 'TA') => void;
  onChatSelect: (sessionId: string) => void;
  currentSessionId: string | null;
  refreshTrigger?: number;
}

const Container = styled.aside`
  width: 280px;
  height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  border-right: 2px solid #000000;
  transition: all 0.3s ease;
  flex-shrink: 0;

  @media (max-width: 768px) {
    position: fixed;
    left: -280px;
    z-index: 1000;
  }
`;

const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 10px;
  }
`;

const Footer = styled.div`
  margin-top: auto;
  padding-bottom: 10px;
`;

const IntelligenceSection = styled.div`
  padding: 0 8px;
  margin-top: 40px;
  margin-bottom: 20px;
`;

const IntelligenceTitle = styled.h4`
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #9ca3af;
  margin: 0 12px 10px;
  letter-spacing: 0.1em;
`;
const NewChatLink = styled.button`
  width: 100%;
  background: none;
  border: none;
  color: #111827;
  font-weight: 600;
  font-size: 0.95rem;
  text-align: left;
  padding: 10px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  border-radius: 8px;

  &:hover {
    color: #4f46e5;
    background: rgba(79, 70, 229, 0.05);
  }
`;

const LinksContainer = styled.div`
  padding: 8px 0 16px;
  display: flex;
  flex-direction: column;
`;

const TextLink = styled.button`
  background: none;
  border: none;
  color: #4b5563;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: left;
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;

  &:hover {
    color: #4f46e5;
    background: rgba(0, 0, 0, 0.03);
    padding-left: 24px;
  }

  &:active {
    background: rgba(0, 0, 0, 0.05);
  }
`;

const SearchWrapper = styled.div`
  animation: slideDown 0.3s ease-out;
  
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;


export const Sidebar: React.FC<Props> = ({
  onNewChat,
  onTriggerSOS,
  isTamilMode,
  onLanguageToggle,
  onChatSelect,
  currentSessionId,
  refreshTrigger
}) => {
  return (
    <Container>
      <BrandSection />

      <IntelligenceSection>
        <NewChatLink onClick={onNewChat}>
          New Chat
        </NewChatLink>
        <ToolsMenu />
      </IntelligenceSection>

      <ScrollArea>
        <ChatHistory
          onChatSelect={onChatSelect}
          currentSessionId={currentSessionId}
          refreshTrigger={refreshTrigger}
        />
      </ScrollArea>

      <Footer>

        <ProfileSection />
      </Footer>
    </Container>
  );
};

