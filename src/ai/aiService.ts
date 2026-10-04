import { OllamaProvider } from './providers/ollamaProvider';
import { DemoProvider } from './providers/demoProvider';
import type { IAIProvider } from './providers/baseProvider';
import { globalVectorStore } from './rag/vectorStore';
import { getStudyBuddySystemPrompt } from './prompts/studyPrompts';
import { getCodeAnalysisPrompt } from './prompts/codePrompts';
import { getSmartPlanPrompt } from './prompts/plannerPrompts';
import { getLearningInsightPrompt } from './prompts/profilePrompts';
import type { PromptPayload, CodeAnalysisRequest, SmartPlanRequest, SmartPlanResult, AIProviderResponse } from './types';
import type { StudyMaterial, CodeLanguage, CodeAnalysisResult } from '../types';
import { analyzeCode } from './codeAnalysis';
import { generateSmartStudyPlan } from './plannerEngine';
import { computeNextBestMove, generateAIProfileInsight } from './profileEngine';

class AIServiceFacade {
  private ollamaProvider: OllamaProvider;
  private demoProvider: DemoProvider;
  private activeProvider: IAIProvider;

  constructor() {
    this.ollamaProvider = new OllamaProvider();
    this.demoProvider = new DemoProvider();
    this.activeProvider = this.demoProvider;
  }

  public async checkOllamaConnection(baseUrl = 'http://localhost:11434', modelName = 'llama3.1:8b') {
    this.ollamaProvider.setBaseUrl(baseUrl);
    this.ollamaProvider.setModel(modelName);

    const available = await this.ollamaProvider.isAvailable();
    if (available) {
      this.activeProvider = this.ollamaProvider;
      const models = await this.ollamaProvider.getAvailableModels();
      return { connected: true, models, activeModel: modelName };
    } else {
      this.activeProvider = this.demoProvider;
      return { connected: false, models: [], activeModel: 'Demo Mode' };
    }
  }

  public useDemoMode() {
    this.activeProvider = this.demoProvider;
  }

  public useLocalOllama(modelName = 'llama3.1:8b') {
    this.ollamaProvider.setModel(modelName);
    this.activeProvider = this.ollamaProvider;
  }

  public getActiveProviderName(): string {
    return this.activeProvider.name;
  }

  public isLocalOllamaActive(): boolean {
    return this.activeProvider === this.ollamaProvider;
  }

  public indexStudyMaterial(material: StudyMaterial): void {
    globalVectorStore.indexMaterial(material);
  }

  public async generateResponse(
    payload: PromptPayload,
    onChunk?: (chunkText: string) => void
  ): Promise<AIProviderResponse> {
    try {
      return await this.activeProvider.generateResponse(payload, onChunk);
    } catch (err) {
      console.warn('Active provider failed, switching to demo fallback:', err);
      return await this.demoProvider.generateResponse(payload, onChunk);
    }
  }

  public async askStudyBuddy(
    payload: PromptPayload,
    onChunk?: (chunkText: string) => void
  ): Promise<AIProviderResponse> {
    let groundedSnippet: string | undefined;

    if (payload.userMessage) {
      const groundedContexts = globalVectorStore.search(payload.userMessage, 2);
      if (groundedContexts.length > 0) {
        payload.context = groundedContexts;
        groundedSnippet = groundedContexts[0].relevantSnippet;
      }
    }

    const systemPrompt = getStudyBuddySystemPrompt(payload.mode || 'ask', groundedSnippet);
    payload.systemPrompt = systemPrompt;

    return await this.generateResponse(payload, onChunk);
  }

  public async explainCode(code: string, language: CodeLanguage, onChunk?: (chunkText: string) => void): Promise<AIProviderResponse> {
    const prompt = getCodeAnalysisPrompt(code, language, 'explain');
    return await this.generateResponse({ systemPrompt: 'You are CampusCopilot CodeExplain.', userMessage: prompt }, onChunk);
  }

  public async findBug(code: string, language: CodeLanguage, onChunk?: (chunkText: string) => void): Promise<AIProviderResponse> {
    const prompt = getCodeAnalysisPrompt(code, language, 'find_bug');
    return await this.generateResponse({ systemPrompt: 'You are CampusCopilot CodeExplain.', userMessage: prompt }, onChunk);
  }

  public async fixCode(code: string, language: CodeLanguage, onChunk?: (chunkText: string) => void): Promise<AIProviderResponse> {
    const prompt = getCodeAnalysisPrompt(code, language, 'fix');
    return await this.generateResponse({ systemPrompt: 'You are CampusCopilot CodeExplain.', userMessage: prompt }, onChunk);
  }

  public analyzeCodeSnippet(request: CodeAnalysisRequest): CodeAnalysisResult {
    return analyzeCode(request);
  }

  public async generateQuiz(subject: string, topic: string, onChunk?: (chunkText: string) => void): Promise<AIProviderResponse> {
    const prompt = `Generate 1 multiple choice quiz question about ${subject}: ${topic}. Include options A, B, C, D.`;
    return await this.generateResponse({ systemPrompt: getStudyBuddySystemPrompt('quiz'), userMessage: prompt }, onChunk);
  }

  public async evaluateAnswer(questionText: string, studentAnswer: string, onChunk?: (chunkText: string) => void): Promise<AIProviderResponse> {
    const prompt = `Question: "${questionText}". Student Answer: "${studentAnswer}". Evaluate correctness, explain mistake if any, and give score out of 100.`;
    return await this.generateResponse({ systemPrompt: getStudyBuddySystemPrompt('quiz'), userMessage: prompt }, onChunk);
  }

  public async buildStudyPlan(request: SmartPlanRequest): Promise<SmartPlanResult> {
    if (this.isLocalOllamaActive()) {
      try {
        const prompt = getSmartPlanPrompt(request);
        const res = await this.generateResponse({ systemPrompt: 'You are CampusCopilot Study Planner.', userMessage: prompt });
        const jsonMatch = res.text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const blocks = JSON.parse(jsonMatch[0]);
          return {
            summary: `Real Llama-3.1 Study Plan generated for ${request.availableHours} hours.`,
            blocks,
          };
        }
      } catch (e) {
        console.warn('Ollama JSON plan parse failed, falling back to algorithm:', e);
      }
    }
    return generateSmartStudyPlan(request);
  }

  public createSmartPlan(request: SmartPlanRequest): SmartPlanResult {
    return generateSmartStudyPlan(request);
  }

  public async generateLearningInsight(hours: number, accuracy: number, weakestTopic: string): Promise<string> {
    if (this.isLocalOllamaActive()) {
      try {
        const prompt = getLearningInsightPrompt(hours, accuracy, weakestTopic);
        const res = await this.generateResponse({ systemPrompt: 'You are CampusCopilot Profile Insight Engine.', userMessage: prompt });
        if (res.text && res.text.length > 20) return res.text.trim();
      } catch (e) {
        console.warn('Ollama profile insight failed, falling back to rule engine:', e);
      }
    }
    return generateAIProfileInsight(hours, accuracy, weakestTopic);
  }

  public getNextBestMove = computeNextBestMove;
  public getProfileInsight = generateAIProfileInsight;
}

export const aiService = new AIServiceFacade();
