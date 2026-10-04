export type ThemeMode = 'dark' | 'light';

export interface StudentProfile {
  name: string;
  avatar: string;
  university: string;
  major: string;
  year: string;
  semester: string;
  streakDays: number;
  studyHoursThisWeek: number;
  topicsCompleted: number;
  quizAccuracyPercentage: number;
  codingProblemsSolved: number;
}

export interface WeakTopic {
  id: string;
  subject: string;
  topic: string;
  accuracy: number; // e.g. 42
  lastPracticed: string;
  recommendedTimeMinutes: number;
  relatedMaterialId?: string;
}

export interface StrongTopic {
  id: string;
  subject: string;
  topic: string;
  accuracy: number;
}

export interface TodayFocusItem {
  id: string;
  title: string;
  subject: string;
  priority: 'high' | 'medium' | 'low';
  dueText: string;
  recommendedMinutes: number;
  targetRoute: string;
  topic: string;
  actionText: string;
}

export interface NextBestMove {
  id: string;
  title: string;
  reason: string;
  targetMinutes: number;
  targetSubject: string;
  targetTopic: string;
  targetRoute: string;
  targetAccuracy?: number;
  actionText: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  subject: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  content: string;
  chunksCount: number;
  topicsCovered: string[];
}

export type StudyMode = 'ask' | 'teach' | 'quiz' | 'stuck';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  mode?: StudyMode;
  isStreaming?: boolean;
  sourceReferences?: {
    documentName: string;
    section: string;
    snippet: string;
  }[];
  quizQuestion?: {
    question: string;
    options?: string[];
    correctAnswer?: string;
    explanation?: string;
  };
}

export interface CodeAnalysisResult {
  whatHappened: string;
  whyItHappened: string;
  whereLocation: string;
  howToFixCode: string;
  learnConcept: string;
  tryPracticeProblem: {
    title: string;
    description: string;
    starterCode: string;
    hint: string;
  };
}

export type CodeLanguage = 'javascript' | 'python' | 'java' | 'cpp' | 'c';

export type CodeAction = 'explain' | 'find_bug' | 'fix' | 'explain_error' | 'practice';

export interface Exam {
  id: string;
  subject: string;
  date: string;
  daysRemaining: number;
  location?: string;
  importantTopics: string[];
  status: 'upcoming' | 'urgent' | 'completed';
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  dueText: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  subject: string;
  completed: boolean;
  category: 'assignment' | 'exam' | 'practice';
}

export interface StudyPlanBlock {
  timeSlot: string;
  subject: string;
  topic: string;
  type: 'practice' | 'revision' | 'break' | 'coding';
  durationMinutes: number;
  reason: string;
}

export interface CompletedSession {
  id: string;
  topic: string;
  subject: string;
  durationMinutes: number;
  quizScore?: number;
  timestamp: string;
  completed: boolean;
}

export type AIMode = 'local' | 'demo';

export interface AIModelConfig {
  mode: AIMode;
  provider: 'ollama' | 'demo';
  modelName: string;
  baseUrl: string;
  connectionStatus: 'connected' | 'disconnected' | 'checking';
  temperature: number;
  ragEnabled: boolean;
  maxTokens: number;
  availableModels: string[];
  lastCheckedTime?: string;
}
