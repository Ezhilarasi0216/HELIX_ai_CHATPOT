import React from 'react';
import styled, { keyframes } from 'styled-components';
import { AlertTriangle, Phone, User, X, ShieldAlert } from 'lucide-react';

const alertPulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 20px rgba(239, 68, 68, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
`;

interface Props {
   isOpen: boolean;
   onClose: () => void;
   emergencyContact?: string;
}

export const EmergencySOSModal: React.FC<Props> = ({ isOpen, onClose, emergencyContact }) => {
   if (!isOpen) return null;

   const hotlines = [
      { name: "Vandrevala Foundation", number: "9999666555", desc: "24/7 Crisis Support" },
      { name: "iCall (TISS)", number: "9152987821", desc: "Psychosocial Helpline" },
      { name: "Kiran (Govt)", number: "18005990019", desc: "Mental Health Rehab" }
   ];

   return (
      <Overlay onClick={onClose}>
         <ModalCard onClick={e => e.stopPropagation()}>
            <CloseButton onClick={onClose}><X size={20} /></CloseButton>

            <Header>
               <AlertIcon>
                  <ShieldAlert size={48} />
               </AlertIcon>
               <Title>Healix SOS Buddy</Title>
               <Subtitle>I've detected that you're going through a lot right now. Please know that you are not alone and help is available immediately.</Subtitle>
            </Header>

            <Section>
               <Label>Local Support Hotlines (India)</Label>
               <Grid>
                  {hotlines.map(h => (
                     <CallCard key={h.name} href={`tel:${h.number}`}>
                        <PhoneIcon><Phone size={20} /></PhoneIcon>
                        <CallInfo>
                           <CallName>{h.name}</CallName>
                           <CallDesc>{h.desc}</CallDesc>
                           <CallNumber>{h.number}</CallNumber>
                        </CallInfo>
                     </CallCard>
                  ))}
               </Grid>
            </Section>

            {emergencyContact && (
               <Section>
                  <Label>Your Trusted Contact</Label>
                  <CallCard href={`tel:${emergencyContact}`} style={{ borderColor: '#6366f1', background: 'rgba(99, 102, 241, 0.05)' }}>
                     <PhoneIcon style={{ background: '#6366f1' }}><User size={20} /></PhoneIcon>
                     <CallInfo>
                        <CallName>Trusted Buddy</CallName>
                        <CallDesc>Call your saved emergency number</CallDesc>
                        <CallNumber>{emergencyContact}</CallNumber>
                     </CallInfo>
                  </CallCard>
               </Section>
            )}

            <Footer>
               <OkButton onClick={onClose}>I'm OK now, back to chat</OkButton>
               <PolicyText>Your safety is our priority. These services are confidential and available 24/7.</PolicyText>
            </Footer>
         </ModalCard>
      </Overlay>
   );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #f9fafb;
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
`;

const ModalCard = styled.div`
  background: #09090b;
  border: 2px solid #ef4444;
  border-radius: 28px;
  width: 100%;
  max-width: 550px;
  padding: 40px;
  position: relative;
  box-shadow: 0 0 50px rgba(239, 68, 68, 0.2);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const AlertIcon = styled.div`
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  animation: ${alertPulse} 2s infinite;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 12px;
`;

const Subtitle = styled.p`
  color: #a1a1aa;
  line-height: 1.5;
  font-size: 1rem;
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.h4`
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #71717a;
  margin-bottom: 12px;
`;

const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CallCard = styled.a`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  text-decoration: none;
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.03);
    border-color: #ef4444;
    transform: translateX(4px);
  }
`;

const PhoneIcon = styled.div`
  background: #ef4444;
  color: #111827;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const CallInfo = styled.div`
  flex: 1;
`;

const CallName = styled.div`
  color: #111827;
  font-weight: 600;
  font-size: 1rem;
`;

const CallDesc = styled.div`
  color: #71717a;
  font-size: 0.8rem;
`;

const CallNumber = styled.div`
  color: #ef4444;
  font-size: 0.9rem;
  font-weight: 700;
  margin-top: 2px;
`;

const Footer = styled.div`
  margin-top: 32px;
  text-align: center;
`;

const OkButton = styled.button`
  width: 100%;
  padding: 16px;
  background: #27272a;
  color: #d4d4d8;
  border: none;
  border-radius: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 16px;
  transition: all 0.2s;

  &:hover {
    background: #3f3f46;
    color: #111827;
  }
`;

const PolicyText = styled.p`
  font-size: 0.75rem;
  color: #52525b;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  background: none;
  border: none;
  color: #52525b;
  cursor: pointer;
  &:hover { color: #111827; }
`;
