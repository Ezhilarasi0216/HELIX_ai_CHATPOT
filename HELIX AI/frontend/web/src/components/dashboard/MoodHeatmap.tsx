import React, { useMemo } from 'react';
import styled from 'styled-components';

interface MoodHeatmapProps {
   data: {
      date: string;
      dominant_emotion: string;
      intensity: number;
      emotions: Record<string, number>;
   }[];
}

const EMOTION_COLORS: Record<string, string> = {
   Joy: '#fcd34d',
   Trust: '#34d399',
   Fear: '#a78bfa',
   Surprise: '#fb7185',
   Sadness: '#60a5fa',
   Disgust: '#4ade80',
   Anger: '#f87171',
   Anticipation: '#fb923c',
   Calm: '#818cf8',
};

export const MoodHeatmap: React.FC<MoodHeatmapProps> = ({ data }) => {
   // Generate last 30 days grid
   const days = useMemo(() => {
      const arr = [];
      const today = new Date();
      for (let i = 29; i >= 0; i--) {
         const d = new Date();
         d.setDate(today.getDate() - i);
         const dateStr = d.toISOString().split('T')[0];
         const dayData = data.find(item => item.date === dateStr);
         arr.push({
            date: dateStr,
            data: dayData,
            label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
         });
      }
      return arr;
   }, [data]);

   return (
      <Container>
         <TitleRow>
            <Subtitle>Last 30 Days Mood Intensity</Subtitle>
            <Legend>
               <span>Low</span>
               {[0.2, 0.4, 0.6, 0.8, 1].map(v => (
                  <LegendBox key={v} $opacity={v} />
               ))}
               <span>High</span>
            </Legend>
         </TitleRow>

         <Grid>
            {days.map((day, idx) => {
               const color = day.data ? EMOTION_COLORS[day.data.dominant_emotion] : 'rgba(255,255,255,0.05)';
               const opacity = day.data ? Math.max(0.2, day.data.intensity) : 1;

               return (
                  <DaySquare
                     key={idx}
                     $color={color}
                     $opacity={opacity}
                     title={`${day.label}${day.data ? `: ${day.data.dominant_emotion} (${(day.data.intensity * 100).toFixed(0)}%)` : ': No data'}`}
                  />
               );
            })}
         </Grid>

         <MonthsRow>
            <span>Last Month</span>
            <span style={{ marginLeft: 'auto' }}>Today</span>
         </MonthsRow>
      </Container>
   );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
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

const Legend = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const LegendBox = styled.div<{ $opacity: number }>`
  width: 10px;
  height: 10px;
  border-radius: 2px;
  background: #818cf8;
  opacity: ${props => props.$opacity};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(15, 1fr);
  gap: 6px;
  width: 100%;
`;

const DaySquare = styled.div<{ $color: string; $opacity: number }>`
  aspect-ratio: 1;
  border-radius: 2px;
  background: ${props => props.$color};
  opacity: ${props => props.$opacity};
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: help;
  border: 1px solid rgba(0, 0, 0, 0.03);

  &:hover {
    transform: scale(1.1);
    z-index: 10;
    border-color: rgba(0, 0, 0, 0.12);
  }
`;

const MonthsRow = styled.div`
  display: flex;
  font-size: 10px;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
`;
