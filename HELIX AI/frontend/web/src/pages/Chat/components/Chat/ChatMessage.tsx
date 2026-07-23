import React from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { ChatMessage as MessageType } from '../../../../types';

interface Props {
   message: MessageType;
}

export const ChatMessage: React.FC<Props> = ({ message }) => {
   const isAssistant = message.role === 'assistant';

   return (
      <Container $isAssistant={isAssistant}>
         <Content $isAssistant={isAssistant}>
            <Bubble $isAssistant={isAssistant}>
               <ReactMarkdown>{message.content}</ReactMarkdown>
            </Bubble>
            <Timestamp $isAssistant={isAssistant}>
               {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Timestamp>
         </Content>
      </Container>
   );
};

const Container = styled.div<{ $isAssistant: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.$isAssistant ? 'flex-start' : 'flex-end'};
  width: 100%;
  padding: 4px 20px;
`;

const Content = styled.div<{ $isAssistant: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: ${props => props.$isAssistant ? 'flex-start' : 'flex-end'};
  max-width: 85%;
`;

const Bubble = styled.div<{ $isAssistant: boolean }>`
  padding: 12px 16px;
  border-radius: 18px;
  background: ${props => props.$isAssistant ? 'rgba(0, 0, 0, 0.03)' : '#4f46e5'};
  color: ${props => props.$isAssistant ? '#000000' : '#ffffff'};
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.03);
  font-size: 0.95rem;
  line-height: 1.6;

  ${props => props.$isAssistant ? 'border-top-left-radius: 4px;' : 'border-top-right-radius: 4px;'}

  p {
    margin: 0;
  }
`;

const Timestamp = styled.span<{ $isAssistant: boolean }>`
  font-size: 0.65rem;
  color: #64748b;
  margin-top: 2px;
  padding: 0 4px;
`;
