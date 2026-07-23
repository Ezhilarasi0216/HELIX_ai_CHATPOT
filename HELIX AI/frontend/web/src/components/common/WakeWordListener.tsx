import React, { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';

export const WakeWordListener: React.FC = () => {
   const navigate = useNavigate();
   const location = useLocation();
   const { isListening, transcript, startListening, stopListening, resetTranscript } = useSpeechRecognition();

   const WAKE_WORDS = ['hey healix', 'healix', 'hay healix', 'hi healix', 'hey helix', 'hey heelix'];

   const handleWakeWordDetection = useCallback((text: string) => {
      const lowerText = text.toLowerCase();
      const detected = WAKE_WORDS.some(word => lowerText.includes(word));

      if (detected) {
         console.log('Wake word detected: Hey Healix');
         resetTranscript();
         stopListening();

         // Navigate to chat with voice mode auto-enabled
         if (location.pathname !== '/chat') {
            navigate('/chat?voice=true');
         }
      }
   }, [navigate, location.pathname, resetTranscript, stopListening]);

   // Continuous listening logic
   useEffect(() => {
      // Don't run the background wake-word listener if we're already on the chat page
      // to avoid conflicts with the Chat window's own speech recognition.
      if (location.pathname === '/chat') {
         if (isListening) stopListening();
         return;
      }

      const timer = setInterval(() => {
         if (!isListening) {
            startListening('en-US'); // Wake word primarily en-US for now
         }
      }, 1000);

      return () => clearInterval(timer);
   }, [location.pathname, isListening, startListening, stopListening]);

   // Monitor transcript for wake word
   useEffect(() => {
      if (transcript) {
         handleWakeWordDetection(transcript);
      }
   }, [transcript, handleWakeWordDetection]);

   return null; // Side-effect only component
};
