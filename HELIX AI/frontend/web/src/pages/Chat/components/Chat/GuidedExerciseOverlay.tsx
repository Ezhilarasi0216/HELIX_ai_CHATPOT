import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { X, Play, RotateCcw } from 'lucide-react';
import { CBTExercise, InteractiveStep } from '../../../../types';

interface Props {
   exercise: CBTExercise;
   onClose: () => void;
   onSpeak: (text: string) => void;
}

export const GuidedExerciseOverlay: React.FC<Props> = ({ exercise, onClose, onSpeak }) => {
   const [currentStepIndex, setCurrentStepIndex] = useState(0);
   const [timeLeft, setTimeLeft] = useState(0);
   const [isFinished, setIsFinished] = useState(false);
   const [isActive, setIsActive] = useState(false);
   const timerRef = useRef<NodeJS.Timeout | null>(null);

   const steps = exercise.interactiveSteps || [];
   const currentStep = steps[currentStepIndex];

   const startExercise = () => {
      setIsActive(true);
      setCurrentStepIndex(0);
      if (steps.length > 0) {
         setTimeLeft(steps[0].duration);
         onSpeak(steps[0].text);
      }
   };

   useEffect(() => {
      if (isActive && !isFinished) {
         timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
               if (prev <= 1) {
                  // Next step logic
                  const nextIndex = currentStepIndex + 1;
                  if (nextIndex < steps.length) {
                     setCurrentStepIndex(nextIndex);
                     onSpeak(steps[nextIndex].text);
                     return steps[nextIndex].duration;
                  } else {
                     setIsFinished(true);
                     setIsActive(false);
                     onSpeak("Great job. You've completed the exercise.");
                     return 0;
                  }
               }
               return prev - 1;
            });
         }, 1000);
      }

      return () => {
         if (timerRef.current) clearInterval(timerRef.current);
      };
   }, [isActive, currentStepIndex, isFinished]);

   return (
      <Overlay>
         <Container>
            <CloseButton onClick={onClose}><X size={24} /></CloseButton>

            {!isActive && !isFinished ? (
               <PrepareState>
                  <Title>{exercise.title}</Title>
                  <Description>{exercise.description}</Description>
                  <StartButton onClick={startExercise}>
                     <Play size={20} fill="white" />
                     Begin Session
                  </StartButton>
               </PrepareState>
            ) : isFinished ? (
               <FinishedState>
                  <BigIcon>✨</BigIcon>
                  <Title>Session Complete</Title>
                  <Description>You took a great step for your mental health.</Description>
                  <ButtonGroup>
                     <ActionButton onClick={startExercise}>
                        <RotateCcw size={18} /> Restart
                     </ActionButton>
                     <ActionButton $primary onClick={onClose}>Done</ActionButton>
                  </ButtonGroup>
               </FinishedState>
            ) : (
               <ActiveState>
                  <VisualGuide $type={currentStep?.type || 'action'}>
                     <InnerCircle />
                     <StepTimer>{timeLeft}s</StepTimer>
                  </VisualGuide>
                  <InstructionText>{currentStep?.text}</InstructionText>
                  <StepCounter>Step {currentStepIndex + 1} of {steps.length}</StepCounter>
               </ActiveState>
            )}
         </Container>
      </Overlay>
   );
};

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  width: 90%;
  max-width: 500px;
  background: #f9fafb;
  border: 1px solid #222;
  border-radius: 32px;
  padding: 40px;
  position: relative;
  text-align: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px; right: 20px;
  background: none; border: none;
  color: #555; cursor: pointer;
  &:hover { color: #111827; }
`;

const Title = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 12px;
  color: #111827;
`;

const Description = styled.p`
  color: #888;
  margin-bottom: 32px;
  line-height: 1.6;
`;

const PrepareState = styled.div`
  padding: 10px 0;
`;

const StartButton = styled.button`
  background: #4f46e5;
  color: #111827;
  border: none;
  padding: 16px 32px;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 auto;
  cursor: pointer;
  transition: transform 0.2s;
  &:hover { transform: scale(1.05); background: #6366f1; }
`;

const ActiveState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const inhale = keyframes`
  0% { transform: scale(0.6); opacity: 0.3; }
  100% { transform: scale(1.2); opacity: 1; }
`;

const exhale = keyframes`
  0% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(0.6); opacity: 0.3; }
`;

const hold = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.6; }
`;

const VisualGuide = styled.div<{ $type: string }>`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: rgba(79, 70, 229, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 40px;
  animation: ${props => {
      if (props.$type === 'inhale') return css`${inhale} 4s ease-in-out infinite`;
      if (props.$type === 'exhale') return css`${exhale} 4s ease-in-out infinite`;
      if (props.$type === 'hold') return css`${hold} 2s ease-in-out infinite`;
      return 'none';
   }};
`;

const InnerCircle = styled.div`
  width: 60%;
  height: 60%;
  border-radius: 50%;
  background: #4f46e5;
  filter: blur(20px);
`;

const StepTimer = styled.div`
  position: absolute;
  font-size: 2.5rem;
  font-weight: 700;
  color: #111827;
`;

const InstructionText = styled.h3`
  font-size: 1.4rem;
  font-weight: 500;
  color: #eee;
  margin-top: 20px;
  min-height: 3.5rem;
`;

const StepCounter = styled.p`
  color: #555;
  font-size: 0.9rem;
  margin-top: 10px;
`;

const FinishedState = styled.div`
  padding: 20px 0;
`;

const BigIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const ActionButton = styled.button<{ $primary?: boolean }>`
  background: ${props => props.$primary ? '#4f46e5' : '#222'};
  color: #111827;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  &:hover { background: ${props => props.$primary ? '#6366f1' : '#333'}; }
`;
