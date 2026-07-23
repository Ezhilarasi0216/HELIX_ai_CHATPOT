import React from 'react';
import styled from 'styled-components';
import { Send, Mic, MicOff, Plus, AudioLines, Settings2, ArrowUp } from 'lucide-react';

interface Props {
  input: string;
  setInput: (val: string) => void;
  onSend: () => void;
  isLoading: boolean;
  isListening: boolean;
  toggleListening: () => void;
  isTamilMode: boolean;
  toggleLanguage: () => void;
  hasRecognition: boolean;
  toggleCommandMenu: () => void;
  isVoiceMode: boolean;
  toggleVoiceMode: () => void;
  isSpeaking: boolean;
  transcript: string;
  openVoiceSettings: () => void;
}

export const ChatInput: React.FC<Props> = ({
  input, setInput, onSend, isLoading,
  isListening, toggleListening,
  isTamilMode, toggleLanguage,
  hasRecognition, toggleCommandMenu,
  isVoiceMode, toggleVoiceMode,
  isSpeaking, transcript,
  openVoiceSettings
}) => {
  return (
    <Container>
      {isVoiceMode && (
        <VoiceStatus>
          <WaveformContainer>
            <Wave $active={isListening || isSpeaking} $delay="0s" />
            <Wave $active={isListening || isSpeaking} $delay="0.2s" />
            <Wave $active={isListening || isSpeaking} $delay="0.4s" />
            <Wave $active={isListening || isSpeaking} $delay="0.6s" />
            <Wave $active={isListening || isSpeaking} $delay="0.8s" />
          </WaveformContainer>
          {transcript && isListening && (
            <VoiceTranscript>"{transcript}"</VoiceTranscript>
          )}
          {isSpeaking && (
            <VoiceTranscript>Healix AI is speaking...</VoiceTranscript>
          )}
        </VoiceStatus>
      )}
      <InputWrapper>
        <IconButton $isPlus onClick={toggleCommandMenu} title="Open Commands (Ctrl+K)">
          <Plus size={22} />
        </IconButton>

        <StyledInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSend()}
          placeholder="Ask anything"
          disabled={isLoading}
        />

        <Controls>
          <WaveformButton onClick={toggleVoiceMode} $active={isVoiceMode} title="Voice Conversation Mode">
            <AudioLines size={20} />
          </WaveformButton>
          {isVoiceMode && (
            <IconButton onClick={openVoiceSettings} title="Voice Settings">
              <Settings2 size={20} />
            </IconButton>
          )}
          {input.trim() && !isVoiceMode && (
            <SendButton onClick={onSend} disabled={isLoading} title="Send Message">
              <ArrowUp size={20} />
            </SendButton>
          )}
        </Controls>
      </InputWrapper>
    </Container>
  );
};

const Notice = styled.p`
  text-align: center;
  font-size: 0.75rem;
  color: #4a5568;
  margin-top: 12px;
`;

const Container = styled.div`
  padding: 24px;
`;

const InputWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 24px;
  padding: 8px 16px;
  border: 2px solid #000000;
  transition: all 0.3s;

  &:focus-within {
    background: #ffffff;
    border-color: #000000;
    box-shadow: 0 4px 25px rgba(0, 0, 0, 0.05);
  }
`;

const StyledInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  padding: 12px 16px;
  font-size: 1rem;
  color: #111827;
  outline: none;

  &::placeholder {
    color: #9ca3af;
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const IconButton = styled.button<{ $active?: boolean; $isPlus?: boolean }>`
  background: transparent;
  border: none;
  color: ${props => props.$isPlus ? '#111827' : (props.$active ? '#ef4444' : '#4b5563')};
  padding: 8px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  opacity: 0.8;

  &:hover {
    opacity: 1;
    color: ${props => props.$active ? '#dc2626' : '#111827'};
  }
`;

const WaveformButton = styled.button<{ $active?: boolean }>`
  background: ${props => props.$active ? '#ef4444' : '#ffffff'};
  color: ${props => props.$active ? '#ffffff' : '#000000'};
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  ${props => props.$active && `
    animation: pulse 1.5s infinite;
  `}

  &:hover {
    background: ${props => props.$active ? '#dc2626' : '#f1f5f9'};
    transform: scale(1.05);
  }

  @keyframes pulse {
    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
    70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
  }
`;

const SendButton = styled.button`
  background: #111827;
  color: #ffffff;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    background: #f1f5f9;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  &:disabled {
    background: #404040;
    color: #a3a3a3;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const LanguageBadge = styled.div<{ $isTamil: boolean }>`
  font-size: 0.7rem;
  font-weight: 700;
  padding: 6px 10px;
  background: #cbd5e1;
  color: #1f1f1f;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  
  &:hover {
    background: #e2e8f0;
  }
`;

const VoiceStatus = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const WaveformContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  height: 30px;
`;

const Wave = styled.div<{ $active: boolean; $delay: string }>`
  width: 3px;
  height: 10px;
  background: #ffffff;
  border-radius: 2px;
  opacity: 0.5;
  ${props => props.$active && `
    animation: integrated-pulse 1.0s ease-in-out infinite;
    animation-delay: ${props.$delay};
  `}

  @keyframes integrated-pulse {
    0%, 100% { height: 10px; opacity: 0.5; }
    50% { height: 30px; opacity: 1; }
  }
`;

const VoiceTranscript = styled.p`
  color: #4b5563;
  font-size: 0.9rem;
  font-style: italic;
  text-align: center;
  max-width: 80%;
`;





