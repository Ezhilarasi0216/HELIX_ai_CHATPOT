import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { ChatMessage as ChatMessageComp } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { ChatMessage } from '../../../../types';

interface Props {
   messages: ChatMessage[];
   isLoading: boolean;
}

export const MessageList: React.FC<Props> = ({ messages, isLoading }) => {
   const endRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages, isLoading]);

   return (
      <Container>
         {messages.length === 0 && (
            <EmptyState>
               <h3>How can I support you today?</h3>
               <p>I'm here to listen, offer guidance, and help you navigate your emotions.</p>
            </EmptyState>
         )}

         <MessagesContent>
            {messages.filter(msg => !msg.isAudio).map((msg) => (
               <ChatMessageComp key={msg.id} message={msg} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={endRef} />
         </MessagesContent>
      </Container>
   );
};

const Container = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 40px 20px;
  background: #ffffff;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.08);
    border-radius: 3px;
  }
`;

const MessagesContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: #64748b;
  gap: 16px;

  h3 {
    color: #111827;
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
    letter-spacing: -0.02em;
  }

  p {
    font-size: 0.95rem;
    max-width: 320px;
  }
`;
