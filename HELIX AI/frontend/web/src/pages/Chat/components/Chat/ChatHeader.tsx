import React from 'react';
import styled from 'styled-components';
import { Sparkles, Activity } from 'lucide-react';

interface Props {
   title?: string;
}

export const ChatHeader: React.FC<Props> = () => {
   return (
      <Container />
   );
};

const Container = styled.header`
  height: 24px;
  display: flex;
  background: transparent;
  z-index: 10;
`;
