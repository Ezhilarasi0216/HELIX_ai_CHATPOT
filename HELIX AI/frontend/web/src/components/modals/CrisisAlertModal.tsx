import React, { useState } from 'react';
import styled from 'styled-components';
import { X, Phone, Heart, Wind, MessageCircle, AlertCircle } from 'lucide-react';

interface CrisisData {
   severity: 'critical' | 'high' | 'medium' | 'low';
   confidence: number;
   triggers: string[];
   recommended_actions: string[];
   helpline_numbers: Array<{
      name: string;
      number: string;
      available: string;
      languages: string[];
   }>;
   message: string;
}

interface CrisisAlertModalProps {
   isOpen: boolean;
   onClose: () => void;
   crisisData: CrisisData;
   onStartBreathing: () => void;
}

export const CrisisAlertModal: React.FC<CrisisAlertModalProps> = ({
   isOpen,
   onClose,
   crisisData,
   onStartBreathing
}) => {
   const [calling, setCalling] = useState(false);

   if (!isOpen) return null;

   const handleCall = (number: string) => {
      setCalling(true);
      window.location.href = `tel:${number}`;
      setTimeout(() => setCalling(false), 2000);
   };

   const isCritical = crisisData.severity === 'critical' || crisisData.severity === 'high';

   return (
      <Overlay>
         <ModalContainer $severity={crisisData.severity}>
            <Header>
               <IconWrapper $severity={crisisData.severity}>
                  <Heart size={32} />
               </IconWrapper>
               <CloseButton onClick={onClose}>
                  <X size={20} />
               </CloseButton>
            </Header>

            <Content>
               <Title>{crisisData.message}</Title>

               {isCritical && (
                  <UrgentBanner>
                     <AlertCircle size={18} />
                     <span>உடனடி உதவி தேவை / Immediate Help Available</span>
                  </UrgentBanner>
               )}

               <Section>
                  <SectionTitle>
                     <Phone size={18} />
                     24/7 Helpline Numbers
                  </SectionTitle>
                  <HelplineList>
                     {crisisData.helpline_numbers.map((helpline, idx) => (
                        <HelplineCard key={idx}>
                           <HelplineInfo>
                              <HelplineName>{helpline.name}</HelplineName>
                              <HelplineNumber>{helpline.number}</HelplineNumber>
                              <HelplineMeta>
                                 {helpline.available} • {helpline.languages.join(', ')}
                              </HelplineMeta>
                           </HelplineInfo>
                           <CallButton
                              onClick={() => handleCall(helpline.number)}
                              disabled={calling}
                           >
                              <Phone size={16} />
                              {calling ? 'Calling...' : 'Call Now'}
                           </CallButton>
                        </HelplineCard>
                     ))}
                  </HelplineList>
               </Section>

               <QuickActions>
                  <ActionButton onClick={onStartBreathing} $variant="breathing">
                     <Wind size={18} />
                     Breathing Exercise
                  </ActionButton>
                  <ActionButton onClick={onClose} $variant="ok">
                     I'm OK
                  </ActionButton>
               </QuickActions>

               <SafetyNote>
                  <MessageCircle size={16} />
                  <p>
                     நீங்க தனியா இல்லை. உங்க உணர்வுகள் முக்கியம். தயவுசெய்து யாராவது ஒருவரிடம் பேசுங்க.
                     <br />
                     <em>You're not alone. Your feelings matter. Please reach out to someone.</em>
                  </p>
               </SafetyNote>
            </Content>
         </ModalContainer>
      </Overlay>
   );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContainer = styled.div<{ $severity: string }>`
  background: ${props =>
      props.$severity === 'critical' ? 'linear-gradient(135deg, #1a0a0a 0%, #2d1515 100%)' :
         props.$severity === 'high' ? 'linear-gradient(135deg, #1a1010 0%, #2d2020 100%)' :
            'linear-gradient(135deg, #0a0a1a 0%, #151525 100%)'
   };
  border: 2px solid ${props =>
      props.$severity === 'critical' ? 'rgba(239, 68, 68, 0.5)' :
         props.$severity === 'high' ? 'rgba(251, 146, 60, 0.5)' :
            'rgba(129, 140, 248, 0.3)'
   };
  border-radius: 24px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  color: #111827;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
  animation: slideUp 0.4s ease;

  @keyframes slideUp {
    from { 
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0;
`;

const IconWrapper = styled.div<{ $severity: string }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props =>
      props.$severity === 'critical' ? 'rgba(239, 68, 68, 0.2)' :
         props.$severity === 'high' ? 'rgba(251, 146, 60, 0.2)' :
            'rgba(129, 140, 248, 0.2)'
   };
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props =>
      props.$severity === 'critical' ? '#ef4444' :
         props.$severity === 'high' ? '#fb923c' :
            '#818cf8'
   };
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 8px;
  transition: color 0.2s;
  &:hover { color: #111827; }
`;

const Content = styled.div`
  padding: 24px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 20px;
  line-height: 1.4;
  text-align: center;
`;

const UrgentBanner = styled.div`
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #fca5a5;
  font-weight: 600;
  margin-bottom: 24px;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 16px;
  color: #ddd;
`;

const HelplineList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const HelplineCard = styled.div`
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    transform: translateY(-2px);
  }
`;

const HelplineInfo = styled.div`
  flex: 1;
`;

const HelplineName = styled.div`
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 4px;
`;

const HelplineNumber = styled.div`
  font-size: 1.1rem;
  color: #818cf8;
  font-weight: 700;
  margin-bottom: 4px;
`;

const HelplineMeta = styled.div`
  font-size: 0.8rem;
  color: #888;
`;

const CallButton = styled.button`
  background: #10b981;
  color: #111827;
  border: none;
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: #059669;
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
`;

const ActionButton = styled.button<{ $variant: string }>`
  background: ${props =>
      props.$variant === 'breathing' ? 'rgba(59, 130, 246, 0.2)' :
         'rgba(34, 197, 94, 0.2)'
   };
  border: 1px solid ${props =>
      props.$variant === 'breathing' ? 'rgba(59, 130, 246, 0.4)' :
         'rgba(34, 197, 94, 0.4)'
   };
  color: #111827;
  padding: 14px;
  border-radius: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props =>
      props.$variant === 'breathing' ? 'rgba(59, 130, 246, 0.3)' :
         'rgba(34, 197, 94, 0.3)'
   };
    transform: translateY(-2px);
  }
`;

const SafetyNote = styled.div`
  background: rgba(129, 140, 248, 0.1);
  border: 1px solid rgba(129, 140, 248, 0.2);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  gap: 12px;
  align-items: flex-start;

  p {
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.6;
    color: #ccc;

    em {
      color: #999;
      font-style: italic;
      font-size: 0.85rem;
    }
  }
`;
