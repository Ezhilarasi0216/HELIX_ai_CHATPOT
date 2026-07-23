import React from 'react';
import styled from 'styled-components';

interface SentimentGaugeProps {
   score: number; // 0-100
}

export const SentimentGauge: React.FC<SentimentGaugeProps> = ({ score }) => {
   const radius = 40;
   const circumference = 2 * Math.PI * radius;
   const offset = circumference - (score / 100) * circumference;

   const getColor = (s: number) => {
      if (s < 40) return '#ef4444'; // Red
      if (s < 70) return '#f59e0b'; // Amber
      return '#10b981'; // Emerald
   };

   const getLabel = (s: number) => {
      if (s < 40) return 'Distressed';
      if (s < 70) return 'Managing';
      return 'Thriving';
   };

   const color = getColor(score);

   return (
      <Container>
         <GaugeWrapper>
            <svg width="100" height="100" viewBox="0 0 100 100">
               <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="8"
               />
               <ProgressCircle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke={color}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
               />
            </svg>
            <ScoreDisplay>
               <ScoreValue>{score}%</ScoreValue>
               <ScoreLabel>{getLabel(score)}</ScoreLabel>
            </ScoreDisplay>
         </GaugeWrapper>
      </Container>
   );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const GaugeWrapper = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
`;

const ProgressCircle = styled.circle`
  transition: stroke-dashoffset 1s ease-out;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
`;

const ScoreDisplay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  display: flex;
  flex-direction: column;
`;

const ScoreValue = styled.span`
  font-size: 1.2rem;
  font-weight: 800;
  color: #111827;
`;

const ScoreLabel = styled.span`
  font-size: 0.6rem;
  color: #94a3b8;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.05em;
`;
