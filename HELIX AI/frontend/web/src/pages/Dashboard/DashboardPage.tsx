import React, { useMemo } from 'react';
import styled from 'styled-components';
import {
  TrendingUp,
  MessageSquare,
  Zap,
  User as UserIcon,
  BarChart3,
  ArrowRight,
  Smile,
  MessageCircle,
  Flame,
  Moon,
  BarChart,
  Calendar,
  Activity,
  Lightbulb,
  Camera
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EmotionRadar } from '../../components/dashboard/EmotionRadar';
import { MoodTrendChart } from '../../components/dashboard/MoodTrendChart';
import { useEmotion } from '../../context/EmotionContext';

import GlareHover from '../../components/magicui/GlareHover';
import { ChatActivityChart } from '../../components/dashboard/ChatActivityChart';
import { SleepInsights } from '../../components/dashboard/SleepInsights';
import { MoodHeatmap } from '../../components/dashboard/MoodHeatmap';
import { SentimentGauge } from '../../components/dashboard/SentimentGauge';
import { TriggerAnalysis } from '../../components/dashboard/TriggerAnalysis';
import { ActionSuggestions } from '../../components/dashboard/ActionSuggestions';
import { TherapistReportModal } from '../../components/dashboard/TherapistReportModal';
import { FileText } from 'lucide-react';
import axios from 'axios';
import { BackgroundBeamsWithCollision } from '../../components/ui/BackgroundBeamsWithCollision';

const MOODE_MOJIS: Record<string, { emoji: string; color: string }> = {
  Joy: { emoji: '😊', color: '#fcd34d' },
  Trust: { emoji: '🤝', color: '#34d399' },
  Fear: { emoji: '😨', color: '#a78bfa' },
  Surprise: { emoji: '😲', color: '#fb7185' },
  Sadness: { emoji: '😢', color: '#60a5fa' },
  Disgust: { emoji: '🤢', color: '#4ade80' },
  Anger: { emoji: '😠', color: '#f87171' },
  Anticipation: { emoji: '⏳', color: '#fb923c' },
  Calm: { emoji: '😌', color: '#818cf8' },
};

export const Dashboard: React.FC = () => {
  const { emotions, messages, user } = useEmotion();
  const navigate = useNavigate();
  const [weeklyAnalytics, setWeeklyAnalytics] = React.useState<any[]>([
    { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), Joy: 65, Trust: 70, Fear: 20, Surprise: 30, Sadness: 15, Disgust: 10, Anger: 12, Anticipation: 55, message_count: 8, night_chat_count: 2 },
    { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), Joy: 70, Trust: 75, Fear: 18, Surprise: 35, Sadness: 12, Disgust: 8, Anger: 10, Anticipation: 60, message_count: 12, night_chat_count: 4 },
    { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), Joy: 55, Trust: 60, Fear: 30, Surprise: 25, Sadness: 25, Disgust: 15, Anger: 20, Anticipation: 45, message_count: 6, night_chat_count: 1 },
    { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), Joy: 75, Trust: 80, Fear: 15, Surprise: 40, Sadness: 10, Disgust: 5, Anger: 8, Anticipation: 65, message_count: 15, night_chat_count: 6 },
    { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), Joy: 80, Trust: 85, Fear: 12, Surprise: 45, Sadness: 8, Disgust: 5, Anger: 6, Anticipation: 70, message_count: 18, night_chat_count: 3 },
    { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), Joy: 72, Trust: 78, Fear: 16, Surprise: 38, Sadness: 11, Disgust: 7, Anger: 9, Anticipation: 62, message_count: 14, night_chat_count: 2 },
    { date: new Date().toISOString(), Joy: 78, Trust: 82, Fear: 14, Surprise: 42, Sadness: 9, Disgust: 6, Anger: 7, Anticipation: 68, message_count: 20, night_chat_count: 5 }
  ]);
  const [heatmapData, setHeatmapData] = React.useState<any[]>(
    Array.from({ length: 30 }).map((_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dominant_emotion: ['Joy', 'Calm', 'Trust', 'Anticipation', 'Surprise'][Math.floor(Math.random() * 5)],
      intensity: 0.4 + Math.random() * 0.6,
      emotions: { Joy: 0.5, Calm: 0.3 }
    }))
  );
  const [insights, setInsights] = React.useState<any>({
    sentiment_score: 78,
    top_triggers: [
      'Work stress',
      'Sleep issues',
      'Social anxiety'
    ],
    actionable_suggestions: [
      'Practice deep breathing exercises for 5 minutes daily',
      'Maintain a consistent sleep schedule',
      'Take short breaks during work hours'
    ]
  });
  const [weeklySummary, setWeeklySummary] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const [isReportOpen, setIsReportOpen] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { refreshUser } = useEmotion();

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`http://localhost:8003/auth/profile/${user.user_id}/upload-photo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.photo_url) {
        // Update local user object
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        userData.profile_photo = response.data.photo_url;
        localStorage.setItem('user', JSON.stringify(userData));
        refreshUser();
      }
    } catch (err) {
      console.error("Error uploading photo:", err);
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, summaryRes, heatmapRes, insightsRes] = await Promise.all([
          axios.get(`http://localhost:8003/chat/analytics/${user.user_id}`),
          axios.get(`http://localhost:8003/emotion/summary/${user.user_id}`),
          axios.get(`http://localhost:8003/chat/heatmap/${user.user_id}`),
          axios.get(`http://localhost:8003/chat/insights/${user.user_id}`)
        ]);
        setWeeklyAnalytics(analyticsRes.data.data);
        setWeeklySummary(summaryRes.data.summary);
        setHeatmapData(heatmapRes.data.data);
        setInsights(insightsRes.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        // Set sample data when backend is unavailable
        const sampleWeeklyData = [
          { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), Joy: 65, Trust: 70, Fear: 20, Surprise: 30, Sadness: 15, Disgust: 10, Anger: 12, Anticipation: 55, message_count: 8, night_chat_count: 2 },
          { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), Joy: 70, Trust: 75, Fear: 18, Surprise: 35, Sadness: 12, Disgust: 8, Anger: 10, Anticipation: 60, message_count: 12, night_chat_count: 4 },
          { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), Joy: 55, Trust: 60, Fear: 30, Surprise: 25, Sadness: 25, Disgust: 15, Anger: 20, Anticipation: 45, message_count: 6, night_chat_count: 1 },
          { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), Joy: 75, Trust: 80, Fear: 15, Surprise: 40, Sadness: 10, Disgust: 5, Anger: 8, Anticipation: 65, message_count: 15, night_chat_count: 6 },
          { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), Joy: 80, Trust: 85, Fear: 12, Surprise: 45, Sadness: 8, Disgust: 5, Anger: 6, Anticipation: 70, message_count: 18, night_chat_count: 3 },
          { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), Joy: 72, Trust: 78, Fear: 16, Surprise: 38, Sadness: 11, Disgust: 7, Anger: 9, Anticipation: 62, message_count: 14, night_chat_count: 2 },
          { date: new Date().toISOString(), Joy: 78, Trust: 82, Fear: 14, Surprise: 42, Sadness: 9, Disgust: 6, Anger: 7, Anticipation: 68, message_count: 20, night_chat_count: 5 }
        ];
        setWeeklyAnalytics(sampleWeeklyData);
        setHeatmapData(
          Array.from({ length: 30 }).map((_, i) => ({
            date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            dominant_emotion: ['Joy', 'Calm', 'Trust', 'Anticipation', 'Surprise'][Math.floor(Math.random() * 5)],
            intensity: 0.4 + Math.random() * 0.6,
            emotions: { Joy: 0.5, Calm: 0.3 }
          }))
        );
        setInsights({
          sentiment_score: 78,
          top_triggers: [
            'Work stress',
            'Sleep issues',
            'Social anxiety'
          ],
          actionable_suggestions: [
            'Practice deep breathing exercises for 5 minutes daily',
            'Maintain a consistent sleep schedule',
            'Take short breaks during work hours'
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    if (user?.user_id) {
      fetchData();
    }
  }, [user?.user_id]);

  const dominantEmotion = useMemo(() => {
    const entries = Object.entries(emotions);
    if (entries.length === 0 || entries.every(([_, v]) => v === 0)) return 'Calm';
    return entries.reduce((a, b) => a[1] > b[1] ? a : b)[0];
  }, [emotions]);

  const moodInfo = useMemo(() => MOODE_MOJIS[dominantEmotion] || MOODE_MOJIS.Calm, [dominantEmotion]);

  const firstName = (user.full_name || 'there').split(' ')[0];

  return (
    <PageWrapper>
      <BackgroundBeamsWithCollision className="absolute inset-0 z-0" />
      <Container>
        <Header>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <WelcomeSection>
              <AvatarContainer onClick={() => fileInputRef.current?.click()}>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
                {user.profile_photo ? (
                  <ProfileImg src={user.profile_photo} alt="Profile" />
                ) : (
                  <UserIcon size={24} />
                )}
                <AvatarOverlay className="overlay">
                  <Camera size={20} />
                </AvatarOverlay>
              </AvatarContainer>
              <div>
                <Greeting>
                  Hello, {firstName}
                  <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))] ml-4">
                    <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
                      <span className="">Exploding beams.</span>
                    </div>
                    <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500">
                      <span className="">Exploding beams.</span>
                    </div>
                  </div>
                </Greeting>
                <SubGreeting>
                  Here's how your well-being journey is looking today.
                </SubGreeting>
              </div>
            </WelcomeSection>

            <HeaderActions>
              <ExportButton onClick={() => setIsReportOpen(true)}>
                <FileText size={18} />
                Export Report
              </ExportButton>
            </HeaderActions>
          </div>
        </Header>

        <TherapistReportModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          userId={user.user_id}
          userName={user.full_name}
          moodHistory={weeklyAnalytics}
        />

        <StatsGrid>
          <GlareHover className="glass flex items-center gap-4 p-6" borderRadius="20px">
            <StatIcon $color={moodInfo.color}>
              <span style={{ fontSize: '20px' }}>{moodInfo.emoji}</span>
            </StatIcon>
            <div>
              <StatLabel>Main Mood</StatLabel>
              <StatValue>{dominantEmotion}</StatValue>
            </div>
          </GlareHover>
          <GlareHover className="glass flex items-center gap-4 p-6" borderRadius="20px">
            <StatIcon $color="#4ade80"><MessageCircle size={20} /></StatIcon>
            <div>
              <StatLabel>Conversations</StatLabel>
              <StatValue>{messages.length} <small>Messages</small></StatValue>
            </div>
          </GlareHover>
          <GlareHover className="glass flex items-center gap-4 p-6" borderRadius="20px">
            <StatIcon $color="#f97316">
              <img src="/fire-svgrepo-com.svg" alt="Fire" style={{ width: '20px', height: '20px' }} />
            </StatIcon>
            <div>
              <StatLabel>Streak</StatLabel>
              <StatValue> 0 <small>Days</small></StatValue>
            </div>
          </GlareHover>
          <GlareHover className="glass flex items-center gap-4 p-6" borderRadius="20px">
            <StatIcon $color="#10b981">
              <img src="/speedometer.png" alt="Score" style={{ width: '24px', height: '24px' }} />
            </StatIcon>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div>
                <StatLabel>Score</StatLabel>
                <StatValue>{insights.sentiment_score}%</StatValue>
              </div>
              <SentimentGauge score={insights.sentiment_score} />
            </div>
          </GlareHover>
        </StatsGrid>

        <SectionTitle>Emotional Intelligence</SectionTitle>

        <ChartsSection>
          <GlareHover className="glass p-7 flex flex-col" borderRadius="24px">
            <ChartHeader>
              <ChartTitle>Weekly Mood Trend</ChartTitle>
              <TrendingUp size={18} color="rgba(0,0,0,0.2)" />
            </ChartHeader>
            <ChartContent>
              <MoodTrendChart history={weeklyAnalytics.map(a => ({
                timestamp: new Date(a.date).getTime(),
                emotions: {
                  Joy: a.Joy, Trust: a.Trust, Fear: a.Fear, Surprise: a.Surprise,
                  Sadness: a.Sadness, Disgust: a.Disgust, Anger: a.Anger, Anticipation: a.Anticipation
                }
              }))} />
            </ChartContent>
          </GlareHover>

          <GlareHover className="glass p-7 flex flex-col" borderRadius="24px">
            <ChartHeader>
              <ChartTitle>Chat Activity</ChartTitle>
              <BarChart size={18} color="rgba(0,0,0,0.2)" />
            </ChartHeader>
            <ChartContent>
              <ChatActivityChart data={weeklyAnalytics} />
            </ChartContent>
          </GlareHover>

          <GlareHover className="glass p-7 flex flex-col" borderRadius="24px">
            <ChartHeader>
              <ChartTitle>Sleep & Night Activity</ChartTitle>
              <img src="/sleeping.png" alt="Sleep" style={{ width: '20px', height: '20px', opacity: 0.8 }} />
            </ChartHeader>
            <ChartContent>
              <SleepInsights data={weeklyAnalytics} />
            </ChartContent>
          </GlareHover>

          <GlareHover className="glass p-7 flex flex-col" borderRadius="24px">
            <ChartHeader>
              <ChartTitle>Current Balance</ChartTitle>
              <BarChart3 size={18} color="rgba(255,255,255,0.2)" />
            </ChartHeader>
            <ChartContent>
              <EmotionRadar data={emotions} />
            </ChartContent>
          </GlareHover>

          <GlareHover className="glass p-7 flex flex-col" borderRadius="24px">
            <ChartHeader>
              <ChartTitle>Monthly Mood Heatmap</ChartTitle>
              <Calendar size={18} color="rgba(255,255,255,0.2)" />
            </ChartHeader>
            <ChartContent>
              <MoodHeatmap data={heatmapData} />
            </ChartContent>
          </GlareHover>

          <GlareHover className="glass p-7 flex flex-col" borderRadius="24px">
            <ChartHeader>
              <ChartTitle>Trigger Analysis</ChartTitle>
              <Zap size={18} color="rgba(255,255,255,0.2)" />
            </ChartHeader>
            <ChartContent>
              <TriggerAnalysis triggers={insights.top_triggers} />
            </ChartContent>
          </GlareHover>


        </ChartsSection>


      </Container >
    </PageWrapper>
  );
};

const PageWrapper = styled.div`
  height: 100vh;
  width: 100%;
  overflow: hidden;
  position: relative;
  background: #ffffff;
`;

const Container = styled.div`
  padding: 40px;
  background: transparent;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  color: #111827;
  animation: fadeIn 0.6s ease-out;
  position: relative;
  z-index: 10;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Header = styled.header`
  margin-bottom: 40px;
  display: flex;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 16px;
`;

const ExportButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(129, 140, 248, 0.1);
  border: 1px solid rgba(129, 140, 248, 0.2);
  color: #818cf8;
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(129, 140, 248, 0.2);
    transform: translateY(-2px);
  }

  @media (max-width: 640px) {
    font-size: 0;
    padding: 10px;
    gap: 0;
  }
`;

const WelcomeSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;



const ProfileImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  aspect-ratio: 1 / 1;
`;

const Greeting = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2.8rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.04em;
  background: linear-gradient(to right, #111827, #334155);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const AvatarContainer = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.03);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(0, 0, 0, 0.08);
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #818cf8;
    .overlay {
      opacity: 1;
    }
  }
`;

const AvatarOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: #111827;
`;

const SubGreeting = styled.p`
  color: #64748b;
  margin: 4px 0 0;
  font-size: 1.1rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`;



const StatIcon = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => props.$color}15;
  color: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatLabel = styled.p`
  color: #94a3b8;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 2px;
`;

const StatValue = styled.h4`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: #111827;

  small {
    font-size: 0.9rem;
    font-weight: 400;
    color: #475569;
    margin-left: 4px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 24px;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 12px;
  
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(0, 0, 0, 0.03);
  }
`;

const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }

  /* Override glass effect with white backgrounds for chart cards */
  .glass {
    background: white !important;
    backdrop-filter: none !important;
    border: 2px solid #000000 !important;
    border-radius: 20px !important;
  }
`;



const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ChartTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

const ChartContent = styled.div`
  height: 300px;
  width: 100%;
`;



const InsightSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InsightBadge = styled.span`
  font-size: 0.7rem;
  font-weight: 800;
  color: #818cf8;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  background: rgba(129, 140, 248, 0.1);
  padding: 4px 8px;
  border-radius: 6px;
  width: fit-content;
`;

const InsightText = styled.p`
  margin: 0;
  color: #94a3b8;
  font-size: 1.1rem;
  line-height: 1.6;

  strong {
    color: #111827;
  }
`;

const QuickAction = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #818cf8;
  font-size: 0.9rem;
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-top: 8px;
  transition: gap 0.2s;

  &:hover {
    gap: 12px;
  }
`;
