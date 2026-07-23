import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import styled from 'styled-components';
import { BarChart3, Calendar as CalendarIcon, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EMOTION_COLORS: Record<string, string> = {
   Joy: '#f59e0b', // amber-500
   Trust: '#10b981', // emerald-500
   Fear: '#14b8a6', // teal-500
   Surprise: '#0ea5e9', // sky-500
   Sadness: '#6366f1', // indigo-500
   Disgust: '#8b5cf6', // violet-500
   Anger: '#ef4444', // red-500
   Anticipation: '#f97316', // orange-500
};

export const AnalyticsDashboard: React.FC = () => {
   const [data, setData] = useState<any[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const navigate = useNavigate();
   const user = JSON.parse(localStorage.getItem('user') || '{}');

   useEffect(() => {
      const fetchAnalytics = async () => {
         try {
            const response = await fetch(`http://127.0.0.1:8003/chat/analytics/${user.user_id || 'anonymous'}`);
            if (response.ok) {
               const result = await response.json();
               setData(result.data);
            }
         } catch (error) {
            console.error("Failed to fetch analytics", error);
         } finally {
            setIsLoading(false);
         }
      };
      fetchAnalytics();
   }, [user.user_id]);

   const mostFrequentEmotion = () => {
      if (data.length === 0) return "Not enough data";
      const totals: Record<string, number> = {};
      data.forEach(day => {
         Object.entries(day).forEach(([key, val]) => {
            if (key !== 'date') {
               totals[key] = (totals[key] || 0) + (val as number);
            }
         });
      });
      return Object.entries(totals).reduce((a, b) => a[1] > b[1] ? a : b)[0];
   };

   return (
      <Container>
         <Header>
            <BackButton onClick={() => navigate('/chat')}>
               <ArrowLeft size={20} />
               Back to Chat
            </BackButton>
            <TitleSection>
               <BarChart3 size={32} color="#818cf8" />
               <div>
                  <Title>Mood Analytics</Title>
                  <Subtitle>Historical emotional trends from the last 7 days</Subtitle>
               </div>
            </TitleSection>
         </Header>

         {isLoading ? (
            <LoadingState>Analyzing your emotional landscape...</LoadingState>
         ) : data.length > 0 ? (
            <Content>
               <MainChartCard>
                  <CardHeader>
                     <CardTitle>Emotional Intensity (Weekly View)</CardTitle>
                     <CalendarIcon size={18} color="#4a5568" />
                  </CardHeader>
                  <ChartWrapper>
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                           <defs>
                              {Object.keys(EMOTION_COLORS).map(key => (
                                 <linearGradient key={key} id={`color${key}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={EMOTION_COLORS[key]} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={EMOTION_COLORS[key]} stopOpacity={0} />
                                 </linearGradient>
                              ))}
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222" />
                           <XAxis
                              dataKey="date"
                              tick={{ fill: '#666', fontSize: 12 }}
                              axisLine={false}
                              tickLine={false}
                              tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { weekday: 'short' })}
                           />
                           <YAxis
                              hide
                              domain={[0, 1]}
                           />
                           <Tooltip
                              contentStyle={{ background: '#111', border: '1px solid #333', borderRadius: '8px' }}
                              itemStyle={{ fontSize: '12px' }}
                           />
                           <Legend />
                           {Object.entries(EMOTION_COLORS).map(([key, color]) => (
                              <Area
                                 key={key}
                                 type="monotone"
                                 dataKey={key}
                                 stroke={color}
                                 fillOpacity={1}
                                 fill={`url(#color${key})`}
                                 strokeWidth={2}
                              />
                           ))}
                        </AreaChart>
                     </ResponsiveContainer>
                  </ChartWrapper>
               </MainChartCard>

               <StatsGrid>
                  <StatCard>
                     <StatLabel>Dominant Emotion</StatLabel>
                     <StatValue color={EMOTION_COLORS[mostFrequentEmotion()] || '#fff'}>
                        {mostFrequentEmotion()}
                     </StatValue>
                  </StatCard>
                  <StatCard>
                     <StatLabel>Data Points</StatLabel>
                     <StatValue>{data.length} Days Tracked</StatValue>
                  </StatCard>
                  <StatCard>
                     <StatLabel>Well-being Score</StatLabel>
                     <StatValue color="#10b981">84%</StatValue>
                  </StatCard>
               </StatsGrid>
            </Content>
         ) : (
            <EmptyState>
               <BarChart3 size={48} color="#222" />
               <h3>No data yet</h3>
               <p>Start chatting with Healix AI to build your emotional profile.</p>
               <ActionButton onClick={() => navigate('/chat')}>Start Conversation</ActionButton>
            </EmptyState>
         )}
      </Container>
   );
};

const Container = styled.div`
  flex: 1;
  background: #ffffff;
  color: #111827;
  padding: 40px;
  overflow-y: auto;
  height: 100vh;
`;

const Header = styled.header`
  max-width: 1000px;
  margin: 0 auto 40px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #888;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin-bottom: 24px;
  transition: color 0.2s;
  &:hover { color: #111827; }
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
`;

const Subtitle = styled.p`
  color: #666;
  margin: 4px 0 0;
`;

const Content = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const MainChartCard = styled.div`
  background: #f9fafb;
  border: 1px solid #222;
  border-radius: 20px;
  padding: 32px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const CardTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #eee;
  margin: 0;
`;

const ChartWrapper = styled.div`
  height: 400px;
  width: 100%;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-cols-1 md:grid-cols-3;
  display: flex;
  gap: 16px;
`;

const StatCard = styled.div`
  flex: 1;
  background: #f9fafb;
  border: 1px solid #222;
  border-radius: 16px;
  padding: 24px;
`;

const StatLabel = styled.p`
  color: #666;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 8px;
`;

const StatValue = styled.h4<{ color?: string }>`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: ${props => props.color || 'white'};
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60vh;
  color: #666;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  text-align: center;
  gap: 16px;
  h3 { margin: 0; font-size: 1.5rem; }
  p { color: #666; max-width: 300px; margin: 0; }
`;

const ActionButton = styled.button`
  background: #4f46e5;
  color: #111827;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 20px;
  transition: transform 0.2s;
  &:hover { transform: scale(1.05); }
`;
