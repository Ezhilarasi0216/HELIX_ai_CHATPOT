import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MessageSquare } from 'lucide-react';
import { getAllChatSessions, groupSessionsByDate, ChatSession } from '../../../../utils/chatHistory';

interface Props {
  onChatSelect: (sessionId: string) => void;
  currentSessionId: string | null;
  refreshTrigger?: number; // To force re-render when new messages are sent
}

export const ChatHistory: React.FC<Props> = ({ onChatSelect, currentSessionId, refreshTrigger }) => {
  const [groups, setGroups] = useState<Array<{ title: string; chats: ChatSession[] }>>([]);

  useEffect(() => {
    const loadHistory = () => {
      const sessions = getAllChatSessions();
      const grouped = groupSessionsByDate(sessions);
      setGroups(grouped);
    };

    loadHistory();
  }, [refreshTrigger]); // Re-load when refreshTrigger changes

  return (
    <Container>
      {groups.map((group) => (
        <Group key={group.title}>
          <GroupTitle>{group.title}</GroupTitle>
          {group.chats.map((chat) => (
            <ChatItem
              key={chat.id}
              onClick={() => onChatSelect(chat.id)}
              $isActive={chat.id === currentSessionId}
            >
              <MessageSquare size={14} />
              <ChatText>{chat.title}</ChatText>
            </ChatItem>
          ))}
        </Group>
      ))}
    </Container>
  );
};

const Container = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 16px;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 10px;
  }
`;

const Group = styled.div`
  margin-bottom: 24px;
`;

const GroupTitle = styled.h4`
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #9ca3af;
  margin-bottom: 8px;
  letter-spacing: 0.05em;
`;

const ChatItem = styled.div<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  margin: 2px 0;
  border-radius: 6px;
  color: ${props => props.$isActive ? '#4f46e5' : '#4b5563'};
  background: ${props => props.$isActive ? 'rgba(79, 70, 229, 0.1)' : 'transparent'};
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$isActive ? 'rgba(79, 70, 229, 0.15)' : 'rgba(0, 0, 0, 0.05)'};
    color: ${props => props.$isActive ? '#4f46e5' : '#111827'};
  }
`;

const ChatText = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
