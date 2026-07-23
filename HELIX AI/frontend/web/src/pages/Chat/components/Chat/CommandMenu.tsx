import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
   Plus, Search, Settings, HelpCircle,
   Trash2, X, Command, MessageSquarePlus,
   Languages
} from 'lucide-react';
import { useEmotion } from '../../../../context/EmotionContext';

interface Props {
   isOpen: boolean;
   onClose: () => void;
}

export const CommandMenu: React.FC<Props> = ({ isOpen, onClose }) => {
   const { resetChat } = useEmotion();
   const [searchTerm, setSearchTerm] = useState('');

   useEffect(() => {
      const handleEsc = (e: KeyboardEvent) => {
         if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
   }, [onClose]);

   if (!isOpen) return null;

   const commands = [
      {
         id: 'new-chat',
         label: 'New Chat',
         icon: <MessageSquarePlus size={18} />,
         action: () => { resetChat(); onClose(); },
         shortcut: 'N'
      },
      {
         id: 'clear-history',
         label: 'Clear History',
         icon: <Trash2 size={18} />,
         action: () => { resetChat(); onClose(); },
         shortcut: 'D'
      },
      {
         id: 'help',
         label: 'Help & Support',
         icon: <HelpCircle size={18} />,
         action: () => { window.location.href = '/help'; onClose(); },
         shortcut: 'H'
      }
   ];

   const filteredCommands = commands.filter(cmd =>
      cmd.label.toLowerCase().includes(searchTerm.toLowerCase())
   );

   return (
      <Overlay onClick={onClose}>
         <MenuContent onClick={e => e.stopPropagation()}>
            <Header>
               <SearchIcon>
                  <Search size={18} />
               </SearchIcon>
               <SearchInput
                  autoFocus
                  placeholder="Type a command or search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
               <CloseButton onClick={onClose}>
                  <X size={18} />
               </CloseButton>
            </Header>

            <List>
               {filteredCommands.length > 0 ? (
                  filteredCommands.map(cmd => (
                     <Item key={cmd.id} onClick={cmd.action}>
                        <IconWrapper>{cmd.icon}</IconWrapper>
                        <Label>{cmd.label}</Label>
                        <Shortcut>{cmd.shortcut}</Shortcut>
                     </Item>
                  ))
               ) : (
                  <NoResults>No commands found for "{searchTerm}"</NoResults>
               )}
            </List>

            <Footer>
               <Command size={14} />
               <span>Press Enter to select, Esc to close</span>
            </Footer>
         </MenuContent>
      </Overlay>
   );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const MenuContent = styled.div`
  width: 100%;
  max-width: 600px;
  background: #1a1a1a;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  animation: modalAppear 0.2s ease-out;

  @keyframes modalAppear {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.03);
`;

const SearchIcon = styled.div`
  color: #9ca3af;
  margin-right: 12px;
  display: flex;
`;

const SearchInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  color: #111827;
  font-size: 1rem;
  outline: none;

  &::placeholder {
    color: #9ca3af;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;

  &:hover {
    background: rgba(0, 0, 0, 0.03);
    color: #111827;
  }
`;

const List = styled.div`
  max-height: 350px;
  overflow-y: auto;
  padding: 8px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  color: #374151;

  &:hover {
    background: rgba(0, 0, 0, 0.03);
    color: #111827;
  }
`;

const IconWrapper = styled.div`
  margin-right: 12px;
  display: flex;
  color: #818cf8;
`;

const Label = styled.span`
  flex: 1;
  font-size: 0.95rem;
`;

const Shortcut = styled.kbd`
  font-family: inherit;
  font-size: 0.75rem;
  background: rgba(0, 0, 0, 0.08);
  padding: 2px 6px;
  border-radius: 4px;
  color: #9ca3af;
`;

const NoResults = styled.div`
  padding: 32px;
  text-align: center;
  color: #9ca3af;
  font-size: 0.9rem;
`;

const Footer = styled.div`
  padding: 12px 16px;
  background: #161616;
  border-top: 1px solid rgba(0, 0, 0, 0.03);
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  color: #9ca3af;
`;
