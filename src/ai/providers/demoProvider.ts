import type { IAIProvider } from './baseProvider';
import type { PromptPayload, AIProviderResponse } from '../types';

export class DemoProvider implements IAIProvider {
  public name = 'Demo Fallback Provider (Standalone Demo Mode)';

  public async isAvailable(): Promise<boolean> {
    return true; // Always available for demo judges
  }

  public async generateResponse(
    payload: PromptPayload,
    onChunk?: (chunkText: string) => void
  ): Promise<AIProviderResponse> {
    const startTime = performance.now();
    await new Promise(res => setTimeout(res, 400 + Math.random() * 300));
    const endTime = performance.now();

    const { userMessage, context, mode } = payload;
    let groundedPrefix = '';
    if (context && context.length > 0) {
      groundedPrefix = `[Grounded from ${context[0].materialTitle}]\n\n`;
    }

    let responseText = '';

    if (mode === 'teach') {
      responseText = `${groundedPrefix}### 💡 Progressive Concept Breakdown

**1. Simple Explanation**
When learning "${userMessage}", the core idea is managing state transitions and memory frame allocations without breaking execution bounds.

**2. Example**
\`\`\`cpp
// Real-world demonstration
void demonstrateConcept() {
    int resourceState = 1; // Initial state
    if (resourceState == 1) {
        // Safe execution path
    }
}
\`\`\`

**3. Intuitive Analogy**
Imagine a single fitting room at a busy clothing store. The lock on the door is the semaphore: green (1) means free to enter, red (0) means wait outside until the occupant unlocks it.

**4. Quick Check**
If Process A holds the mutex lock and Process B attempts to acquire it, what state does Process B transition into?
(A) Running (B) Blocked/Waiting (C) Terminated`;
    } else if (mode === 'quiz') {
      responseText = `${groundedPrefix}**Quiz Question for You:**

What is the primary failure condition of recursion without a base case?

- A) StackOverflowException / Call stack memory exhausted
- B) Time Complexity becomes O(1)
- C) Compiler automatically converts it into a For loop
- D) Heap Corruption

*Reply with your choice (A, B, C, or D) to get instant evaluation and explanation!*`;
    } else if (mode === 'stuck') {
      responseText = `${groundedPrefix}### 🔄 Let's re-frame this from a different angle!

Instead of looking at abstract formulas, let's step through a visual step-by-step memory trace:

1. **Step 1 (Initial Call):** Function \`solve(3)\` gets pushed onto the Call Stack. It hasn't finished yet!
2. **Step 2 (Child Call):** Function \`solve(3)\` pauses and calls \`solve(2)\`.
3. **Step 3 (Unwinding):** Once \`solve(0)\` hits the base condition \`0\`, values pop off the stack in reverse order (LIFO).

Does viewing it as a physical stack of dinner plates make the unwinding process clearer?`;
    } else {
      if (userMessage.toLowerCase().includes('recursion') || userMessage.toLowerCase().includes('base case')) {
        responseText = `${groundedPrefix}Recursion is a programming technique where a function invokes itself to break down a complex problem into smaller sub-problems.

Key requirements:
1. **Base Case**: Prevents infinite calls by stopping recursion.
2. **Recursive Case**: Modifies arguments to move closer to the base case.

In your DSA notes (Unit 2), recursion is highlighted as essential for Tree Traversals (In-order, Pre-order, Post-order) and Divide-and-Conquer algorithms.`;
      } else if (userMessage.toLowerCase().includes('semaphore') || userMessage.toLowerCase().includes('process') || userMessage.toLowerCase().includes('sync')) {
        responseText = `${groundedPrefix}Process Synchronization ensures multiple concurrent processes safely share resources without race conditions.

As noted in your Operating Systems course material:
- **Semaphores** manage resource access via \`wait()\` [decrements] and \`signal()\` [increments].
- **Mutex Locks** provide binary mutual exclusion for critical sections.
- **Race Condition**: Occurs when execution output depends on non-deterministic order of process execution.`;
      } else {
        responseText = `${groundedPrefix}Based on your study context and notes:

${userMessage.trim()} is an important concept in your computer science curriculum. Focus on understanding the foundational principles, practice 2-3 standard problems, and test your understanding using the **[Quiz Me]** or **[Teach Me]** modes!`;
      }
    }

    if (onChunk) {
      // Simulate streaming chunks for demo provider
      const words = responseText.split(' ');
      for (let i = 0; i < words.length; i += 3) {
        const chunk = words.slice(i, i + 3).join(' ') + ' ';
        onChunk(chunk);
        await new Promise(r => setTimeout(r, 30));
      }
    }

    return {
      text: responseText,
      metadata: {
        modelName: 'Demo Fallback Model',
        tokensUsed: Math.floor(responseText.length / 4) + 20,
        latencyMs: Math.round(endTime - startTime),
      },
    };
  }
}
