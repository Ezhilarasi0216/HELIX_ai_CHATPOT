import React from 'react';
import styled from 'styled-components';
import { Plus } from 'lucide-react';

interface Props {
   onClick: () => void;
}

export const NewChatButton: React.FC<Props> = ({ onClick }) => {
   return (
      <Button onClick={onClick}>
         <Plus size={18} />
         New Chat
      </Button>
   );
};

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 12px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: #374151;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;

  &:hover {
    background: rgba(0, 0, 0, 0.03);
    color: #4f46e5;
    background: rgba(79, 70, 229, 0.1);
  }
`;
