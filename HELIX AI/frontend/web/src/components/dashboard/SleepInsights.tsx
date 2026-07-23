import React from 'react';
import styled from 'styled-components';
import { Moon, Sun, AlertCircle } from 'lucide-react';

interface SleepInsightsProps {
   data: {
      date: string;
      night_chat_count: number;
      message_count: number;
   }[];
}

export const SleepInsights: React.FC<SleepInsightsProps> = ({ data }) => {
   const totalNightMessages = data.reduce((acc, curr) => acc + curr.night_chat_count, 0);
   const avgNightMessages = data.length > 0 ? totalNightMessages / data.length : 0;

   const isHighNightActivity = avgNightMessages > 5;

   return (
      <Container>
         <StatRow>
            <StatIcon $bgColor="rgba(129, 140, 248, 0.1)" $color="#818cf8">
               <Moon size={18} />
            </StatIcon>
            <StatInfo>
               <StatLabel>Nighttime Activity</StatLabel>
               <StatValue>
                  {totalNightMessages} <small>Messages (Last 7 Days)</small>
               </StatValue>
            </StatInfo>
         </StatRow>

         <StatRow>
            <StatIcon $bgColor="rgba(245, 158, 11, 0.1)" $color="#f59e0b">
               <Sun size={18} />
            </StatIcon>
            <StatInfo>
               <StatLabel>Sleep Impact Focus</StatLabel>
               <StatValueText>
                  {totalNightMessages > 0 ? (
                     isHighNightActivity ? 'High Night Activity Detected' : 'Healthy Sleep Window Usage'
                  ) : (
                     'Optimal Sleeping Habits'
                  )}
               </StatValueText>
            </StatInfo>
         </StatRow>


      </Container>
   );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
`;

const StatRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const StatIcon = styled.div<{ $bgColor: string; $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${props => props.$bgColor};
  color: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatLabel = styled.p`
  color: #94a3b8;
  font-size: 0.8rem;
  font-weight: 600;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StatValue = styled.h4`
  color: #111827;
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;

  small {
    font-size: 0.8rem;
    font-weight: 400;
    color: #475569;
    margin-left: 4px;
  }
`;

const StatValueText = styled.p`
  color: #111827;
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
`;

const InsightBox = styled.div<{ $isWarning: boolean }>`
  margin-top: auto;
  padding: 12px 16px;
  border-radius: 12px;
  background: ${props => props.$isWarning ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)'};
  border: 2px solid #000000;
  color: ${props => props.$isWarning ? '#f87171' : '#4ade80'};
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;

const InsightText = styled.p`
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.4;
`;
