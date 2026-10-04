import type { IAIProvider } from './baseProvider';
import type { PromptPayload, AIProviderResponse } from '../types';

export class OllamaProvider implements IAIProvider {
  public name = 'Ollama Local AI (Llama 3.1 8B Instruct)';
  private baseUrl: string;
  private modelName: string;

  constructor(baseUrl = 'http://localhost:11434', modelName = 'llama3.1:8b') {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.modelName = modelName;
  }

  public setModel(modelName: string) {
    this.modelName = modelName;
  }

  public setBaseUrl(url: string) {
    this.baseUrl = url.replace(/\/$/, '');
  }

  public async isAvailable(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  public async getAvailableModels(): Promise<string[]> {
    try {
      const res = await fetch(`${this.baseUrl}/api/tags`);
      if (!res.ok) return [];
      const data = await res.json();
      return (data.models || []).map((m: { name: string }) => m.name);
    } catch {
      return [];
    }
  }

  public async generateResponse(
    payload: PromptPayload,
    onChunk?: (chunkText: string) => void
  ): Promise<AIProviderResponse> {
    const startTime = performance.now();
    const { systemPrompt, userMessage, context } = payload;

    let fullPrompt = userMessage;
    if (context && context.length > 0) {
      fullPrompt = `[Retrieved Context from ${context[0].materialTitle}]:\n${context[0].relevantSnippet}\n\n[User Request]:\n${userMessage}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.modelName,
          prompt: fullPrompt,
          system: systemPrompt,
          stream: !!onChunk,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama HTTP Error: ${response.status} ${response.statusText}`);
      }

      let textOutput = '';

      if (onChunk && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const parsed = JSON.parse(line);
              if (parsed.response) {
                textOutput += parsed.response;
                onChunk(parsed.response);
              }
            } catch {
              // Ignore partial JSON parse errors during chunk unrolling
            }
          }
        }
      } else {
        const data = await response.json();
        textOutput = data.response || '';
      }

      const endTime = performance.now();
      return {
        text: textOutput,
        metadata: {
          modelName: this.modelName,
          tokensUsed: Math.floor(textOutput.length / 4),
          latencyMs: Math.round(endTime - startTime),
        },
      };
    } catch (err) {
      console.warn('Ollama API connection failed. Falling back:', err);
      throw err;
    }
  }
}
