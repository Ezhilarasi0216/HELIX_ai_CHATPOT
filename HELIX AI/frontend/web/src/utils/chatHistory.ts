import { ChatMessage } from '../types';

export interface ChatSession {
   id: string;
   title: string;
   messages: ChatMessage[];
   createdAt: number;
   updatedAt: number;
}

export interface GroupedSessions {
   title: string;
   chats: ChatSession[];
}

const STORAGE_KEY = 'chat_sessions';
const CURRENT_SESSION_KEY = 'current_session_id';

// Generate a unique session ID
export const generateSessionId = (): string => {
   return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Generate title from first user message
export const generateChatTitle = (messages: ChatMessage[]): string => {
   const firstUserMessage = messages.find(m => m.role === 'user');
   if (!firstUserMessage) return 'New Chat';

   const title = firstUserMessage.content.trim();
   return title.length > 30 ? title.substring(0, 30) + '...' : title;
};

// Save chat session to localStorage
export const saveChatSession = (sessionId: string, messages: ChatMessage[]): void => {
   try {
      const sessions = getAllChatSessions();
      const existingIndex = sessions.findIndex(s => s.id === sessionId);

      const session: ChatSession = {
         id: sessionId,
         title: generateChatTitle(messages),
         messages,
         createdAt: existingIndex >= 0 ? sessions[existingIndex].createdAt : Date.now(),
         updatedAt: Date.now()
      };

      if (existingIndex >= 0) {
         sessions[existingIndex] = session;
      } else {
         sessions.unshift(session); // Add to beginning
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
      localStorage.setItem(CURRENT_SESSION_KEY, sessionId);
   } catch (error) {
      console.error('Failed to save chat session:', error);
   }
};

// Get all chat sessions
export const getAllChatSessions = (): ChatSession[] => {
   try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
   } catch (error) {
      console.error('Failed to load chat sessions:', error);
      return [];
   }
};

// Get specific chat session
export const getChatSession = (sessionId: string): ChatSession | null => {
   const sessions = getAllChatSessions();
   return sessions.find(s => s.id === sessionId) || null;
};

// Delete chat session
export const deleteChatSession = (sessionId: string): void => {
   try {
      const sessions = getAllChatSessions();
      const filtered = sessions.filter(s => s.id !== sessionId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
   } catch (error) {
      console.error('Failed to delete chat session:', error);
   }
};

// Get current session ID
export const getCurrentSessionId = (): string | null => {
   return localStorage.getItem(CURRENT_SESSION_KEY);
};

// Set current session ID
export const setCurrentSessionId = (sessionId: string): void => {
   localStorage.setItem(CURRENT_SESSION_KEY, sessionId);
};

// Group sessions by date
export const groupSessionsByDate = (sessions: ChatSession[]): GroupedSessions[] => {
   const now = new Date();
   const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
   const yesterday = today - 24 * 60 * 60 * 1000;
   const lastWeek = today - 7 * 24 * 60 * 60 * 1000;

   const groups: GroupedSessions[] = [
      { title: 'Today', chats: [] },
      { title: 'Yesterday', chats: [] },
      { title: 'Last Week', chats: [] },
      { title: 'Older', chats: [] }
   ];

   sessions.forEach(session => {
      const sessionDate = new Date(session.updatedAt).setHours(0, 0, 0, 0);

      if (sessionDate >= today) {
         groups[0].chats.push(session);
      } else if (sessionDate >= yesterday) {
         groups[1].chats.push(session);
      } else if (sessionDate >= lastWeek) {
         groups[2].chats.push(session);
      } else {
         groups[3].chats.push(session);
      }
   });

   // Filter out empty groups
   return groups.filter(g => g.chats.length > 0);
};
