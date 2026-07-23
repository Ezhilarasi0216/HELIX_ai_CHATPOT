import React, { createContext, useContext, useState, ReactNode } from 'react';
import { EmotionState, EmotionHistoryEntry, ChatMessage, INITIAL_EMOTIONS } from '../types';

interface EmotionContextType {
   emotions: EmotionState;
   emotionHistory: EmotionHistoryEntry[];
   messages: ChatMessage[];
   sessionId: string | null;
   setEmotions: (emotions: EmotionState) => void;
   addMessage: (message: ChatMessage) => void;
   setMessages: (messages: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void;
   updateMessage: (id: string, content: string) => void;
   updateEmotions: (newEmotions: EmotionState) => void;
   setSessionId: (id: string | null) => void;
   resetChat: () => void;
   isSOSOpen: boolean;
   setIsSOSOpen: (open: boolean) => void;
   isTamilMode: boolean;
   setIsTamilMode: (isTamil: boolean) => void;
   user: any;
   wellnessScore: number;
   setWellnessScore: (score: number) => void;
   refreshUser: () => void;
}

const EmotionContext = createContext<EmotionContextType | undefined>(undefined);

export const EmotionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
   const [emotions, setEmotions] = useState<EmotionState>(INITIAL_EMOTIONS);
   const [emotionHistory, setEmotionHistory] = useState<EmotionHistoryEntry[]>([]);
   const [messages, setMessages] = useState<ChatMessage[]>([]);
   const [sessionId, setSessionId] = useState<string | null>(null);
   const [isSOSOpen, setIsSOSOpen] = useState(false);
   const [isTamilMode, setIsTamilMode] = useState(false);
   const [user, setUser] = useState<any>(JSON.parse(localStorage.getItem('user') || '{}'));
   const [wellnessScore, setWellnessScore] = useState<number>(Number(localStorage.getItem('wellness_score') || '0'));

   const refreshUser = () => {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(userData);
      setWellnessScore(Number(localStorage.getItem('wellness_score') || '0'));
   };

   const addMessage = (message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
   };

   const setMessagesList = (newMessages: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => {
      setMessages(newMessages);
   };

   const updateMessage = (id: string, content: string) => {
      setMessages(prev => prev.map(m => m.id === id ? { ...m, content } : m));
   };

   const updateEmotions = (newEmotions: EmotionState) => {
      setEmotions(newEmotions);
      setEmotionHistory(prev => {
         const newHistory = [...prev, { timestamp: Date.now(), emotions: newEmotions }];
         return newHistory.slice(-20); // Keep last 20
      });
   };

   const resetChat = () => {
      setMessages([]);
      setSessionId(null);
      setEmotions(INITIAL_EMOTIONS);
   };

   return (
      <EmotionContext.Provider value={{
         emotions, emotionHistory, messages, sessionId,
         setEmotions, addMessage, setMessages: setMessagesList,
         updateMessage, updateEmotions, setSessionId, resetChat,
         isSOSOpen, setIsSOSOpen, isTamilMode, setIsTamilMode,
         user, wellnessScore, setWellnessScore, refreshUser
      }}>
         {children}
      </EmotionContext.Provider>
   );
};

export const useEmotion = () => {
   const context = useContext(EmotionContext);
   if (!context) {
      throw new Error('useEmotion must be used within an EmotionProvider');
   }
   return context;
};
