import React from 'react';
import styled from 'styled-components';
import { Tag, AlertTriangle, Zap } from 'lucide-react';

interface TriggerAnalysisProps {
   triggers: string[];
}

export const TriggerAnalysis: React.FC<TriggerAnalysisProps> = ({ triggers }) => {
   return (
      <Container>
         <TitleRow>
            <Subtitle>Identified Triggers & Themes</Subtitle>
         </TitleRow>

         <TagList>
            {triggers.map((trigger, idx) => (
               <TagItem key={idx}>
                  <IconWrapper>
                     {idx === 0 ? <Zap size={14} /> : <AlertTriangle size={14} />}
                  </IconWrapper>
                  <TagName>{trigger}</TagName>
               </TagItem>
            ))}
         </TagList>

         <InsightHint>
         </InsightHint>
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
`;

const Subtitle = styled.p`
  color: #94a3b8;
  font-size: 0.85rem;
  margin: 0;
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const TagItem = styled.div`
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.05);
  padding: 6px 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }
`;

const IconWrapper = styled.div`
  color: #818cf8;
`;

const TagName = styled.span`
  color: #111827;
  font-size: 0.85rem;
  font-weight: 500;
`;

const InsightHint = styled.p`
  font-size: 0.75rem;
  color: #475569;
  margin-top: auto;
  font-style: italic;
`;
