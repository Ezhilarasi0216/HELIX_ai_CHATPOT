import React from 'react';
import styled from 'styled-components';
import { X, Volume2, Settings2 } from 'lucide-react';

interface VoiceSettingsModalProps {
   isOpen: boolean;
   onClose: () => void;
   voices: SpeechSynthesisVoice[];
   selectedVoiceURI: string;
   onVoiceChange: (uri: string) => void;
   rate: number;
   onRateChange: (rate: number) => void;
   pitch: number;
   onPitchChange: (pitch: number) => void;
}

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({
   isOpen,
   onClose,
   voices,
   selectedVoiceURI,
   onVoiceChange,
   rate,
   onRateChange,
   pitch,
   onPitchChange
}) => {
   if (!isOpen) return null;

   const filteredVoices = voices
      .filter(v => {
         const lang = v.lang.toLowerCase();
         return lang.includes('ta') || lang.includes('en') || lang.includes('ml') || lang.includes('hi');
      })
      .sort((a, b) => {
         const aPower = a.name.includes('Google') || a.name.includes('Online') ? 2 : 0;
         const bPower = b.name.includes('Google') || b.name.includes('Online') ? 2 : 0;
         return bPower - aPower;
      });

   const groupedVoices = filteredVoices.reduce((acc, voice) => {
      const lang = voice.lang.split('-')[0].toLowerCase();
      let groupName = 'Other';
      if (lang === 'en') groupName = 'English';
      else if (lang === 'ta') groupName = 'Tamil';
      else if (lang === 'hi') groupName = 'Hindi';
      else if (lang === 'ml') groupName = 'Malayalam';

      if (!acc[groupName]) acc[groupName] = [];
      acc[groupName].push(voice);
      return acc;
   }, {} as Record<string, SpeechSynthesisVoice[]>);

   const testVoice = (uri: string) => {
      const voice = voices.find(v => v.voiceURI === uri);
      if (voice) {
         window.speechSynthesis.cancel();
         const text = voice.lang.includes('ta') ? "வணக்கம், நான் ஹீலிக்ஸ் . நான் உங்களுக்கு எப்படி உதவ முடியும்?" : "Hello, I am Healix. How can I help you today?";
         const utterance = new SpeechSynthesisUtterance(text);
         utterance.voice = voice;
         utterance.rate = rate;
         utterance.pitch = pitch;
         window.speechSynthesis.speak(utterance);
      }
   };

   return (
      <Overlay onClick={onClose}>
         <ModalContainer onClick={e => e.stopPropagation()}>
            <Header>
               <Title>
                  <Settings2 size={20} />
                  Voice Settings
               </Title>
               <CloseButton onClick={onClose}>
                  <X size={20} />
               </CloseButton>
            </Header>

            <Section>
               <Label>Select Voice</Label>
               <Select
                  value={selectedVoiceURI}
                  onChange={(e) => onVoiceChange(e.target.value)}
               >
                  <option value="">Default (Auto-optimizer)</option>
                  {Object.entries(groupedVoices).map(([lang, langVoices]) => {
                     const voicesArray = langVoices as SpeechSynthesisVoice[];
                     return (
                        <optgroup key={lang} label={lang}>
                           {voicesArray.map(voice => (
                              <option key={voice.voiceURI} value={voice.voiceURI}>
                                 {voice.name}
                              </option>
                           ))}
                        </optgroup>
                     );
                  })}
               </Select>

               {selectedVoiceURI && (
                  <TestButton onClick={() => testVoice(selectedVoiceURI)}>
                     <Volume2 size={16} />
                     Hear Sample
                  </TestButton>
               )}
            </Section>

            <Section>
               <LabelContainer>
                  <Label>Speed (Rate)</Label>
                  <Value>{rate.toFixed(1)}x</Value>
               </LabelContainer>
               <Range
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={rate}
                  onChange={(e) => onRateChange(parseFloat(e.target.value))}
               />
            </Section>

            <Section>
               <LabelContainer>
                  <Label>Pitch</Label>
                  <Value>{pitch.toFixed(1)}</Value>
               </LabelContainer>
               <Range
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={pitch}
                  onChange={(e) => onPitchChange(parseFloat(e.target.value))}
               />
            </Section>

            <InfoBox>
               <Volume2 size={16} />
               <p>Higher speed and natural voices make the conversation feel more real-time.</p>
            </InfoBox>
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
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalContainer = styled.div`
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 24px;
  color: #111827;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.12);
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.03);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s;
  &:hover { color: #111827; }
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const LabelContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  color: #ccc;
  margin-bottom: 8px;
`;

const Value = styled.span`
  color: #6366f1;
  font-weight: 600;
  font-size: 0.9rem;
`;

const Select = styled.select`
  width: 100%;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 10px;
  color: #111827;
  outline: none;
  &:focus { border-color: #6366f1; }
  margin-bottom: 12px;
`;

const TestButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  background: #2a2a2a;
  border: 1px solid #6366f1;
  color: #a5a6f6;
  padding: 10px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(99, 102, 241, 0.1);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const Range = styled.input`
  width: 100%;
  height: 4px;
  background: #444;
  border-radius: 2px;
  outline: none;
  -webkit-appearance: none;
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    background: #6366f1;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
  }
`;

const InfoBox = styled.div`
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  gap: 10px;
  margin-top: 10px;
  p {
    margin: 0;
    font-size: 0.8rem;
    color: #a5a6f6;
    line-height: 1.4;
  }
`;
