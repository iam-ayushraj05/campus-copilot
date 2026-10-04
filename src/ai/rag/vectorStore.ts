import type { GroundedContext } from '../types';
import type { StudyMaterial } from '../../types';

export interface Chunk {
  id: string;
  materialId: string;
  materialTitle: string;
  text: string;
  tokens: string[];
}

export class MiniVectorStore {
  private chunks: Chunk[] = [];

  public indexMaterial(material: StudyMaterial): void {
    const rawSections = material.content.split(/\n\n+/);
    rawSections.forEach((section, index) => {
      const trimmed = section.trim();
      if (trimmed.length > 0) {
        const tokens = this.tokenize(trimmed);
        this.chunks.push({
          id: `${material.id}-chunk-${index}`,
          materialId: material.id,
          materialTitle: material.title,
          text: trimmed,
          tokens,
        });
      }
    });
  }

  public clear(): void {
    this.chunks = [];
  }

  public search(query: string, limit = 3): GroundedContext[] {
    if (this.chunks.length === 0) return [];
    
    const queryTokens = this.tokenize(query);
    if (queryTokens.length === 0) return [];

    const scored = this.chunks.map(chunk => {
      let matchCount = 0;
      queryTokens.forEach(qt => {
        if (chunk.tokens.includes(qt)) {
          matchCount++;
        }
      });
      const score = matchCount / Math.max(queryTokens.length, 1);
      return {
        materialId: chunk.materialId,
        materialTitle: chunk.materialTitle,
        relevantSnippet: chunk.text,
        score,
      };
    });

    return scored
      .filter(item => item.score > 0.1)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(t => t.length > 2);
  }
}

export const globalVectorStore = new MiniVectorStore();
