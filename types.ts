export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  startingCode: string;
  hints: string[];
}

export interface EvaluationResult {
  isCorrect: boolean;
  score: number; // 0 to 100
  feedback: string;
  optimizedCode: string;
  reasoning: string;
}

export interface Topic {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export enum AppState {
  IDLE = 'IDLE',
  GENERATING_PROBLEM = 'GENERATING_PROBLEM',
  SOLVING = 'SOLVING',
  EVALUATING = 'EVALUATING',
  REVIEWING = 'REVIEWING',
}
