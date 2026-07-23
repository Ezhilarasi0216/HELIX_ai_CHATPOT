import React from 'react';
import styled from 'styled-components';
import { Search } from 'lucide-react';

export const SearchBar: React.FC = () => {
  return (
    <Container>
      <IconWrapper>
        <Search size={16} />
      </IconWrapper>
      <Input placeholder="Search chats..." />
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  margin: 0 16px 24px;
`;

const IconWrapper = styled.div`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #cbd5e1;
  display: flex;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 12px 12px 42px;
  background: #1f1f1f;
  border: 1px solid rgba(0, 0, 0, 0.03);
  border-radius: 20px;
  color: #f8fafc;
  font-size: 0.85rem;
  outline: none;
  transition: all 0.2s;

  &:focus {
    background: #262626;
    border-color: rgba(0, 0, 0, 0.08);
  }

  &::placeholder {
    color: #4a5568;
  }
`;
