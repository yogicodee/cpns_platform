export type Category = 'TWK' | 'TIU' | 'TKP';

export interface Question {
  id: string;
  category: Category;
  subCategory: string;
  text: string;
  options: {
    id: string;
    text: string;
    score?: number; // TKP has scores 1-5, others are binary
  }[];
  correctAnswerId?: string; // For TWK and TIU
  explanation: string;
}

export interface UserAnswer {
  questionId: string;
  selectedOptionId: string;
  timeSpent: number; // in seconds
  isCorrect?: boolean;
  score?: number;
}

export interface TryoutSession {
  id: string;
  type: 'SIMULATION' | 'PRACTICE' | 'ADAPTIVE';
  startTime: number;
  endTime?: number;
  questions: Question[];
  answers: Record<string, UserAnswer>;
  status: 'IN_PROGRESS' | 'COMPLETED';
}

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  totalTryouts: number;
  avgScore: Record<Category, number>;
  weakTopics: string[];
  strongTopics: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}
