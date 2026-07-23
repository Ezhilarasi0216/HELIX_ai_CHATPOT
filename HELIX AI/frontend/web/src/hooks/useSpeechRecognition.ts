import { useState, useEffect, useRef } from 'react';

interface SpeechRecognitionHook {
   isListening: boolean;
   transcript: string;
   startListening: (lang?: string) => void;
   stopListening: () => void;
   resetTranscript: () => void;
   hasRecognition: boolean;
}

export const useSpeechRecognition = (): SpeechRecognitionHook => {
   const [isListening, setIsListening] = useState(false);
   const [transcript, setTranscript] = useState('');
   const recognitionRef = useRef<any>(null);

   useEffect(() => {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
         const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
         recognitionRef.current = new SpeechRecognition();
         recognitionRef.current.continuous = true;
         recognitionRef.current.interimResults = true;
         // recognitionRef.current.lang = 'en-US'; // Removed to allow system default / auto-detect behavior

         recognitionRef.current.onresult = (event: any) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
               if (event.results[i].isFinal) {
                  finalTranscript += event.results[i][0].transcript;
               } else {
                  // Optional: handle interim if needed, but for now we focus on final
                  // setTranscript(prev => prev + event.results[i][0].transcript); 
               }
            }
            // Simple append for now. A robust impl might handle interim better.
            // Actually, let's just grab the latest interim/final text.
            const currentTracking = Array.from(event.results)
               .map((result: any) => result[0].transcript)
               .join('');
            setTranscript(currentTracking);
         };

         recognitionRef.current.onerror = (event: any) => {
            // Filter out benign errors that are part of normal operation
            if (event.error === 'no-speech') {
               // No speech detected - this is normal, just restart
               console.log('No speech detected, will restart listening');
               setIsListening(false);
               return;
            }
            if (event.error === 'aborted') {
               // Aborted intentionally - this is normal
               console.log('Speech recognition aborted');
               setIsListening(false);
               return;
            }
            // Only log actual errors
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
         };

         recognitionRef.current.onend = () => {
            setIsListening(false);
         };
      }
   }, []);

   const startListening = (lang?: string) => {
      if (recognitionRef.current) {
         try {
            // Always abort first to prevent "already started" errors
            if (isListening) {
               recognitionRef.current.abort();
            }
            if (lang) recognitionRef.current.lang = lang;
            else recognitionRef.current.lang = ''; // Reset to auto
            recognitionRef.current.start();
            setIsListening(true);
         } catch (e) {
            console.error(e);
         }
      }
   };

   const stopListening = () => {
      if (recognitionRef.current && isListening) {
         try {
            recognitionRef.current.stop();
            setIsListening(false);
         } catch (e) {
            console.error(e);
         }
      }
   };

   const resetTranscript = () => setTranscript('');

   return {
      isListening,
      transcript,
      startListening,
      stopListening,
      resetTranscript,
      hasRecognition: !!recognitionRef.current
   };
};
