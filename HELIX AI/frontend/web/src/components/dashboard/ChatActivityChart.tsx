import React from 'react';
import {
   BarChart,
   Bar,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   ResponsiveContainer,
   Cell,
} from 'recharts';
import styled from 'styled-components';

interface ChatActivityChartProps {
   data: {
      date: string;
      message_count: number;
   }[];
}

export const ChatActivityChart: React.FC<ChatActivityChartProps> = ({ data }) => {
   // Format dates for better display
   const chartData = data.map(item => ({
      ...item,
      displayDate: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
   }));

   if (chartData.length === 0) {
      return (
         <EmptyState>
            <p>No activity data yet. Start chatting!</p>
         </EmptyState>
      );
   }

   return (
      <Container>
         <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
               <XAxis
                  dataKey="displayDate"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  dy={10}
               />
               <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
               />
               <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{
                     background: '#1e293b',
                     border: '1px solid rgba(255,255,255,0.1)',
                     borderRadius: '8px',
                     padding: '10px',
                  }}
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
               />
               <Bar dataKey="message_count" radius={[4, 4, 0, 0]}>
                  {chartData.map((_entry, index) => (
                     <Cell
                        key={`cell-${index}`}
                        fill={index === chartData.length - 1 ? '#818cf8' : 'rgba(129, 140, 248, 0.3)'}
                     />
                  ))}
               </Bar>
            </BarChart>
         </ResponsiveContainer>
      </Container>
   );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const EmptyState = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 0.9rem;
`;
