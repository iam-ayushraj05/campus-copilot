export function getLearningInsightPrompt(
  studyHours: number,
  quizAccuracy: number,
  weakestTopic: string
): string {
  return `You are CampusCopilot Learning Profile Engine.
Analyze the following student performance metrics:
- Weekly Study Hours: ${studyHours} hrs
- Overall Quiz Accuracy: ${quizAccuracy}%
- Current Weakest Topic: ${weakestTopic}

Generate a concise 2-sentence personalized learning insight explaining how the student learns best and recommending what to do next.`;
}
