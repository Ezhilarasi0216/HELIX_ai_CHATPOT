export interface EmotionState {
  Joy: number;
  Trust: number;
  Fear: number;
  Surprise: number;
  Sadness: number;
  Disgust: number;
  Anger: number;
  Anticipation: number;
}

export type EmotionKey = keyof EmotionState;

export interface EmotionHistoryEntry {
  timestamp: number;
  emotions: EmotionState;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  reasoning_details?: any; // OpenRouter reasoning output
  emotions?: EmotionState; // The detected emotion for this specific turn
  isAudio?: boolean; // Was this a voice interaction?
}

export interface CrisisAlertState {
  active: boolean;
  severity: 'low' | 'medium' | 'high';
  message: string;
}

export interface InteractiveStep {
  text: string;
  duration: number; // seconds
  type?: 'inhale' | 'hold' | 'exhale' | 'action';
}

export interface CBTExercise {
  id: string;
  title: string;
  description: string;
  steps: string[];
  interactiveSteps?: InteractiveStep[];
  targetEmotion: EmotionKey;
  minIntensity: number; // 1-5 scale
}

export const INITIAL_EMOTIONS: EmotionState = {
  Joy: 0,
  Trust: 0,
  Fear: 0,
  Surprise: 0,
  Sadness: 0,
  Disgust: 0,
  Anger: 0,
  Anticipation: 0
};

export interface JournalEntry {
  id: string;
  content: string;
  timestamp: number;
  ai_insight?: string;
}