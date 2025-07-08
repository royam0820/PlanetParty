export interface GameState {
  currentGame: string | null;
  score: number;
  level: number;
  completedChallenges: number;
  currentStreak: number;
  badges: string[];
  gameActive: boolean;
  timer: NodeJS.Timeout | null;
}

export interface WasteItem {
  id: string;
  name: string;
  emoji: string;
  type: 'plastic' | 'glass' | 'organic' | 'paper' | 'metal';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface TrueFalseQuestion {
  id: string;
  statement: string;
  answer: boolean;
  explanation: string;
}

export interface GameResult {
  gameType: string;
  score: number;
  timeSpent: number;
  correct: number;
  total: number;
}

export interface UserProgress {
  totalScore: number;
  level: number;
  completedChallenges: number;
  currentStreak: number;
  badges: string[];
  lastPlayed: Date;
}
