import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Shield, Plus, Trash2, Edit2, Save, X, Heart, Wind, Book } from 'lucide-react';

interface CopingStrategy {
   id: string;
   title: string;
   description: string;
   category: 'distraction' | 'grounding' | 'social' | 'physical';
}

interface WarningSigns {
   thoughts: string[];
   feelings: string[];
   behaviors: string[];
}

export const SafetyPlanPage: React.FC = () => {
   const [warningSign, setWarningSign] = useState('');
   const [warningSigns, setWarningSigns] = useState<WarningSigns>({
      thoughts: [],
      feelings: [],
      behaviors: []
   });
   const [copingStrategies, setCopingStrategies] = useState<CopingStrategy[]>([]);
   const [reasonsToLive, setReasonsToLive] = useState<string[]>([]);
   const [newReason, setNewReason] = useState('');
   const [isAddingStrategy, setIsAddingStrategy] = useState(false);
   const [newStrategy, setNewStrategy] = useState({ title: '', description: '', category: 'distraction' as const });

   const userId = localStorage.getItem('user_id') || 'guest';

   useEffect(() => {
      loadSafetyPlan();
   }, []);

   const loadSafetyPlan = () => {
      const saved = localStorage.getItem(`safety_plan_${userId}`);
      if (saved) {
         const data = JSON.parse(saved);
         setWarningSigns(data.warningSigns || { thoughts: [], feelings: [], behaviors: [] });
         setCopingStrategies(data.copingStrategies || []);
         setReasonsToLive(data.reasonsToLive || []);
      }
   };

   const saveSafetyPlan = () => {
      const data = { warningSigns, copingStrategies, reasonsToLive };
      localStorage.setItem(`safety_plan_${userId}`, JSON.stringify(data));
   };

   useEffect(() => {
      saveSafetyPlan();
   }, [warningSigns, copingStrategies, reasonsToLive]);

   const addWarningSign = (type: keyof WarningSigns) => {
      if (!warningSign.trim()) return;
      setWarningSigns(prev => ({
         ...prev,
         [type]: [...prev[type], warningSign]
      }));
      setWarningSign('');
   };

   const removeWarningSign = (type: keyof WarningSigns, index: number) => {
      setWarningSigns(prev => ({
         ...prev,
         [type]: prev[type].filter((_, i) => i !== index)
      }));
   };

   const addCopingStrategy = () => {
      if (!newStrategy.title.trim()) return;
      setCopingStrategies(prev => [...prev, { ...newStrategy, id: Date.now().toString() }]);
      setNewStrategy({ title: '', description: '', category: 'distraction' });
      setIsAddingStrategy(false);
   };

   const removeCopingStrategy = (id: string) => {
      setCopingStrategies(prev => prev.filter(s => s.id !== id));
   };

   const addReasonToLive = () => {
      if (!newReason.trim()) return;
      setReasonsToLive(prev => [...prev, newReason]);
      setNewReason('');
   };

   const removeReasonToLive = (index: number) => {
      setReasonsToLive(prev => prev.filter((_, i) => i !== index));
   };

   const categoryColors = {
      distraction: '#3b82f6',
      grounding: '#10b981',
      social: '#f59e0b',
      physical: '#ec4899'
   };

   return (
      <Container>
         <Header>
            <TitleSection>
               <Shield size={32} color="#818cf8" />
               <div>
                  <Title>Safety Plan</Title>
                  <Subtitle>Your personalized plan for difficult moments</Subtitle>
               </div>
            </TitleSection>
         </Header>

         <Content>
            <Section>
               <SectionTitle>
                  <Heart size={20} />
                  Reasons to Live
               </SectionTitle>
               <SectionDescription>
                  Things that make life worth living, people you care about, future goals
               </SectionDescription>
               <InputGroup>
                  <Input
                     placeholder="Add a reason to live..."
                     value={newReason}
                     onChange={(e) => setNewReason(e.target.value)}
                     onKeyPress={(e) => e.key === 'Enter' && addReasonToLive()}
                  />
                  <AddButton onClick={addReasonToLive}>
                     <Plus size={18} />
                  </AddButton>
               </InputGroup>
               <ItemsList>
                  {reasonsToLive.map((reason, idx) => (
                     <Item key={idx}>
                        <ItemText>{reason}</ItemText>
                        <DeleteButton onClick={() => removeReasonToLive(idx)}>
                           <Trash2 size={14} />
                        </DeleteButton>
                     </Item>
                  ))}
               </ItemsList>
            </Section>

            <Section>
               <SectionTitle>
                  <Wind size={20} />
                  Coping Strategies
               </SectionTitle>
               <SectionDescription>
                  Healthy ways to cope when you're feeling overwhelmed
               </SectionDescription>

               {!isAddingStrategy ? (
                  <AddStrategyButton onClick={() => setIsAddingStrategy(true)}>
                     <Plus size={18} />
                     Add Coping Strategy
                  </AddStrategyButton>
               ) : (
                  <StrategyForm>
                     <Input
                        placeholder="Strategy title (e.g., Deep breathing)"
                        value={newStrategy.title}
                        onChange={(e) => setNewStrategy({ ...newStrategy, title: e.target.value })}
                     />
                     <TextArea
                        placeholder="Description..."
                        value={newStrategy.description}
                        onChange={(e) => setNewStrategy({ ...newStrategy, description: e.target.value })}
                     />
                     <Select
                        value={newStrategy.category}
                        onChange={(e) => setNewStrategy({ ...newStrategy, category: e.target.value as any })}
                     >
                        <option value="distraction">Distraction</option>
                        <option value="grounding">Grounding</option>
                        <option value="social">Social Support</option>
                        <option value="physical">Physical Activity</option>
                     </Select>
                     <FormActions>
                        <CancelButton onClick={() => setIsAddingStrategy(false)}>
                           <X size={16} />
                           Cancel
                        </CancelButton>
                        <SaveButton onClick={addCopingStrategy}>
                           <Save size={16} />
                           Save
                        </SaveButton>
                     </FormActions>
                  </StrategyForm>
               )}

               <StrategiesList>
                  {copingStrategies.map((strategy) => (
                     <StrategyCard key={strategy.id} $color={categoryColors[strategy.category]}>
                        <StrategyHeader>
                           <StrategyTitle>{strategy.title}</StrategyTitle>
                           <CategoryBadge $color={categoryColors[strategy.category]}>
                              {strategy.category}
                           </CategoryBadge>
                        </StrategyHeader>
                        <StrategyDescription>{strategy.description}</StrategyDescription>
                        <DeleteButton onClick={() => removeCopingStrategy(strategy.id)}>
                           <Trash2 size={14} />
                        </DeleteButton>
                     </StrategyCard>
                  ))}
               </StrategiesList>
            </Section>

            <InfoCard>
               <h4>Using Your Safety Plan</h4>
               <p>
                  When you're feeling overwhelmed, come back to this page. Read your reasons to live,
                  try a coping strategy, and remember that these difficult feelings are temporary.
                  If you need immediate help, contact a helpline or your emergency contact.
               </p>
            </InfoCard>
         </Content>
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
  max-width: 800px;
  margin: 0 auto 40px;
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
`;

const Subtitle = styled.p`
  color: #666;
  margin: 4px 0 0;
`;

const Content = styled.div`
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Section = styled.div`
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  padding: 24px;
`;

const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 8px;
`;

const SectionDescription = styled.p`
  color: #888;
  font-size: 0.9rem;
  margin: 0 0 20px;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  flex: 1;
  background: #222;
  border: 1px solid #333;
  color: #111827;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #818cf8;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  background: #222;
  border: 1px solid #333;
  color: #111827;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 1rem;
  min-height: 80px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #818cf8;
  }
`;

const Select = styled.select`
  width: 100%;
  background: #222;
  border: 1px solid #333;
  color: #111827;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #818cf8;
  }
`;

const AddButton = styled.button`
  background: #818cf8;
  color: #111827;
  border: none;
  padding: 12px 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #6366f1;
  }
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Item = styled.div`
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ItemText = styled.span`
  flex: 1;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 4px;
  transition: all 0.2s;

  &:hover {
    color: #dc2626;
  }
`;

const AddStrategyButton = styled.button`
  width: 100%;
  background: rgba(129, 140, 248, 0.1);
  border: 1px dashed rgba(129, 140, 248, 0.3);
  color: #818cf8;
  padding: 16px;
  border-radius: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 20px;

  &:hover {
    background: rgba(129, 140, 248, 0.15);
  }
`;

const StrategyForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
`;

const FormActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const CancelButton = styled.button`
  background: transparent;
  border: 1px solid #333;
  color: #111827;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.03);
  }
`;

const SaveButton = styled.button`
  background: #10b981;
  color: #111827;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #059669;
  }
`;

const StrategiesList = styled.div`
  display: grid;
  gap: 16px;
`;

const StrategyCard = styled.div<{ $color: string }>`
  background: rgba(0, 0, 0, 0.03);
  border-left: 4px solid ${props => props.$color};
  border-radius: 12px;
  padding: 16px;
  position: relative;
`;

const StrategyHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const StrategyTitle = styled.h4`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
`;

const CategoryBadge = styled.span<{ $color: string }>`
  background: ${props => props.$color}20;
  color: ${props => props.$color};
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
`;

const StrategyDescription = styled.p`
  margin: 0;
  color: #aaa;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const InfoCard = styled.div`
  background: rgba(129, 140, 248, 0.05);
  border: 1px solid rgba(129, 140, 248, 0.2);
  border-radius: 16px;
  padding: 20px;

  h4 {
    margin: 0 0 10px;
    color: #818cf8;
    font-size: 0.9rem;
    text-transform: uppercase;
  }

  p {
    margin: 0;
    color: #888;
    font-size: 0.9rem;
    line-height: 1.6;
  }
`;
