import type { PromptPayload, AIProviderResponse } from '../types';

export interface IAIProvider {
  name: string;
  isAvailable(): Promise<boolean>;
  generateResponse(
    payload: PromptPayload,
    onChunk?: (chunkText: string) => void
  ): Promise<AIProviderResponse>;
}
