import type { StudyMode, CodeLanguage, CodeAction, StudyPlanBlock } from '../types';

export interface AIProviderResponse {
  text: string;
  metadata?: {
    modelName: string;
    tokensUsed: number;
    latencyMs: number;
  };
}

export interface GroundedContext {
  materialId: string;
  materialTitle: string;
  relevantSnippet: string;
  score: number;
}

export interface PromptPayload {
  systemPrompt: string;
  userMessage: string;
  context?: GroundedContext[];
  mode?: StudyMode;
}

export interface CodeAnalysisRequest {
  code: string;
  language: CodeLanguage;
  action: CodeAction;
  userNote?: string;
}

export interface QuizGenerateRequest {
  subject: string;
  topic: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
}

export interface SmartPlanRequest {
  availableHours: number;
  examDate: string;
  subjects: string[];
  currentConfidence: Record<string, number>;
  importantTopics: string[];
}

export interface SmartPlanResult {
  summary: string;
  blocks: StudyPlanBlock[];
}
