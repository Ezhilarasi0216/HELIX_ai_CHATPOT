import React from 'react';
import styled from 'styled-components';
import { Sparkles, CheckCircle2, Heart } from 'lucide-react';

interface ActionSuggestionsProps {
   suggestions: string[];
}

export const ActionSuggestions: React.FC<ActionSuggestionsProps> = ({ suggestions }) => {
   return (
      <Container>
         <TitleRow>
            <Subtitle>Personalized Wellness Tasks</Subtitle>
            <Sparkles size={16} color="#818cf8" />
         </TitleRow>

         <List>
            {suggestions.map((suggestion, idx) => (
               <SuggestionItem key={idx}>
                  <IconBox>
                     <CheckCircle2 size={18} />
                  </IconBox>
                  <Text>{suggestion}</Text>
               </SuggestionItem>
            ))}
         </List>

         <SupportBox>
            <Heart size={14} fill="#818cf8" stroke="none" />
            <span>Healix is here to support you at every step.</span>
         </SupportBox>
      </Container>
   );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Subtitle = styled.p`
  color: #94a3b8;
  font-size: 0.85rem;
  margin: 0;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SuggestionItem = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  background: rgba(129, 140, 248, 0.05);
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid rgba(129, 140, 248, 0.1);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(129, 140, 248, 0.1);
    transform: translateX(4px);
  }
`;

const IconBox = styled.div`
  color: #818cf8;
  display: flex;
  align-items: center;
`;

const Text = styled.p`
  color: #1f2937;
  font-size: 0.85rem;
  margin: 0;
  line-height: 1.4;
`;

const SupportBox = styled.div`
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  color: #64748b;
  justify-content: center;
`;
