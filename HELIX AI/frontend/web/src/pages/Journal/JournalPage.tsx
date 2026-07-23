import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Book, Send, Sparkles, History, Calendar, Trash2 } from 'lucide-react';
import { JournalEntry } from '../../types';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const JournalPage: React.FC = () => {
   const [content, setContent] = useState('');
   const [entries, setEntries] = useState<JournalEntry[]>([]);
   const [isSaving, setIsSaving] = useState(false);
   const [latestInsight, setLatestInsight] = useState<string | null>(null);
   const user = JSON.parse(localStorage.getItem('user') || '{}');

   useEffect(() => {
      fetchEntries();
   }, [user.user_id]);

   const fetchEntries = async () => {
      if (!user.user_id) return;
      try {
         const response = await fetch(`http://127.0.0.1:8003/journal/${user.user_id}`);
         if (response.ok) {
            const data = await response.json();
            setEntries(data.entries);
         }
      } catch (error) {
         console.error("Failed to fetch journal entries", error);
      }
   };

   const handleSave = async () => {
      if (!content.trim() || !user.user_id) return;
      setIsSaving(true);
      try {
         const response = await fetch('http://127.0.0.1:8003/journal/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               user_id: user.user_id,
               content: content
            })
         });

         if (response.ok) {
            const data = await response.json();
            setLatestInsight(data.ai_insight);
            setContent('');
            fetchEntries();
         }
      } catch (error) {
         console.error("Failed to save journal entry", error);
      } finally {
         setIsSaving(false);
      }
   };

   return (
      <Container>
         <Header>
            <TitleSection>
               <IconWrapper><Book size={28} /></IconWrapper>
               <div>
                  <Title>Healix Journal</Title>
                  <Subtitle>Write your thoughts, discover your growth</Subtitle>
               </div>
            </TitleSection>
         </Header>

         <ContentGrid>
            <EditorSection>
               <GlassCard>
                  <CardLabel>How are you feeling today?</CardLabel>
                  <TextArea
                     placeholder="Start writing..."
                     value={content}
                     onChange={(e) => setContent(e.target.value)}
                  />
                  <ActionRow>
                     <CharacterCount>{content.length} characters</CharacterCount>
                     <SaveButton
                        onClick={handleSave}
                        disabled={isSaving || !content.trim()}
                     >
                        {isSaving ? 'Analyzing...' : (
                           <>
                              Analyze & Save <Send size={16} />
                           </>
                        )}
                     </SaveButton>
                  </ActionRow>
               </GlassCard>

               {latestInsight && (
                  <InsightCard>
                     <SparklesIcon><Sparkles size={20} /></SparklesIcon>
                     <div>
                        <InsightLabel>AI Insight</InsightLabel>
                        <InsightText>{latestInsight}</InsightText>
                     </div>
                  </InsightCard>
               )}
            </EditorSection>

            <HistorySection>
               <SectionTitle>
                  <History size={18} /> Past Reflections
               </SectionTitle>
               <ScrollArea>
                  {entries.length > 0 ? entries.map((entry) => (
                     <EntryCard key={entry.id}>
                        <EntryHeader>
                           <DateRow>
                              <Calendar size={14} />
                              {new Date(entry.timestamp).toLocaleDateString(undefined, {
                                 weekday: 'short',
                                 year: 'numeric',
                                 month: 'short',
                                 day: 'numeric'
                              })}
                           </DateRow>
                        </EntryHeader>
                        <EntryContent>{entry.content}</EntryContent>
                        {entry.ai_insight && (
                           <EntryInsight>
                              <Sparkles size={12} color="#818cf8" />
                              {entry.ai_insight}
                           </EntryInsight>
                        )}
                     </EntryCard>
                  )) : (
                     <EmptyState>
                        <Book size={48} color="#222" />
                        <p>No journal entries yet. Your reflections will appear here.</p>
                     </EmptyState>
                  )}
               </ScrollArea>
            </HistorySection>
         </ContentGrid>
      </Container>
   );
};

// Styled Components
const Container = styled.div`
  flex: 1;
  background: #ffffff;
  color: #111827;
  padding: 40px;
  overflow-y: auto;
  height: 100vh;
  animation: ${fadeIn} 0.5s ease-out;
`;

const Header = styled.header`
  max-width: 1200px;
  margin: 0 auto 40px;
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const IconWrapper = styled.div`
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  padding: 12px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 16px rgba(99, 102, 241, 0.2);
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(to right, #fff, #a1a1aa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  color: #71717a;
  margin: 4px 0 0;
  font-size: 1rem;
`;

const ContentGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const EditorSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const GlassCard = styled.div`
  background: rgba(0, 0, 0, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 24px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
`;

const CardLabel = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #e4e4e7;
`;

const TextArea = styled.textarea`
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  padding: 20px;
  color: #111827;
  font-size: 1.1rem;
  line-height: 1.6;
  min-height: 300px;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #6366f1;
    background: #f3f4f6;
  }
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CharacterCount = styled.span`
  color: #52525b;
  font-size: 0.9rem;
`;

const SaveButton = styled.button`
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: #111827;
  border: none;
  padding: 12px 28px;
  border-radius: 14px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const InsightCard = styled.div`
  margin-top: 24px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  gap: 16px;
  animation: ${fadeIn} 0.5s ease-out;
`;

const SparklesIcon = styled.div`
  color: #a78bfa;
`;

const InsightLabel = styled.h4`
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #818cf8;
  margin: 0 0 4px;
`;

const InsightText = styled.p`
  font-size: 1.1rem;
  color: #f4f4f5;
  margin: 0;
  font-style: italic;
`;

const HistorySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.2rem;
  color: #a1a1aa;
`;

const ScrollArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #27272a;
    border-radius: 10px;
  }
`;

const EntryCard = styled.div`
  background: #09090b;
  border: 1px solid #27272a;
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #3f3f46;
    transform: translateX(4px);
  }
`;

const EntryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const DateRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #71717a;
  font-size: 0.85rem;
`;

const EntryContent = styled.p`
  color: #d4d4d8;
  line-height: 1.6;
  margin: 0 0 16px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const EntryInsight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #818cf8;
  font-size: 0.9rem;
  font-style: italic;
  padding-top: 12px;
  border-top: 1px solid #18181b;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  text-align: center;
  background: #09090b;
  border: 2px dashed #18181b;
  border-radius: 20px;
  color: #52525b;
  gap: 16px;
`;
